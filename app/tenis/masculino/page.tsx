import { CategoryCatalog } from '@/components/product/CategoryCatalog';

export default function TenisMasculinoPage() {
  return (
    <CategoryCatalog
      title="TÊNIS MASCULINOS"
      subtitle="Silhuetas masculinas projetadas para máxima estabilidade, propulsão e conforto."
      categorySlug="tenis"
      genderFilter="masculino"
    />
  );
}
