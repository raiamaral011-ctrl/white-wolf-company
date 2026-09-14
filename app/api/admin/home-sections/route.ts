import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('home_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching home_sections:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('API GET /api/admin/home-sections error:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      title,
      subtitle,
      description,
      image_url,
      button_text,
      button_url,
      content,
      display_order,
      is_active,
    } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, message: 'Tipo de seção é obrigatório.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get current max display_order if not provided
    let nextOrder = display_order;
    if (nextOrder === undefined || nextOrder === null) {
      const { data: maxOrderData } = await supabase
        .from('home_sections')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      nextOrder = maxOrderData && maxOrderData.length > 0 ? (maxOrderData[0].display_order || 0) + 1 : 1;
    }

    const { data, error } = await supabase
      .from('home_sections')
      .insert({
        type,
        title: title || '',
        subtitle: subtitle || '',
        description: description || '',
        image_url: image_url || '',
        button_text: button_text || '',
        button_url: button_url || '',
        content: content || {},
        display_order: nextOrder,
        is_active: is_active !== undefined ? !!is_active : true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting home_section:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao criar seção: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seção criada com sucesso!',
      section: data,
    });
  } catch (err: any) {
    console.error('API POST /api/admin/home-sections error:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno: ' + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const supabase = createAdminClient();

    // Handle bulk order update: { reorder: [{ id, display_order }] }
    if (body.reorder && Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await supabase
          .from('home_sections')
          .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
          .eq('id', item.id);
      }
      return NextResponse.json({ success: true, message: 'Ordem atualizada com sucesso!' });
    }

    const {
      id,
      type,
      title,
      subtitle,
      description,
      image_url,
      button_text,
      button_url,
      content,
      display_order,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID da seção é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (button_text !== undefined) updateData.button_text = button_text;
    if (button_url !== undefined) updateData.button_url = button_url;
    if (content !== undefined) updateData.content = content;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = !!is_active;

    const { data, error } = await supabase
      .from('home_sections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating home_section:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar seção: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seção atualizada com sucesso!',
      section: data,
    });
  } catch (err: any) {
    console.error('API PUT /api/admin/home-sections error:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID da seção é obrigatório.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('home_sections').delete().eq('id', id);

    if (error) {
      console.error('Error deleting home_section:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao excluir seção: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seção removida com sucesso!',
    });
  } catch (err: any) {
    console.error('API DELETE /api/admin/home-sections error:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno: ' + err.message },
      { status: 500 }
    );
  }
}
