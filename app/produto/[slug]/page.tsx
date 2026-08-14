'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { formatCurrency, calculateInstallments } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { useFavorites } from '@/context/favorites-context';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, Ruler, Check, ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants?.[0]?.size || '40');
  const [selectedColor, setSelectedColor] = useState<string>(product.variants?.[0]?.color_name || 'Padrão');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<{ normal: number; express: number } | null>(null);

  const favorite = isFavorite(product.id);
  const installments = calculateInstallments(product.price);
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const images = product.images?.length
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: product.name, sort_order: 1, created_at: '', product_id: product.id }];

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.size === selectedSize) || {
      id: `${product.id}-${selectedSize}`,
      product_id: product.id,
      sku: `${product.sku}-${selectedSize}`,
      size: selectedSize,
      color: '#0f172a',
      color_name: selectedColor,
      stock: 10,
      created_at: '',
      updated_at: '',
    };

    addItem(product, variant, 1);
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length >= 8) {
      setShippingResult({
        normal: product.price >= 299 ? 0 : 19.9,
        express: 34.9,
      });
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-wolf-900/60 border-b border-wolf-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono text-wolf-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/marca/${product.brand?.slug}`} className="hover:text-white uppercase">{product.brand?.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT GALLERY (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Display */}
          <div className="relative aspect-square bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden shadow-2xl">
            <Image
              src={images[selectedImage]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-wolf-950 font-mono font-black text-xs px-3 py-1 uppercase tracking-widest rounded-xs">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 bg-wolf-900 border rounded-sm overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-accent ring-2 ring-rose-600/30' : 'border-wolf-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT BUY BOX (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Brand & Title Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={`/marca/${product.brand?.slug}`}
                className="text-xs font-mono font-extrabold uppercase tracking-widest text-accent hover:underline"
              >
                {product.brand?.name}
              </Link>
              <span className="text-xs font-mono text-wolf-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-wolf-700'}`} />
                ))}
              </div>
              <span className="font-bold text-white">{product.rating}</span>
              <span className="text-wolf-400">({product.review_count} avaliações de atletas)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-wolf-900/60 border border-wolf-800 rounded-sm space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-white">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm font-mono text-wolf-500 line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-wolf-300">
              Em até <strong className="text-white">{installments.count}x de {formatCurrency(installments.amount)}</strong> sem juros no cartão
            </p>
            <p className="text-xs font-mono text-emerald-400 font-bold pt-1">
              ✓ 5% de desconto à vista via PIX ({formatCurrency(product.price * 0.95)})
            </p>
          </div>

          {/* SIZE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                SELECIONE O TAMANHO BR:
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                Guia de Tamanhos
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(product.variants || [{ size: '38' }, { size: '39' }, { size: '40' }, { size: '41' }, { size: '42' }, { size: '43' }, { size: '44' }]).map((v) => (
                <button
                  key={v.size}
                  onClick={() => setSelectedSize(v.size)}
                  className={`py-3 text-xs font-mono font-bold border rounded-xs transition-all ${
                    selectedSize === v.size
                      ? 'border-accent bg-accent text-white shadow-lg'
                      : 'border-wolf-800 bg-wolf-900 text-wolf-300 hover:border-wolf-600 hover:text-white'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-accent hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-950/50"
              >
                <ShoppingBag className="w-4 h-4" />
                ADICIONAR AO CARRINHO
              </button>

              <button
                onClick={() => toggleFavorite(product)}
                className={`p-4 border rounded-xs transition-colors ${
                  favorite ? 'border-accent bg-accent text-white' : 'border-wolf-800 bg-wolf-900 text-wolf-400 hover:text-white'
                }`}
                title="Favoritar"
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="w-full py-4 bg-white hover:bg-wolf-200 text-wolf-950 font-black text-xs uppercase tracking-widest text-center block transition-colors shadow-lg"
            >
              COMPRAR AGORA
            </Link>
          </div>

          {/* SHIPPING CALCULATOR */}
          <div className="p-4 bg-wolf-900/40 border border-wolf-800 rounded-sm space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-wolf-300 block">
              CALCULAR FRETE E PRAZO DE ENTREGA:
            </span>
            <form onSubmit={handleCalculateShipping} className="flex gap-2">
              <input
                type="text"
                placeholder="Informe seu CEP (ex: 01001-000)"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
                className="flex-1 bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 font-mono focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-wolf-800 hover:bg-wolf-700 text-white font-mono text-xs uppercase font-bold"
              >
                CALCULAR
              </button>
            </form>

            {shippingResult && (
              <div className="pt-2 border-t border-wolf-800 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-wolf-300">
                  <span>Entrega Normal (4-6 dias úteis):</span>
                  <span className="text-emerald-400 font-bold">
                    {shippingResult.normal === 0 ? 'GRÁTIS' : formatCurrency(shippingResult.normal)}
                  </span>
                </div>
                <div className="flex justify-between text-wolf-300">
                  <span>Entrega Expressa (1-2 dias úteis):</span>
                  <span className="text-white font-bold">{formatCurrency(shippingResult.express)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION SPECS */}
          <div className="border-t border-wolf-800 pt-6 space-y-4 text-xs">
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-white font-heading text-sm">
                DESCRIÇÃO DO PRODUTO
              </h3>
              <p className="text-wolf-400 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-wolf-950 border border-wolf-800 max-w-lg w-full p-6 space-y-4 rounded-sm">
            <div className="flex justify-between items-center border-b border-wolf-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                GUIA DE TAMANHOS DE TÊNIS
              </h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-wolf-400 hover:text-white font-mono">
                [FECHAR]
              </button>
            </div>
            <table className="w-full text-xs font-mono text-left text-wolf-300">
              <thead>
                <tr className="border-b border-wolf-800 text-white">
                  <th className="py-2">Tamanho BR</th>
                  <th className="py-2">Comprimento do Pé (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-900">
                <tr><td className="py-2">38</td><td>25.0 cm</td></tr>
                <tr><td className="py-2">39</td><td>25.5 cm</td></tr>
                <tr><td className="py-2">40</td><td>26.5 cm</td></tr>
                <tr><td className="py-2">41</td><td>27.5 cm</td></tr>
                <tr><td className="py-2">42</td><td>28.0 cm</td></tr>
                <tr><td className="py-2">43</td><td>29.0 cm</td></tr>
                <tr><td className="py-2">44</td><td>30.0 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
