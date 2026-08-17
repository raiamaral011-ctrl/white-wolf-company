import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USER = 'raiamaral';
const ADMIN_PASS = 'R41@m4r@1';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const normalizedUser = (username || '').trim().toLowerCase();
    const providedPass = password || '';

    if (normalizedUser === ADMIN_USER && providedPass === ADMIN_PASS) {
      const cookieStore = cookies();
      const sessionToken = Buffer.from(
        JSON.stringify({
          user: ADMIN_USER,
          role: 'master_admin',
          timestamp: Date.now(),
        })
      ).toString('base64');

      cookieStore.set('ww_admin_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        message: 'Acesso concedido com sucesso.',
        user: { username: ADMIN_USER, role: 'Administrador Master' },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Credenciais inválidas. Verifique o usuário e a senha.',
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno ao processar login.' },
      { status: 500 }
    );
  }
}
