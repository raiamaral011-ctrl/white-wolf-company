import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        payments(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao buscar pedido: ' + err.message }, { status: 500 });
  }
}
