'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          setError('Pedido não encontrado.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar pedido.');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center font-mono text-xs text-wolf-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          Carregando detalhes do pedido...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center font-mono space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-white uppercase">{error || 'Pedido não encontrado'}</h2>
          <Link href="/minha-conta/pedidos" className="inline-block px-6 py-2.5 bg-wolf-900 border border-wolf-800 text-white text-xs font-bold uppercase hover:border-accent">
            ← VOLTAR PARA MEUS PEDIDOS
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shippingAddr = order.shipping_address || {};
  const items = order.items || [];
  const paymentDetails = order.payments?.[0] || {};

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
                <strong className="block text-white uppercase font-bold">STATUS DO PEDIDO: {String(order.status).toUpperCase()}</strong>
                <span>Seu pedido foi registrado no sistema e o pagamento está com status: {String(order.payment_status).toUpperCase()}.</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                ITENS DO PEDIDO
              </h3>
              <div className="divide-y divide-wolf-800 border-t border-b border-wolf-800">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-white font-bold block">{item.product_name}</span>
                      <span className="text-wolf-400">SKU: {item.product_sku} • Tamanho: {item.size} • Cor: {item.color} • Qtd: {item.quantity}</span>
                    </div>
                    <span className="text-white font-bold text-sm">{formatCurrency(item.subtotal || item.unit_price * item.quantity)}</span>
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
              <p className="text-white font-bold">{shippingAddr.street}, {shippingAddr.number}</p>
              {shippingAddr.complement && <p>{shippingAddr.complement}</p>}
              <p>{shippingAddr.neighborhood} - {shippingAddr.city}/{shippingAddr.state}</p>
              <p>CEP: {shippingAddr.cep}</p>
            </div>
          </div>

          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-3 text-xs font-mono">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading border-b border-wolf-800 pb-3">
              PAGAMENTO &amp; TOTAL
            </h3>
            <div className="flex justify-between text-wolf-400">
              <span>Forma de Pagamento:</span>
              <span className="text-white uppercase font-bold">{paymentDetails.payment_method || 'Mercado Pago'}</span>
            </div>
            <div className="flex justify-between text-wolf-400">
              <span>Subtotal:</span>
              <span className="text-white">{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-wolf-400">
              <span>Frete:</span>
              <span className="text-white">{order.shipping > 0 ? formatCurrency(order.shipping) : 'GRÁTIS'}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Desconto:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold pt-2 border-t border-wolf-800 text-sm">
              <span>TOTAL:</span>
              <span className="text-accent">{formatCurrency(order.total || 0)}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
