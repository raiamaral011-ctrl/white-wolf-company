import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';
import { MOCK_PRODUCTS, BRANDS, CATEGORIES } from '@/lib/data/products';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brandSlug = searchParams.get('brand');
  const categorySlug = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  try {
    const supabase = createAdminClient();
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

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let filtered = data;
      if (brandSlug) {
        filtered = filtered.filter((p: any) => p.brand?.slug === brandSlug);
      }
      if (categorySlug) {
        filtered = filtered.filter((p: any) => p.category?.slug === categorySlug);
      }
      return NextResponse.json(filtered);
    }
  } catch (err) {
    console.error('Error fetching admin products from Supabase:', err);
  }

  // Fallback to MOCK_PRODUCTS
  let result = [...MOCK_PRODUCTS];
  if (search) {
    result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (brandSlug) {
    result = result.filter((p) => p.brand?.slug === brandSlug);
  }
  if (categorySlug) {
    result = result.filter((p) => p.category?.slug === categorySlug);
  }
  if (featured === 'true') {
    result = result.filter((p) => p.featured);
  }
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      brand_id,
      category_id,
      description,
      sku,
      price,
      compare_at_price,
      gender,
      sport,
      featured,
      is_new,
      is_sale,
      media,
      variants,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Nome e Preço são obrigatórios.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Dynamically resolve valid brand_id
    let validBrandId = brand_id;
    if (!validBrandId) {
      const { data: dbBrands } = await supabase.from('brands').select('id').limit(1);
      if (dbBrands && dbBrands.length > 0) {
        validBrandId = dbBrands[0].id;
      } else {
        validBrandId = BRANDS[0].id;
      }
    }

    // Dynamically resolve valid category_id
    let validCategoryId = category_id;
    if (!validCategoryId) {
      const { data: dbCats } = await supabase.from('categories').select('id').limit(1);
      if (dbCats && dbCats.length > 0) {
        validCategoryId = dbCats[0].id;
      } else {
        validCategoryId = CATEGORIES[0].id;
      }
    }

    const safeSku = sku && sku.trim() ? sku.trim().toUpperCase() : `SKU-${Date.now().toString().slice(-6)}`;
    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);
    const parsedPrice = parseFloat(price);
    const parsedComparePrice = compare_at_price ? parseFloat(compare_at_price) : undefined;

    // 1. Insert into products
    const { data: newProd, error: prodError } = await supabase
      .from('products')
      .insert({
        name: name.trim(),
        slug,
        brand_id: validBrandId,
        category_id: validCategoryId,
        description: description?.trim() || '',
        sku: safeSku,
        price: parsedPrice,
        compare_at_price: parsedComparePrice,
        gender: gender || 'unisex',
        sport: sport || 'general',
        featured: !!featured,
        is_new: !!is_new,
        is_sale: !!is_sale,
        rating: 5.0,
        review_count: 1,
      })
      .select()
      .single();

    if (prodError || !newProd) {
      console.error('Error inserting product in Supabase:', prodError);
      return NextResponse.json(
        { success: false, message: 'Erro ao cadastrar produto no banco: ' + (prodError?.message || '') },
        { status: 500 }
      );
    }

    const productId = newProd.id;

    // 2. Insert media items (images and videos)
    const mediaList = Array.isArray(media) && media.length > 0 ? media : [];
    const mediaRows = mediaList.map((m: any, idx: number) => ({
      product_id: productId,
      url: m.url,
      alt: m.type || 'image',
      sort_order: idx + 1,
    }));

    if (mediaRows.length > 0) {
      await supabase.from('product_images').insert(mediaRows);
    } else {
      // Fallback standard image
      await supabase.from('product_images').insert({
        product_id: productId,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        alt: 'image',
        sort_order: 1,
      });
    }

    // 3. Insert variants with initial stock
    const variantList = Array.isArray(variants) && variants.length > 0
      ? variants
      : [
          { size: '39', stock: 10, color: '#0f172a', color_name: 'Padrão' },
          { size: '40', stock: 10, color: '#0f172a', color_name: 'Padrão' },
          { size: '41', stock: 10, color: '#0f172a', color_name: 'Padrão' },
          { size: '42', stock: 10, color: '#0f172a', color_name: 'Padrão' },
        ];

    const variantRows = variantList.map((v: any) => ({
      product_id: productId,
      sku: `${safeSku}-SZ${v.size}`,
      size: String(v.size),
      color: v.color || '#0f172a',
      color_name: v.color_name || 'Padrão',
      stock: parseInt(v.stock, 10) || 0,
    }));

    await supabase.from('product_variants').insert(variantRows);

    return NextResponse.json({
      success: true,
      message: 'Produto cadastrado com sucesso!',
      product: newProd,
    });
  } catch (error: any) {
    console.error('Error in POST /api/admin/products:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao salvar produto: ' + error.message },
      { status: 500 }
    );
  }
}
