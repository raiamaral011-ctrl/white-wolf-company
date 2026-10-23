import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    let targetUserId = user?.id;
    let targetEmail = user?.email;

    if (!targetUserId) {
      // Check admin session cookie
      const cookieStore = cookies();
      const adminToken = cookieStore.get('ww_admin_token');
      if (adminToken?.value) {
        try {
          const payload = JSON.parse(Buffer.from(adminToken.value, 'base64').toString('utf-8'));
          if (payload?.userId) {
            targetUserId = payload.userId;
            targetEmail = payload.email;
          }
        } catch {}
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const supabase = createAdminClient();
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (!profile) {
      // Create initial profile row
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          user_id: targetUserId,
          full_name: user?.user_metadata?.full_name || 'Atleta',
          email: targetEmail || '',
          role: 'customer',
        })
        .select()
        .single();
      profile = newProfile;
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    let targetUserId = user?.id;

    if (!targetUserId) {
      const cookieStore = cookies();
      const adminToken = cookieStore.get('ww_admin_token');
      if (adminToken?.value) {
        try {
          const payload = JSON.parse(Buffer.from(adminToken.value, 'base64').toString('utf-8'));
          if (payload?.userId) {
            targetUserId = payload.userId;
          }
        } catch {}
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, cpf, phone } = body;

    const supabase = createAdminClient();
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        full_name: full_name?.trim(),
        cpf: cpf?.trim() || null,
        phone: phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', targetUserId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
