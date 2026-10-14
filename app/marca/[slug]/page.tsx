import React from 'react';
import { notFound } from 'next/navigation';
import { BRANDS } from '@/lib/data/products';
import { createAdminClient } from '@/lib/supabase/admin';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';
import { Metadata } from 'next';

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

async function getBrandData(slug: string) {
  const normalizedSlug = slug.toLowerCase();

  try {
    const supabase = createAdminClient();
    const { data: dbBrand } = await supabase
      .from('brands')
      .select('*')
      .ilike('slug', normalizedSlug)
      .single();

    if (dbBrand) return dbBrand;
  } catch (err) {
    console.error('Error fetching brand from Supabase:', err);
  }

  // Fallback to static brands
  return BRANDS.find((b) => b.slug.toLowerCase() === normalizedSlug) || null;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = await getBrandData(params.slug);
  if (!brand) return { title: 'Marca Não Encontrada | WHITE WOLF COMPANY' };

  return {
    title: `${brand.name} | WHITE WOLF COMPANY`,
    description: brand.description || `Confira a coleção oficial de produtos da marca ${brand.name}.`,
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const brand = await getBrandData(params.slug);

  if (!brand) {
    notFound();
  }

  return (
    <CategoryCatalog
      title={`TÊNIS ${brand.name.toUpperCase()}`}
      subtitle={brand.description || `Coleção oficial de calçados de alta performance da marca ${brand.name}.`}
      brandSlug={brand.slug}
    />
  );
}
