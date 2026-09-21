import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MOCK_PRODUCTS, BRANDS, CATEGORIES } from '@/lib/data/products';
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
    console.error('Error fetching product detail:', err);
  }

  return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
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

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Nome e preço são obrigatórios.' },
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
    const parsedPrice = parseFloat(price);
    const parsedComparePrice = compare_at_price ? parseFloat(compare_at_price) : undefined;

    // 1. Update product in Supabase
    const { data: updatedProd, error: updateError } = await supabase
      .from('products')
      .update({
        name: name.trim(),
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
      sku: `${safeSku}-SZ${v.size}`,
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
    if (mockIndex !== -1) {
      MOCK_PRODUCTS[mockIndex] = {
        ...MOCK_PRODUCTS[mockIndex],
        name: name.trim(),
        brand_id: validBrandId,
        category_id: validCategoryId,
        price: parsedPrice,
        compare_at_price: parsedComparePrice,
        description,
        sku: safeSku,
        updated_at: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      product: updatedProd,
    });
  } catch (err: any) {
    console.error('Error in PUT /api/admin/products/[id]:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao atualizar produto: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Erro ao excluir produto: ' + error.message },
        { status: 500 }
      );
    }

    // Remove from mock array if present
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'Produto excluído com sucesso.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro interno ao excluir produto: ' + err.message },
      { status: 500 }
    );
  }
}
