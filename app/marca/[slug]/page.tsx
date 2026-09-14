import React from 'react';
import { notFound } from 'next/navigation';
import { BRANDS } from '@/lib/data/products';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';
import { Metadata } from 'next';

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = BRANDS.find((b) => b.slug.toLowerCase() === params.slug.toLowerCase());
  if (!brand) return { title: 'Marca Não Encontrada | WHITE WOLF COMPANY' };

  return {
    title: `${brand.name} | WHITE WOLF COMPANY`,
    description: brand.description || `Confira a coleção oficial de produtos da marca ${brand.name}.`,
  };
}

export default function BrandDetailPage({ params }: BrandPageProps) {
  const brand = BRANDS.find((b) => b.slug.toLowerCase() === params.slug.toLowerCase());

  if (!brand) {
    notFound();
  }

  return (
    <CategoryCatalog
      title={`PRODUTOS ${brand.name.toUpperCase()}`}
      subtitle={brand.description || `Coleção oficial de produtos e calçados da marca ${brand.name}.`}
      brandSlug={brand.slug}
    />
  );
}
