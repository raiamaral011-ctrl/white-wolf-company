import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';
import { CATEGORIES } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error fetching admin categories:', err);
  }
  return NextResponse.json(CATEGORIES);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, image_url } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'O nome da categoria é obrigatório.' }, { status: 400 });
    }

    const slug = slugify(name);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug,
        description: description?.trim() || '',
        image_url: image_url?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, image_url } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, message: 'ID e Nome são obrigatórios.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: name.trim(),
        slug: slugify(name),
        description: description?.trim() || '',
        image_url: image_url?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID não informado.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Categoria excluída com sucesso.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
