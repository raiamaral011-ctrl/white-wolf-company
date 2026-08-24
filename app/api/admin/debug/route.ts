import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, any> = {};

  // Check env vars
  checks.env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET ✓' : 'MISSING ✗',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET ✓' : 'MISSING ✗',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET ✓' : 'MISSING ✗',
  };

  // Test Supabase connection
  try {
    const supabase = createAdminClient();

    const { data: brands, error: bErr } = await supabase
      .from('brands')
      .select('id, name')
      .limit(5);

    checks.brands = bErr ? { error: bErr.message } : { count: brands?.length, data: brands };

    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('id, name, sku')
      .limit(3);

    checks.products = pErr ? { error: pErr.message } : { count: products?.length, names: products?.map(p => p.name) };

    const { data: variants, error: vErr } = await supabase
      .from('product_variants')
      .select('id, size, stock')
      .limit(3);

    checks.variants = vErr ? { error: vErr.message } : { count: variants?.length };

    // Test insert permission
    const testSlug = 'debug-test-' + Date.now();
    const { data: inserted, error: iErr } = await supabase
      .from('products')
      .insert({
        name: '__DEBUG_TEST__',
        slug: testSlug,
        brand_id: 'b1000000-0000-0000-0000-000000000001',
        category_id: 'c1000000-0000-0000-0000-000000000001',
        description: 'Debug test',
        sku: 'DBG-' + Date.now(),
        price: 1.0,
        gender: 'unisex',
        rating: 4.5,
        review_count: 0,
      })
      .select()
      .single();

    if (iErr) {
      checks.insert_test = { error: iErr.message, code: iErr.code, details: iErr.details };
    } else {
      checks.insert_test = { success: true, id: inserted?.id };
      // Clean up the test product
      await supabase.from('products').delete().eq('id', inserted!.id);
    }

  } catch (err: any) {
    checks.connection_error = err.message;
  }

  return NextResponse.json(checks, { status: 200 });
}
