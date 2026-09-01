import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        payments(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error fetching admin orders:', err);
  }
  return NextResponse.json([]);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, payment_status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID do pedido é obrigatório.' }, { status: 400 });
    }

    const updateFields: any = {
      updated_at: new Date().toISOString(),
    };
    if (status) updateFields.status = status;
    if (payment_status) updateFields.payment_status = payment_status;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
