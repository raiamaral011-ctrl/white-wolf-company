import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('ww_admin_token');

  if (!token || !token.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(token.value, 'base64').toString('utf-8'));

    if (payload && (payload.userId || payload.user || payload.email)) {
      const adminSupabase = createAdminClient();
      
      let query = adminSupabase
        .from('profiles')
        .select('id, user_id, full_name, email, role')
        .eq('role', 'admin');

      if (payload.userId) {
        query = query.eq('user_id', payload.userId);
      } else if (payload.email) {
        query = query.eq('email', payload.email);
      }

      const { data: profile, error } = await query.single();

      if (!error && profile) {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: profile.user_id,
            username: profile.full_name || profile.email,
            email: profile.email,
            role: 'admin',
          },
        });
      }
    }
  } catch (err) {
    console.error('Session verification error:', err);
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

