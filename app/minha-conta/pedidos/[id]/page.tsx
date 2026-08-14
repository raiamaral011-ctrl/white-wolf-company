'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { formatCurrency } from '@/lib/utils';
import { Package, ArrowLeft, CheckCircle2, Truck, CreditCard } from 'lucide-react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = {
    id: params.id,
    date: '14/08/2026',
    status: 'Pagamento aprovado',
    paymentMethod: 'PIX',
    subtotal: 1199.90,
    shipping: 0.00,
    discount: 59.99,
    total: 1139.91,
    shippingAddress: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      cep: '01310-100',
    },
    items: [
      {
        product_name: 'Tênis Ultraboost Light Tech',
        product_sku: 'ADI-UB-01',
        size: '41',
        color: 'Preto/Vermelho',
        quantity: 1,
        unit_price: 1199.90,
        subtotal: 1199.90,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link href="/minha-conta/pedidos" className="text-xs font-mono text-accent hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> VOLTAR PARA MEUS PEDIDOS
          </Link>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            DETALHES DO PEDIDO #{order.id}
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ORDER ITEMS & STATUS (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-6">
            <div className="flex items-center gap-3 p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono text-xs rounded-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-white uppercase font-bold">STATUS DO PEDIDO: {order.status.toUpperCase()}</strong>
                <span>Seu pagamento foi confirmado com sucesso. O pedido está sendo embalado para envio.</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                ITENS DO PEDIDO
              </h3>
              <div className="divide-y divide-wolf-800 border-t border-b border-wolf-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-white font-bold block">{item.product_name}</span>
                      <span className="text-wolf-400">SKU: {item.product_sku} • Tamanho: {item.size} • Qtd: {item.quantity}</span>
                    </div>
                    <span className="text-white font-bold text-sm">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY & ADDRESS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading border-b border-wolf-800 pb-3">
              ENDEREÇO DE ENTREGA
            </h3>
            <div className="text-wolf-300 space-y-1">
              <p className="text-white font-bold">{order.shippingAddress.street}, {order.shippingAddress.number}</p>
              <p>{order.shippingAddress.complement}</p>
              <p>{order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}</p>
              <p>CEP: {order.shippingAddress.cep}</p>
            </div>
          </div>

          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-3 text-xs font-mono">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading border-b border-wolf-800 pb-3">
              PAGAMENTO &amp; TOTAL
            </h3>
            <div className="flex justify-between text-wolf-400">
              <span>Subtotal:</span>
              <span className="text-white">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-wolf-400">
              <span>Frete:</span>
              <span className="text-white">GRÁTIS</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Desconto PIX:</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-wolf-800 text-sm">
              <span>TOTAL:</span>
              <span className="text-accent">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
