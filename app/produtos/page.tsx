'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';

function ProdutosContent() {
  const searchParams = useSearchParams();

  const brandSlug = searchParams.get('marca') || searchParams.get('brand') || undefined;
  const categorySlug = searchParams.get('categoria') || searchParams.get('category') || undefined;
  const genderFilter = searchParams.get('genero') || searchParams.get('gender') || undefined;

  let title = 'TODOS OS TÊNIS';
  let subtitle = 'Explore a coleção completa de tênis esportivos de elite, corrida de rua, maratona e treino.';

  if (brandSlug && categorySlug) {
    title = `TÊNIS ${brandSlug.toUpperCase()} • ${categorySlug.toUpperCase()}`;
    subtitle = `Filtrando tênis da marca ${brandSlug.toUpperCase()} para ${categorySlug.toUpperCase()}.`;
  } else if (brandSlug) {
    title = `TÊNIS ${brandSlug.toUpperCase()}`;
    subtitle = `Confira a coleção oficial de calçados esportivos ${brandSlug.toUpperCase()}.`;
  } else if (categorySlug) {
    title = `TÊNIS • ${categorySlug.toUpperCase()}`;
    subtitle = `Seleção de tênis de alta performance para ${categorySlug.toUpperCase()}.`;
  }

  return (
    <CategoryCatalog
      title={title}
      subtitle={subtitle}
      brandSlug={brandSlug}
      categorySlug={categorySlug}
      genderFilter={genderFilter}
    />
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-wolf-950 text-white p-12 text-center font-mono">Carregando catálogo de produtos...</div>}>
      <ProdutosContent />
    </Suspense>
  );
}
