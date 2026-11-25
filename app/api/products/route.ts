import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { normalizeText } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get('slug');
  const brandSlug = searchParams.get('brand') || searchParams.get('marca');
  const categorySlug = searchParams.get('category') || searchParams.get('categoria');
  const sport = searchParams.get('sport');
  const size = searchParams.get('size') || searchParams.get('tamanho');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || searchParams.get('ordenar');
  const q = searchParams.get('q') || searchParams.get('search');
  const sale = searchParams.get('sale');
  const featured = searchParams.get('featured');
  const maratonaParam = searchParams.get('maratona') || searchParams.get('is_maratona');
  const inStockParam = searchParams.get('inStock') || searchParams.get('disponibilidade');

  try {
    const supabase = createAdminClient();

    // Fetch real products directly from Supabase DB
    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (slug) {
      query = query.eq('slug', slug);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (sale === 'true') {
      query = query.eq('is_sale', true);
    }
    if (maratonaParam === 'true') {
      query = query.eq('is_maratona', true);
    }

    const { data: dbProducts, error } = await query;

    let productsList: Product[] = [];

    if (!error && dbProducts && dbProducts.length > 0) {
      productsList = dbProducts as Product[];
    } else {
      productsList = [...MOCK_PRODUCTS];
    }

    // =========================================================================
    // PROMPT 2 REGRA FUNDAMENTAL: LOJA PÚBLICA EXCLUSIVAMENTE MASCULINA DE TÊNIS
    // 1. Somente tênis masculinos podem aparecer (p.gender === 'masculino').
    // 2. Produtos femininos e infantis NUNCA podem aparecer na loja pública.
    // 3. Roupas, camisetas, calças, shorts, jaquetas, bonés e acessórios NUNCA podem aparecer.
    // 4. Produtos com classificação duvidosa não são classificados como masculinos.
    // =========================================================================
    productsList = productsList.filter((p) => {
      // Regra 1: Gênero estritamente masculino
      const isMasculino = (p.gender?.toLowerCase() === 'masculino');
      if (!isMasculino) return false;

      // Regra 2: Categoria deve ser calçado / tênis (excluir vestuário e acessórios)
      const catSlug = (p.category?.slug || '').toLowerCase();
      const catName = (p.category?.name || '').toLowerCase();
      const isNonShoe = (
        catSlug.includes('roupa') ||
        catSlug.includes('vestuario') ||
        catSlug.includes('camiseta') ||
        catSlug.includes('calca') ||
        catSlug.includes('short') ||
        catSlug.includes('jaqueta') ||
        catSlug.includes('acessorio') ||
        catSlug.includes('bone') ||
        catSlug.includes('bolsa') ||
        catName.includes('Roupa') ||
        catName.includes('Acessório')
      );
      if (isNonShoe) return false;

      return true;
    });

    // Single product lookup by slug
    if (slug) {
      const single = productsList.find((p) => p.slug === slug) || null;
      return new NextResponse(JSON.stringify(single), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    }

    // =========================================================================
    // APLICAÇÃO DOS FILTROS PERMITIDOS (MARCA, TAMANHO, PREÇO, ESTOQUE, MARATONA, BUSCA)
    // NOTA: Conforme Prompt 2, os filtros públicos de Categoria e Gênero foram removidos.
    // =========================================================================
    let filtered = productsList;

    // 1. FILTRO DE MARATONA (Alta Performance)
    if (maratonaParam === 'true') {
      filtered = filtered.filter((p) => p.is_maratona === true);
    }

    // 2. FILTRO DE MARCA (Strict equality on brand slug or name)
    if (brandSlug && brandSlug.trim()) {
      const targetBrand = brandSlug.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const pBrandSlug = (p.brand?.slug || '').toLowerCase();
        const pBrandName = (p.brand?.name || '').toLowerCase();
        return pBrandSlug === targetBrand || pBrandName === targetBrand;
      });
    }

    // 3. FILTRO DE TAMANHO (Suporta tamanhos individuais ou múltiplos até 45)
    if (size && size.trim()) {
      const targetSizes = size.split(',').map((s) => s.trim());
      filtered = filtered.filter((p) => {
        if (!p.variants || p.variants.length === 0) return true;
        return p.variants.some((v) => targetSizes.includes(String(v.size)) && Number(v.stock) > 0);
      });
    }

    // 4. FILTRO DE DISPONIBILIDADE EM ESTOQUE
    if (inStockParam === 'true' || inStockParam === 'em_estoque') {
      filtered = filtered.filter((p) => {
        if (!p.variants || p.variants.length === 0) return true;
        const totalStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
        return totalStock > 0;
      });
    }

    // 5. FILTRO DE FAIXA DE PREÇO
    if (minPriceParam) {
      const minPrice = parseFloat(minPriceParam);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter((p) => Number(p.price) >= minPrice);
      }
    }

    if (maxPriceParam) {
      const maxPrice = parseFloat(maxPriceParam);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter((p) => Number(p.price) <= maxPrice);
      }
    }

    // 6. BUSCA TEXTUAL NORMALIZADA (COM E SEM ACENTUAÇÃO)
    // Ex: "tenis" encontra "tênis", "promocao" encontra "promoção"
    if (q && q.trim()) {
      const normQ = normalizeText(q);
      filtered = filtered.filter((p) => {
        const name = normalizeText(p.name);
        const brandName = normalizeText(p.brand?.name);
        const catName = normalizeText(p.category?.name);
        const sku = normalizeText(p.sku);
        const desc = normalizeText(p.description);
        return (
          name.includes(normQ) ||
          brandName.includes(normQ) ||
          catName.includes(normQ) ||
          sku.includes(normQ) ||
          desc.includes(normQ)
        );
      });
    }

    // 7. ORDENAÇÃO
    if (sort) {
      const s = sort.toLowerCase();
      if (s === 'price_asc' || s === 'price-asc' || s === 'menor-preco') {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (s === 'price_desc' || s === 'price-desc' || s === 'maior-preco') {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (s === 'rating' || s === 'avaliacoes') {
        filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      } else if (s === 'newest' || s === 'recentes') {
        filtered.sort(
          (a, b) =>
            new Date(b.created_at || Date.now()).getTime() -
            new Date(a.created_at || Date.now()).getTime()
        );
      }
    }

    return new NextResponse(JSON.stringify(filtered), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('Error in GET /api/products:', err);
    return new NextResponse(JSON.stringify([]), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
