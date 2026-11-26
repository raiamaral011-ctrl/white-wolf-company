import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'order_id é obrigatório' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        payment_status,
        payment_id,
        total,
        subtotal,
        shipping,
        created_at,
        customer_info,
        items:order_items(id, product_name, size, quantity, unit_price, subtotal)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Pedido não localizado' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentId: order.payment_id,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        createdAt: order.created_at,
        customerName: order.customer_info?.full_name,
        customerEmail: order.customer_info?.email,
        items: order.items || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao consultar status' }, { status: 500 });
  }
}
