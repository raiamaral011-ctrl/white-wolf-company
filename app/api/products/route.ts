import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const brandSlug = searchParams.get('brand');
  const categorySlug = searchParams.get('category');
  const q = searchParams.get('q');
  const featured = searchParams.get('featured');

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (slug) {
      query = query.eq('slug', slug);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let filtered = data as Product[];

      if (brandSlug) {
        filtered = filtered.filter(
          (p) => p.brand?.slug.toLowerCase() === brandSlug.toLowerCase()
        );
      }

      if (categorySlug) {
        filtered = filtered.filter(
          (p) => p.category?.slug.toLowerCase() === categorySlug.toLowerCase()
        );
      }

      if (q) {
        const term = q.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.brand?.name.toLowerCase().includes(term) ||
            p.category?.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term)
        );
      }

      if (slug) {
        return NextResponse.json(filtered[0] || null);
      }

      return NextResponse.json(filtered);
    }
  } catch (err) {
    console.error('Supabase fetch error, fallback to mock data:', err);
  }

  // Fallback to MOCK_PRODUCTS
  let filtered = [...MOCK_PRODUCTS];

  if (slug) {
    const found = filtered.find((p) => p.slug === slug);
    return NextResponse.json(found || null);
  }

  if (brandSlug) {
    filtered = filtered.filter(
      (p) => p.brand?.slug.toLowerCase() === brandSlug.toLowerCase()
    );
  }

  if (categorySlug) {
    filtered = filtered.filter(
      (p) => p.category?.slug.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured);
  }

  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand?.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    );
  }

  return NextResponse.json(filtered);
}
