'use client';

import React from 'react';
import { CategoryCatalog } from '@/components/product/CategoryCatalog';

export default function MaratonaPage() {
  return (
    <CategoryCatalog
      title="ESPAÇO MARATONISTA"
      subtitle="Calçados de alta tecnologia com placa de carbono e amortecimento responsivo selecionados para maratona e corridas de longa distância."
      isMaratona={true}
    />
  );
}

