import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('ww_admin_token');

  return NextResponse.json({
    success: true,
    message: 'Sessão encerrada com sucesso.',
  });
}
