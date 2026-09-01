import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ addresses: [] });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) {
      return NextResponse.json({ addresses: [] });
    }

    return NextResponse.json({ addresses: data || [] });
  } catch (err: any) {
    return NextResponse.json({ addresses: [] });
  }
}

export async function POST(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { name, cpf, cep, street, number, complement, neighborhood, city, state, is_default } = body;

    if (!street || !number || !cep || !city || !state) {
      return NextResponse.json({ error: 'Campos de endereço obrigatórios ausentes.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        name: name || 'Residencial',
        cpf: cpf || '',
        cep: cep.replace(/\D/g, ''),
        street,
        number,
        complement: complement || '',
        neighborhood,
        city,
        state: state.toUpperCase(),
        is_default: !!is_default,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, address: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID não informado.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
