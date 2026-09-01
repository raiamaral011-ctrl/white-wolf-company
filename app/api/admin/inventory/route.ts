import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MOCK_PRODUCTS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        product:products(id, name, sku, brand:brands(name), category:categories(name))
      `)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error fetching inventory from Supabase:', err);
  }

  // Fallback to MOCK_PRODUCTS if database table is empty
  const fallbackVariants = MOCK_PRODUCTS.flatMap((p) =>
    (p.variants || []).map((v) => ({
      ...v,
      product: {
        id: p.id,
        name: p.name,
        sku: p.sku,
        brand: { name: p.brand?.name },
        category: { name: p.category?.name },
      },
    }))
  );

  return NextResponse.json(fallbackVariants);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { variant_id, stock } = body;

    if (!variant_id || stock === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID da variante e estoque são obrigatórios.' },
        { status: 400 }
      );
    }

    const newStock = Math.max(0, parseInt(String(stock), 10));
    const supabase = createAdminClient();

    // 1. Attempt update directly by variant_id
    const { data: updatedData, error: updateError } = await supabase
      .from('product_variants')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', variant_id)
      .select()
      .single();

    if (!updateError && updatedData) {
      return NextResponse.json({
        success: true,
        message: 'Estoque atualizado com sucesso!',
        stock: newStock,
        variant: updatedData,
      });
    }

    // 2. If variant_id is a mock ID (e.g., 'a1000000-...-v1'), check if product exists in Supabase
    const baseProductId = variant_id.split('-v')[0];
    const { data: existingVariants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', baseProductId);

    if (existingVariants && existingVariants.length > 0) {
      const targetVar = existingVariants[0];
      await supabase
        .from('product_variants')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', targetVar.id);

      return NextResponse.json({
        success: true,
        message: 'Estoque atualizado com sucesso!',
        stock: newStock,
      });
    }

    // 3. Fallback memory update for mock products
    for (const p of MOCK_PRODUCTS) {
      const found = p.variants?.find((v) => v.id === variant_id);
      if (found) {
        found.stock = newStock;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Estoque atualizado com sucesso!',
      stock: newStock,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar estoque: ' + err.message },
      { status: 500 }
    );
  }
}
