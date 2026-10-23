import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    let targetUserId = user?.id;
    let targetEmail = user?.email;

    if (!targetUserId) {
      // Check admin session
      const cookieStore = cookies();
      const adminToken = cookieStore.get('ww_admin_token');
      if (adminToken?.value) {
        try {
          const payload = JSON.parse(Buffer.from(adminToken.value, 'base64').toString('utf-8'));
          if (payload?.userId) {
            targetUserId = payload.userId;
            targetEmail = payload.email;
          }
        } catch {}
      }
    }

    if (!targetUserId && !targetEmail) {
      return NextResponse.json({ error: 'Não autenticado', orders: [] }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Query orders by user_id
    const { data: userOrders } = targetUserId
      ? await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
      : { data: [] };

    // Query orders by email (for orders placed prior to or matching account email)
    const { data: emailOrders } = targetEmail
      ? await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .filter('customer_info->>email', 'eq', targetEmail)
          .order('created_at', { ascending: false })
      : { data: [] };

    // Combine and deduplicate by order ID
    const orderMap = new Map<string, any>();
    (userOrders || []).forEach((o: any) => orderMap.set(o.id, o));
    (emailOrders || []).forEach((o: any) => orderMap.set(o.id, o));

    const combined = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    return NextResponse.json({ orders: combined });
  } catch (err: any) {
    console.error('User orders API error:', err);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
