'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';

function ProdutosContent() {
  const searchParams = useSearchParams();

  const brandSlug = searchParams.get('marca') || searchParams.get('brand') || undefined;
  const categorySlug = searchParams.get('categoria') || searchParams.get('category') || undefined;
  const genderFilter = searchParams.get('genero') || searchParams.get('gender') || undefined;

  let title = 'TODOS OS PRODUTOS';
  let subtitle = 'Explore o catálogo completo de vestuário e calçados esportivos de alta performance.';

  if (brandSlug && categorySlug) {
    title = `PRODUTOS ${brandSlug.toUpperCase()} • ${categorySlug.toUpperCase()}`;
    subtitle = `Filtrando produtos da marca ${brandSlug.toUpperCase()} na categoria ${categorySlug.toUpperCase()}.`;
  } else if (brandSlug) {
    title = `PRODUTOS ${brandSlug.toUpperCase()}`;
    subtitle = `Confira a coleção completa de produtos da marca ${brandSlug.toUpperCase()}.`;
  } else if (categorySlug) {
    title = `PRODUTOS • ${categorySlug.toUpperCase()}`;
    subtitle = `Catálogo de produtos selecionados da categoria ${categorySlug.toUpperCase()}.`;
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
