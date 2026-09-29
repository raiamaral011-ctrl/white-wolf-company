import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tdwqrqcyhrprzijguulo.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkd3FycWN5aHJwcnppamd1dWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Njk4NDcsImV4cCI6MjEwMjU0NTg0N30.6b1SZtKvP7QLdRufE82Hd0Vkrn5JM292NjFNKP-1z-U';

export async function POST(req: Request) {
  try {
    const { username, email: rawEmail, password } = await req.json();

    const identifier = (rawEmail || username || '').trim().toLowerCase();
    const providedPass = password || '';

    if (!identifier || !providedPass) {
      return NextResponse.json(
        { success: false, message: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // Determine target email for Supabase Auth
    let targetEmail = identifier;
    if (!targetEmail.includes('@')) {
      const { data: matchedProfiles } = await adminSupabase
        .from('profiles')
        .select('email, role')
        .ilike('email', `${identifier}@%`)
        .limit(1);

      if (matchedProfiles && matchedProfiles.length > 0) {
        targetEmail = matchedProfiles[0].email;
      } else {
        targetEmail = `${identifier}@whitewolf.com`;
      }
    }

    // Authenticate through Supabase Auth
    const authSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: authData, error: authError } = await authSupabase.auth.signInWithPassword({
      email: targetEmail,
      password: providedPass,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciais inválidas. Verifique o usuário e a senha.',
        },
        { status: 401 }
      );
    }

    // Verify role in profiles table
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id, user_id, full_name, email, role')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Acesso negado. Este usuário não possui privilégios de administrador.',
        },
        { status: 403 }
      );
    }

    // Create secure admin session token
    const cookieStore = cookies();
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: authData.user.id,
        user: profile.full_name || profile.email,
        email: profile.email,
        fullName: profile.full_name,
        role: 'admin',
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
      user: {
        id: authData.user.id,
        username: profile.full_name || profile.email,
        email: profile.email,
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao processar autenticação.' },
      { status: 500 }
    );
  }
}

