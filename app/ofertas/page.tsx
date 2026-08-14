import { CategoryCatalog } from '@/components/product/CategoryCatalog';

export default function OfertasPage() {
  return (
    <CategoryCatalog
      title="OFERTAS & PROMOÇÕES"
      subtitle="Confira todos os produtos com preços imperdíveis e descontos exclusivos."
      onlySale={true}
    />
  );
}
