import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const supabase = createAdminClient();

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (user?.id) {
      query = query.eq('user_id', user.id);
    } else if (email) {
      query = query.filter('customer_info->>email', 'eq', email);
    } else {
      return NextResponse.json({ orders: [] });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user orders:', error);
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    console.error('User orders API error:', err);
    return NextResponse.json({ orders: [] });
  }
}
