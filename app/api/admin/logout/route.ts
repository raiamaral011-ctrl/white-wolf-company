import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = cookies();
  
  cookieStore.set('ww_admin_token', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
  });
  
  try {
    cookieStore.delete('ww_admin_token');
  } catch {}

  return NextResponse.json({
    success: true,
    message: 'Sessão encerrada com sucesso.',
  });
}
