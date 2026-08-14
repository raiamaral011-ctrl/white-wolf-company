'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, shipping, total } = useCart();

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            RESUMO DAS SUAS COMPRAS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-accent" />
            CARRINHO DE COMPRAS
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {items.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-wolf-800 rounded-sm space-y-4">
            <ShoppingBag className="w-16 h-16 text-wolf-700 mx-auto" />
            <h2 className="text-xl font-bold font-heading uppercase text-white">SEU CARRINHO ESTÁ VAZIO</h2>
            <p className="text-wolf-400 text-sm max-w-md mx-auto">
              Explore os mais novos lançamentos de tênis e roupas esportivas e adicione seus favoritos.
            </p>
            <Link
              href="/tenis"
              className="inline-block px-8 py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              CONTINUAR COMPRANDO
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ITEMS LIST (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-wolf-800 text-xs font-mono text-wolf-400 uppercase">
                <span>PRODUTO</span>
                <button onClick={clearCart} className="hover:text-rose-400">ESVAZIAR CARRINHO</button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-wolf-900/60 border border-wolf-800 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 bg-wolf-950 rounded-sm overflow-hidden flex-shrink-0 border border-wolf-800">
                      <Image src={item.product.images?.[0]?.url || ''} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-accent uppercase tracking-widest block font-bold">
                        {item.product.brand?.name}
                      </span>
                      <Link href={`/produto/${item.product.slug}`} className="text-sm font-bold text-white hover:text-accent line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-wolf-400 font-mono mt-1">
                        Tamanho: <strong className="text-white">{item.variant.size}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-wolf-800">
                    <div className="flex items-center border border-wolf-700 rounded-sm">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-xs text-wolf-300 hover:text-white hover:bg-wolf-800">-</button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-xs text-wolf-300 hover:text-white hover:bg-wolf-800">+</button>
                    </div>

                    <span className="text-sm font-mono font-bold text-white">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>

                    <button onClick={() => removeItem(item.id)} className="text-wolf-500 hover:text-rose-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading border-b border-wolf-800 pb-3">
                  RESUMO DO PEDIDO
                </h3>

                <div className="space-y-3 text-xs font-mono text-wolf-300">
                  <div className="flex justify-between">
                    <span>Subtotal dos produtos</span>
                    <span className="text-white font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete estimado</span>
                    <span className="text-white font-bold">
                      {shipping === 0 ? <span className="text-emerald-400 font-bold uppercase">Grátis</span> : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-white font-bold pt-3 border-t border-wolf-800">
                    <span>TOTAL</span>
                    <span className="text-accent font-mono text-base">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-accent hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-950/50"
                >
                  IR PARA O CHECKOUT
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-[11px] font-mono text-wolf-400 justify-center pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ambiente de pagamento 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
