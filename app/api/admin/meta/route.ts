import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { BRANDS, CATEGORIES } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch brands and categories from Supabase
    const [brandsRes, categoriesRes] = await Promise.all([
      supabase.from('brands').select('*').order('name', { ascending: true }),
      supabase.from('categories').select('*').order('name', { ascending: true })
    ]);

    const brands = brandsRes.data && brandsRes.data.length > 0 ? brandsRes.data : BRANDS;
    const categories = categoriesRes.data && categoriesRes.data.length > 0 ? categoriesRes.data : CATEGORIES;

    return NextResponse.json({
      success: true,
      brands,
      categories
    });
  } catch (err: any) {
    console.error('Error fetching meta data:', err);
    return NextResponse.json({
      success: true,
      brands: BRANDS,
      categories: CATEGORIES,
      warning: 'Fallback metadata used due to database connection error'
    });
  }
}
