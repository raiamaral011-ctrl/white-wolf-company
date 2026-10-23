import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error signing out on server:', err);
  }

  const cookieStore = cookies();
  
  // Explicitly invalidate admin session cookie
  cookieStore.set('ww_admin_token', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  });

  return NextResponse.json({
    success: true,
    message: 'Sessão encerrada com sucesso.',
  });
}
