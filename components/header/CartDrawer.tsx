'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeItem, updateQuantity, subtotal, shipping, total, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-wolf-950 text-white border-l border-wolf-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-wolf-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-bold tracking-tight uppercase font-heading">
                SEU CARRINHO ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-wolf-800 text-wolf-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-16 h-16 text-wolf-700" />
                <p className="text-wolf-400 font-medium">Seu carrinho está vazio.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-white text-wolf-950 font-bold uppercase tracking-wider text-xs hover:bg-wolf-200 transition-colors"
                >
                  CONTINUAR COMPRANDO
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-wolf-900/60 border border-wolf-800 rounded-sm relative group"
                >
                  <div className="relative w-20 h-20 bg-wolf-950 flex-shrink-0 overflow-hidden rounded-sm border border-wolf-800">
                    <Image
                      src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-accent">
                        {item.product.brand?.name}
                      </span>
                      <h3 className="text-xs font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-wolf-400 mt-0.5">
                        Tamanho: <span className="text-white font-mono">{item.variant.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-wolf-700 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-wolf-300 hover:text-white hover:bg-wolf-800"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-wolf-300 hover:text-white hover:bg-wolf-800"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-white">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 text-wolf-500 hover:text-rose-400 p-1"
                    title="Remover produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-wolf-800 bg-wolf-950 space-y-4">
              <div className="space-y-1.5 text-xs text-wolf-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-emerald-400 font-bold uppercase text-[10px]">Grátis</span> : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-wolf-800">
                  <span className="uppercase font-heading">Total</span>
                  <span className="font-mono text-accent">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/30"
                >
                  FINALIZAR COMPRA
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/carrinho"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 bg-wolf-900 hover:bg-wolf-800 text-wolf-300 hover:text-white font-semibold text-xs uppercase tracking-wider text-center block transition-colors border border-wolf-800"
                >
                  VER CARRINHO COMPLETO
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
