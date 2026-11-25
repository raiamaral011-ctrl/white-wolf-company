import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// GET /api/favorites — Retrieve favorite product IDs for the logged-in user
export async function GET(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user }, error: authErr } = await supabaseServer.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ favoriteIds: [] });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: error.message, favoriteIds: [] }, { status: 500 });
    }

    const favoriteIds = (data || []).map((row) => row.product_id);
    return NextResponse.json({ favoriteIds });
  } catch (err: any) {
    console.error('Favorites GET error:', err);
    return NextResponse.json({ error: err.message, favoriteIds: [] }, { status: 500 });
  }
}

// POST /api/favorites — Add product to favorites for the logged-in user
export async function POST(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user }, error: authErr } = await supabaseServer.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Faça login para salvar favoritos.' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, productIds } = body;

    const supabase = createAdminClient();

    // Handle batch sync (e.g. migrating local favorites on login)
    if (Array.isArray(productIds) && productIds.length > 0) {
      const rows = productIds.map((pId) => ({
        user_id: user.id,
        product_id: pId,
      }));

      const { error } = await supabase
        .from('favorites')
        .upsert(rows, { onConflict: 'user_id,product_id' });

      if (error) {
        console.error('Error batch upserting favorites:', error);
      }
    } else if (productId) {
      const { error } = await supabase
        .from('favorites')
        .upsert(
          { user_id: user.id, product_id: productId },
          { onConflict: 'user_id,product_id' }
        );

      if (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'productId obrigatório.' }, { status: 400 });
    }

    // Return updated list
    const { data: updated } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    const favoriteIds = (updated || []).map((row) => row.product_id);
    return NextResponse.json({ success: true, favoriteIds });
  } catch (err: any) {
    console.error('Favorites POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/favorites — Remove product from favorites
export async function DELETE(req: Request) {
  try {
    const supabaseServer = createClient();
    const { data: { user }, error: authErr } = await supabaseServer.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId obrigatório.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return updated list
    const { data: updated } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    const favoriteIds = (updated || []).map((row) => row.product_id);
    return NextResponse.json({ success: true, favoriteIds });
  } catch (err: any) {
    console.error('Favorites DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
