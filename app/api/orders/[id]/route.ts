import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    let targetUserId = user?.id;
    let targetEmail = user?.email;
    let isAdmin = false;

    // Check admin session
    const cookieStore = cookies();
    const adminToken = cookieStore.get('ww_admin_token');
    if (adminToken?.value) {
      try {
        const payload = JSON.parse(Buffer.from(adminToken.value, 'base64').toString('utf-8'));
        if (payload?.role === 'admin') {
          isAdmin = true;
          targetUserId = targetUserId || payload.userId;
          targetEmail = targetEmail || payload.email;
        }
      } catch {}
    }

    if (!targetUserId && !targetEmail && !isAdmin) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        payments(*)
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Security check: ensure order belongs to this customer or user is admin
    if (!isAdmin) {
      const orderUserId = order.user_id;
      const orderCustomerEmail = order.customer_info?.email;

      const isOwner =
        (targetUserId && orderUserId === targetUserId) ||
        (targetEmail && orderCustomerEmail?.toLowerCase() === targetEmail.toLowerCase());

      if (!isOwner) {
        return NextResponse.json(
          { error: 'Acesso negado. Você não tem permissão para visualizar este pedido.' },
          { status: 403 }
        );
      }
    }

    // Attach product images to items
    const pIds = (order.items || []).map((i: any) => i.product_id).filter(Boolean);
    if (pIds.length > 0) {
      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, url')
        .in('product_id', pIds)
        .order('sort_order', { ascending: true });

      const imgMap = new Map<string, string>();
      (images || []).forEach((img: any) => {
        if (!imgMap.has(img.product_id)) {
          imgMap.set(img.product_id, img.url);
        }
      });

      order.items = order.items.map((item: any) => ({
        ...item,
        image_url: imgMap.get(item.product_id) || null,
      }));
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao buscar pedido: ' + err.message }, { status: 500 });
  }
}
