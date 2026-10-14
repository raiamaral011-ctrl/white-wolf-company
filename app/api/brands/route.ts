import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { BRANDS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all brands ordered by name
    const { data: dbBrands, error } = await supabase
      .from('brands')
      .select('*, products(id)')
      .order('name', { ascending: true });

    if (!error && dbBrands && dbBrands.length > 0) {
      const brandsWithCount = dbBrands.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description || '',
        logo_url: b.logo_url || '',
        product_count: b.products?.length || 0,
        created_at: b.created_at,
      }));

      return NextResponse.json({
        success: true,
        brands: brandsWithCount,
      });
    }

    // Fallback to static brands if database query returns empty or errors
    return NextResponse.json({
      success: true,
      brands: BRANDS,
    });
  } catch (err: any) {
    console.error('Error fetching brands:', err);
    return NextResponse.json({
      success: true,
      brands: BRANDS,
    });
  }
}
