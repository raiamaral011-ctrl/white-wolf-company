import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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
      .eq('id', id)
      .single();

    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error fetching single admin product:', err);
  }

  // Fallback
  const found = MOCK_PRODUCTS.find((p) => p.id === id);
  if (found) {
    return NextResponse.json(found);
  }

  return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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

    if (!name || !brand_id || !category_id || !sku || !price) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios ausentes.' },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    const parsedComparePrice = compare_at_price ? parseFloat(compare_at_price) : null;

    const supabase = createAdminClient();

    // 1. Update general info in Supabase
    const { data: updatedProd, error: updateError } = await supabase
      .from('products')
      .update({
        name,
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedProd) {
      console.error('Error updating product in Supabase:', updateError);
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar produto: ' + (updateError?.message || '') },
        { status: 500 }
      );
    }

    // 2. Update media files (delete existing images and insert the new array)
    await supabase.from('product_images').delete().eq('product_id', id);

    const mediaList = Array.isArray(media) && media.length > 0 ? media : [];
    const mediaRows = mediaList.map((m: any, idx: number) => ({
      product_id: id,
      url: m.url,
      alt: m.type || 'image',
      sort_order: idx + 1,
    }));

    if (mediaRows.length > 0) {
      await supabase.from('product_images').insert(mediaRows);
    } else {
      await supabase.from('product_images').insert({
        product_id: id,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        alt: 'image',
        sort_order: 1,
      });
    }

    // 3. Update variants (delete existing variants and insert new ones)
    await supabase.from('product_variants').delete().eq('product_id', id);

    const variantList = Array.isArray(variants) && variants.length > 0 ? variants : [];
    const variantRows = variantList.map((v: any) => ({
      product_id: id,
      sku: `${sku.toUpperCase()}-SZ${v.size}`,
      size: String(v.size),
      color: v.color || '#0f172a',
      color_name: v.color_name || 'Padrão',
      stock: parseInt(v.stock, 10) || 0,
    }));

    if (variantRows.length > 0) {
      await supabase.from('product_variants').insert(variantRows);
    }

    // Also update in-memory mock products
    const mockIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    const updatedMockProduct: Product = {
      id,
      brand_id,
      category_id,
      name,
      slug: updatedProd.slug,
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
      created_at: updatedProd.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: mediaRows.map((mr, idx) => ({
        id: 'img-' + Date.now() + '-' + idx,
        product_id: id,
        url: mr.url,
        alt: mr.alt,
        sort_order: mr.sort_order,
        created_at: new Date().toISOString(),
      })),
      variants: variantRows.map((vr, i) => ({
        id: 'var-' + Date.now() + '-' + i,
        product_id: id,
        sku: vr.sku,
        size: vr.size,
        color: vr.color,
        color_name: vr.color_name,
        stock: vr.stock,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    };

    if (mockIndex !== -1) {
      MOCK_PRODUCTS[mockIndex] = updatedMockProduct;
    } else {
      MOCK_PRODUCTS.unshift(updatedMockProduct);
    }

    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      product: updatedMockProduct,
    });

  } catch (err: any) {
    console.error('Error updating product:', err);
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar produto: ' + err.message },
      { status: 500 }
    );
  }
}
