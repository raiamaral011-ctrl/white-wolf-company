import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get('slug');
  const brandSlug = searchParams.get('brand') || searchParams.get('marca');
  const categorySlug = searchParams.get('category') || searchParams.get('categoria');
  const gender = searchParams.get('gender') || searchParams.get('genero');
  const sport = searchParams.get('sport');
  const size = searchParams.get('size') || searchParams.get('tamanho');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || searchParams.get('ordenar');
  const q = searchParams.get('q') || searchParams.get('search');
  const sale = searchParams.get('sale');
  const featured = searchParams.get('featured');
  const maratonaParam = searchParams.get('maratona') || searchParams.get('is_maratona');

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

    if (!error && dbProducts) {
      productsList = dbProducts as Product[];
    }

    // Exclude Roupas and Acessórios from public catalog
    productsList = productsList.filter((p) => {
      const catSlug = p.category?.slug?.toLowerCase() || '';
      return catSlug !== 'roupas' && catSlug !== 'acessorios';
    });

    // Single product lookup by slug
    if (slug) {
      const single = productsList.find((p) => p.slug === slug) || null;
      return NextResponse.json(single);
    }

    // APPLY STRICT FILTERS (AND LOGIC)
    let filtered = productsList;

    // 0. MARATONA FILTER (Strict boolean)
    if (maratonaParam === 'true') {
      filtered = filtered.filter((p) => p.is_maratona === true);
    }

    // 1. BRAND FILTER (Strict equality on brand slug or name)
    if (brandSlug && brandSlug.trim()) {
      const targetBrand = brandSlug.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const pBrandSlug = p.brand?.slug?.toLowerCase() || '';
        const pBrandName = p.brand?.name?.toLowerCase() || '';
        return pBrandSlug === targetBrand || pBrandName === targetBrand;
      });
    }

    // 2. CATEGORY FILTER (Strict equality on category slug or name)
    if (categorySlug && categorySlug.trim()) {
      const targetCat = categorySlug.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const pCatSlug = p.category?.slug?.toLowerCase() || '';
        const pCatName = p.category?.name?.toLowerCase() || '';
        return pCatSlug === targetCat || pCatName === targetCat;
      });
    }

    // 3. GENDER FILTER
    if (gender && gender.trim()) {
      const targetGender = gender.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const pGender = p.gender?.toLowerCase() || 'unisex';
        return pGender === targetGender || pGender === 'unisex';
      });
    }

    // 4. SPORT FILTER
    if (sport && sport.trim()) {
      const targetSport = sport.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const pSport = p.sport?.toLowerCase() || 'general';
        const pName = p.name?.toLowerCase() || '';
        const pDesc = p.description?.toLowerCase() || '';
        return (
          pSport === targetSport ||
          pName.includes(targetSport) ||
          pDesc.includes(targetSport)
        );
      });
    }

    // 5. SIZE FILTER
    if (size && size.trim()) {
      const targetSize = size.trim();
      filtered = filtered.filter((p) => {
        if (!p.variants || p.variants.length === 0) return true;
        return p.variants.some((v) => String(v.size) === targetSize && Number(v.stock) > 0);
      });
    }

    // 6. PRICE RANGE FILTERS
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

    // 7. SEARCH QUERY FILTER
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const name = p.name?.toLowerCase() || '';
        const brandName = p.brand?.name?.toLowerCase() || '';
        const catName = p.category?.name?.toLowerCase() || '';
        const sku = p.sku?.toLowerCase() || '';
        const desc = p.description?.toLowerCase() || '';
        return (
          name.includes(term) ||
          brandName.includes(term) ||
          catName.includes(term) ||
          sku.includes(term) ||
          desc.includes(term)
        );
      });
    }

    // 8. SORTING
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

    return NextResponse.json(filtered);
  } catch (err: any) {
    console.error('Error in GET /api/products:', err);
    return NextResponse.json([]);
  }
}
