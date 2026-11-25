'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';

function ProdutosContent() {
  const searchParams = useSearchParams();

  const brandSlug = searchParams.get('marca') || searchParams.get('brand') || undefined;
  const categorySlug = searchParams.get('categoria') || searchParams.get('category') || undefined;
  const genderFilter = searchParams.get('genero') || searchParams.get('gender') || undefined;

  let title = 'TÊNIS MASCULINOS DE ELITE';
  let subtitle = 'Explore a coleção oficial de tênis esportivos masculinos: corrida de rua, maratona e treino.';

  if (brandSlug) {
    title = `TÊNIS MASCULINOS ${brandSlug.toUpperCase()}`;
    subtitle = `Confira a coleção oficial de calçados masculinos ${brandSlug.toUpperCase()}.`;
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
