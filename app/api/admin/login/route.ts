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
    let emailsToTry: string[] = [];
    if (normalizedUser.includes('@')) {
      emailsToTry.push(normalizedUser);
    } else {
      emailsToTry.push(`${normalizedUser}@whitewolf.com`);
      if (normalizedUser === 'guillermo') emailsToTry.push('guillhermo@whitewolf.com');
      if (normalizedUser === 'guillhermo') emailsToTry.push('guillermo@whitewolf.com');
    }

    let adminUser: { username: string; email: string; role: string; id?: string } | null = null;

    // Try authenticating with Supabase Auth
    for (const emailToAuth of emailsToTry) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: providedPass,
      });

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
          break;
        } else {
          // Found user but role is customer or not admin
          return NextResponse.json(
            {
              success: false,
              message: 'Acesso negado: Este usuário não possui privilégios de administrador.',
            },
            { status: 403 }
          );
        }
      }
    }

    // Fallback for known admin users if auth API didn't resolve directly
    if (!adminUser) {
      if (
        (normalizedUser === 'guillermo' || normalizedUser === 'guillhermo' || normalizedUser === 'guillermo@whitewolf.com' || normalizedUser === 'guillhermo@whitewolf.com') &&
        providedPass === 'guizinho77'
      ) {
        adminUser = {
          username: 'guillermo',
          email: 'guillermo@whitewolf.com',
          role: 'Administrador',
        };
      } else if (
        (normalizedUser === 'rianhenrique' || normalizedUser === 'rianhenrique@whitewolf.com') &&
        providedPass === 'rianroludo'
      ) {
        adminUser = {
          username: 'rianhenrique',
          email: 'rianhenrique@whitewolf.com',
          role: 'Administrador',
        };
      } else if (
        (normalizedUser === 'raiamaral' || normalizedUser === 'raiamaral@whitewolf.com') &&
        providedPass === 'R41@m4r@1'
      ) {
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

