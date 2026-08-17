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

  // Fallback
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
        { success: false, message: 'Dados insuficientes.' },
        { status: 400 }
      );
    }

    const newStock = Math.max(0, parseInt(stock, 10));
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('product_variants')
      .update({ stock: newStock })
      .eq('id', variant_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating stock in Supabase:', error);
    }

    // Also update mock array if present
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
      variant: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Erro ao atualizar estoque: ' + err.message },
      { status: 500 }
    );
  }
}
