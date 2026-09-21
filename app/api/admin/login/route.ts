import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const normalizedUser = (username || '').trim().toLowerCase();
    const providedPass = password || '';

    if (!normalizedUser || !providedPass) {
      return NextResponse.json(
        { success: false, message: 'Informe o usuário e a senha.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Determine email for Supabase Auth
    let emailToAuth = normalizedUser;
    if (!emailToAuth.includes('@')) {
      emailToAuth = `${normalizedUser}@whitewolf.com`;
    }

    // Try authenticating with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password: providedPass,
    });

    let adminUser: { username: string; email: string; role: string; id?: string } | null = null;

    if (!authError && authData?.user) {
      // Check role in profiles or user_metadata
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('user_id', authData.user.id)
        .single();

      const userRole = profile?.role || authData.user.user_metadata?.role;

      if (userRole === 'admin' || userRole === 'master_admin') {
        adminUser = {
          id: authData.user.id,
          username: authData.user.user_metadata?.username || normalizedUser.split('@')[0],
          email: authData.user.email || emailToAuth,
          role: profile?.role === 'master_admin' ? 'Administrador Master' : 'Administrador',
        };
      }
    }

    // Fallback for known admin users if auth API didn't resolve directly
    if (!adminUser) {
      if (
        (normalizedUser === 'rianhenrique' && providedPass === 'guizinho77') ||
        (normalizedUser === 'rianhenrique@whitewolf.com' && providedPass === 'guizinho77')
      ) {
        adminUser = {
          username: 'rianhenrique',
          email: 'rianhenrique@whitewolf.com',
          role: 'Administrador',
        };
      } else if (
        (normalizedUser === 'guillhermo' && providedPass === 'rianroludo') ||
        (normalizedUser === 'guillhermo@whitewolf.com' && providedPass === 'rianroludo')
      ) {
        adminUser = {
          username: 'guillhermo',
          email: 'guillhermo@whitewolf.com',
          role: 'Administrador',
        };
      } else if (normalizedUser === 'raiamaral' && providedPass === 'R41@m4r@1') {
        adminUser = {
          username: 'raiamaral',
          email: 'raiamaral@whitewolf.com',
          role: 'Administrador Master',
        };
      }
    }

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais inválidas ou usuário sem privilégios de administrador.',
        },
        { status: 401 }
      );
    }

    const cookieStore = cookies();
    const sessionToken = Buffer.from(
      JSON.stringify({
        user: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
        id: adminUser.id,
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
      user: adminUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Erro interno ao processar login.' },
      { status: 500 }
    );
  }
}

