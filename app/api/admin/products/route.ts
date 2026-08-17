import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { slugify } from '@/lib/utils';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Supabase admin products fetch error:', err);
  }

  return NextResponse.json(MOCK_PRODUCTS);
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
      image_url,
      variants,
    } = body;

    if (!name || !brand_id || !category_id || !sku || !price) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);
    const parsedPrice = parseFloat(price);
    const parsedComparePrice = compare_at_price ? parseFloat(compare_at_price) : null;

    const supabase = createAdminClient();

    // 1. Insert into products
    const { data: newProd, error: prodError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        brand_id,
        category_id,
        description: description || '',
        sku: sku.toUpperCase(),
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

    // 2. Insert image
    const finalImageUrl = image_url?.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80';
    await supabase.from('product_images').insert({
      product_id: productId,
      url: finalImageUrl,
      alt: name,
      sort_order: 1,
    });

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
      sku: `${sku.toUpperCase()}-SZ${v.size}`,
      size: String(v.size),
      color: v.color || '#0f172a',
      color_name: v.color_name || 'Padrão',
      stock: parseInt(v.stock, 10) || 0,
    }));

    await supabase.from('product_variants').insert(variantRows);

    // Also update in-memory mock products if fallback is active
    const newMockProduct: Product = {
      id: productId,
      brand_id,
      category_id,
      name,
      slug,
      description,
      sku: sku.toUpperCase(),
      price: parsedPrice,
      compare_at_price: parsedComparePrice,
      gender: gender || 'unisex',
      sport: sport || 'general',
      featured: !!featured,
      is_new: !!is_new,
      is_sale: !!is_sale,
      rating: 5.0,
      review_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        {
          id: 'img-' + Date.now(),
          product_id: productId,
          url: finalImageUrl,
          alt: name,
          sort_order: 1,
          created_at: new Date().toISOString(),
        },
      ],
      variants: variantRows.map((vr, i) => ({
        id: 'var-' + Date.now() + '-' + i,
        product_id: productId,
        sku: vr.sku,
        size: vr.size,
        color: vr.color,
        color_name: vr.color_name,
        stock: vr.stock,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    };

    MOCK_PRODUCTS.unshift(newMockProduct);

    return NextResponse.json({
      success: true,
      message: 'Produto cadastrado e publicado com sucesso!',
      product: newProd,
    });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao processar cadastro: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID do produto não informado.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Delete dependent records
    await supabase.from('product_variants').delete().eq('product_id', id);
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('favorites').delete().eq('product_id', id);
    await supabase.from('cart_items').delete().eq('product_id', id);

    // 2. Delete product
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Supabase error deleting product:', error);
    }

    // Also remove from local mock array if present
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'Produto e suas variantes excluídos com sucesso.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro ao excluir produto: ' + err.message },
      { status: 500 }
    );
  }
}
