import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch user profiles and orders
    const [profilesRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('user_id, customer_info, total, status'),
    ]);

    const profiles = profilesRes.data || [];
    const orders = ordersRes.data || [];

    // Map order counts & totals to profiles or guest customers
    const customerMap = new Map<string, any>();

    profiles.forEach((p) => {
      customerMap.set(p.email?.toLowerCase(), {
        id: p.id,
        name: p.full_name || 'Cliente',
        email: p.email,
        cpf: p.cpf || 'Não informado',
        phone: p.phone || '-',
        role: p.role || 'customer',
        ordersCount: 0,
        totalSpent: 0,
        createdAt: p.created_at,
      });
    });

    orders.forEach((o) => {
      const email = o.customer_info?.email?.toLowerCase();
      if (!email) return;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          id: `guest-${email}`,
          name: o.customer_info?.full_name || o.customer_info?.fullName || 'Cliente Visitante',
          email,
          cpf: o.customer_info?.cpf || 'Não informado',
          phone: o.customer_info?.phone || '-',
          role: 'customer',
          ordersCount: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
        });
      }

      const existing = customerMap.get(email);
      existing.ordersCount += 1;
      if (o.status !== 'cancelled') {
        existing.totalSpent += Number(o.total || 0);
      }
    });

    const resultList = Array.from(customerMap.values());
    return NextResponse.json(resultList);
  } catch (err: any) {
    console.error('Error fetching admin customers:', err);
    return NextResponse.json([]);
  }
}
