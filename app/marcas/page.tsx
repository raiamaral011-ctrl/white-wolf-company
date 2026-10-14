import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { BRANDS, MOCK_PRODUCTS } from '@/lib/data/products';
import { createAdminClient } from '@/lib/supabase/admin';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marcas | WHITE WOLF COMPANY',
  description: 'Confira as marcas de elite disponíveis na White Wolf Company: Adidas, Nike, ASICS, Puma, New Balance e muito mais.',
};

export const dynamic = 'force-dynamic';

export default async function MarcasPage() {
  let brandsList: any[] = [];

  try {
    const supabase = createAdminClient();
    const { data: dbBrands } = await supabase
      .from('brands')
      .select('*, products(id)')
      .order('name', { ascending: true });

    if (dbBrands && dbBrands.length > 0) {
      brandsList = dbBrands.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description || `Coleção de calçados de alta performance ${b.name}.`,
        productCount: b.products?.length || 0,
      }));
    }
  } catch (err) {
    console.error('Error fetching brands in MarcasPage:', err);
  }

  // Fallback to static brands if DB is empty
  if (brandsList.length === 0) {
    brandsList = BRANDS.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description,
      productCount: MOCK_PRODUCTS.filter((p) => p.brand?.slug === b.slug).length,
    }));
  }

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 w-full">
        {/* HEADER SECTION */}
        <div className="border-b border-wolf-800 pb-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            PARCEIROS OFICIAIS
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight font-heading">
            MARCAS ESPORTIVAS DE ELITE
          </h1>
          <p className="text-wolf-400 text-sm max-w-2xl">
            Trabalhamos exclusivamente com as maiores marcas globais de calçados e tênis para garantir qualidade, durabilidade e alta tecnologia para o seu treino e dia a dia.
          </p>
        </div>

        {/* BRANDS LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brandsList.map((brand) => (
            <div key={brand.id} className="bg-wolf-900/60 border border-wolf-800 p-8 rounded-sm space-y-6 flex flex-col justify-between hover:border-wolf-600 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-wolf-800 pb-3">
                  <h2 className="text-2xl font-black font-heading tracking-tight text-white">
                    {brand.name}
                  </h2>
                  <span className="text-xs font-mono text-accent uppercase font-bold">
                    {brand.productCount} PRODUTO{brand.productCount === 1 ? '' : 'S'}
                  </span>
                </div>
                <p className="text-xs text-wolf-300 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <Link
                href={`/marca/${brand.slug}`}
                className="w-full py-3 bg-wolf-950 hover:bg-accent border border-wolf-700 hover:border-accent text-white font-bold text-xs uppercase tracking-widest text-center transition-colors block font-mono"
              >
                VER PRODUTOS {brand.name.toUpperCase()} →
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
