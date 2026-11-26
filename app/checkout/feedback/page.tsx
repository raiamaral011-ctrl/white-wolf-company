'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { formatCurrency } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

function FeedbackContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
  const mpStatus = searchParams.get('status') || searchParams.get('collection_status');

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderStatus = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/checkout/status?order_id=${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        setError('Não foi possível consultar os detalhes do pedido no servidor.');
      }
    } catch (err: any) {
      setError('Erro de conexão ao consultar status do pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold font-heading uppercase text-white">NENHUM PEDIDO INFORMADO</h2>
        <p className="text-xs font-mono text-wolf-400">
          O retorno do pagamento não continha o código de identificação do pedido.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent text-white font-mono text-xs font-bold uppercase rounded-xs"
        >
          VOLTAR PARA A LOJA
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-24 space-y-4 max-w-md mx-auto">
        <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
        <h2 className="text-sm font-mono text-wolf-300 uppercase tracking-wider">
          CONSULTANDO ESTADO DO PEDIDO NO SERVIDOR...
        </h2>
      </div>
    );
  }

  // Real status from database (never blindly trust URL parameter)
  const isApproved = order?.paymentStatus === 'approved' || order?.status === 'approved';
  const isRejected =
    order?.paymentStatus === 'rejected' ||
    order?.paymentStatus === 'cancelled' ||
    mpStatus === 'failure' ||
    mpStatus === 'rejected';
  const isPending = !isApproved && !isRejected;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 1. PAGAMENTO APROVADO */}
      {isApproved && (
        <div className="bg-wolf-900 border border-emerald-900/80 p-8 rounded-sm shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              PAGAMENTO CONFIRMADO
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
              PEDIDO #{order.id}
            </h1>
            <p className="text-xs text-wolf-300 max-w-md mx-auto">
              Seu pagamento foi confirmado com sucesso pelo Mercado Pago! Já estamos preparando o envio dos seus produtos.
            </p>
          </div>

          {/* ORDER ITEMS & SUMMARY */}
          <div className="p-4 bg-wolf-950 border border-wolf-800 rounded-xs text-left text-xs font-mono space-y-3">
            <div className="space-y-1.5 pb-3 border-b border-wolf-800">
              <span className="text-[10px] text-wolf-500 uppercase tracking-wider block font-bold">ITENS COMPRADOS:</span>
              {(order.items || []).map((it: any) => (
                <div key={it.id} className="flex justify-between text-wolf-300">
                  <span>{it.product_name} (Tam: {it.size}) x{it.quantity}</span>
                  <span className="text-white font-bold">{formatCurrency(it.subtotal || it.unit_price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-white font-bold text-sm pt-1">
              <span>TOTAL PAGO:</span>
              <span className="text-emerald-400">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/minha-conta/pedidos"
              className="px-6 py-3.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> MEUS PEDIDOS
            </Link>
            <Link
              href="/tenis"
              className="px-6 py-3.5 bg-wolf-800 hover:bg-wolf-700 text-wolf-200 font-mono text-xs font-bold uppercase rounded-xs transition-colors"
            >
              CONTINUAR COMPRANDO
            </Link>
          </div>
        </div>
      )}

      {/* 2. PAGAMENTO PENDENTE */}
      {isPending && (
        <div className="bg-wolf-900 border border-amber-900/80 p-8 rounded-sm shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-950/80 border border-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              PAGAMENTO EM PROCESSAMENTO
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
              PEDIDO #{order.id}
            </h1>
            <p className="text-xs text-wolf-300 max-w-md mx-auto">
              O Mercado Pago ainda está processando a transação. Assim que a compensação for concluída (PIX ou análise do cartão), o status será atualizado automaticamente.
            </p>
          </div>

          <div className="p-4 bg-wolf-950 border border-wolf-800 rounded-xs text-left text-xs font-mono space-y-2">
            <div className="flex justify-between text-wolf-400">
              <span>Status Atual:</span>
              <span className="text-amber-400 font-bold uppercase">Aguardando Confirmação</span>
            </div>
            <div className="flex justify-between text-wolf-400">
              <span>Valor do Pedido:</span>
              <span className="text-white font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={fetchOrderStatus}
              className="px-6 py-3.5 bg-wolf-800 hover:bg-wolf-700 text-white font-mono text-xs font-bold uppercase rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> ATUALIZAR STATUS
            </button>
            <Link
              href="/minha-conta/pedidos"
              className="px-6 py-3.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase rounded-xs transition-colors"
            >
              ACOMPANHAR EM MEUS PEDIDOS
            </Link>
          </div>
        </div>
      )}

      {/* 3. PAGAMENTO RECUSADO */}
      {isRejected && (
        <div className="bg-wolf-900 border border-rose-900/80 p-8 rounded-sm shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-950/80 border border-rose-700 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-rose-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-widest block">
              PAGAMENTO NÃO APROVADO
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white">
              PEDIDO #{order.id}
            </h1>
            <p className="text-xs text-wolf-300 max-w-md mx-auto">
              O Mercado Pago não aprovou a transação. Você pode tentar novamente com outro cartão, PIX ou entrar em contato com o emissor do cartão.
            </p>
          </div>

          <div className="p-4 bg-wolf-950 border border-rose-950 rounded-xs text-left text-xs font-mono text-rose-300">
            Dica: Verifique o limite disponível, data de validade, código de segurança ou tente pagar via PIX com aprovação imediata.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/checkout"
              className="px-6 py-3.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> TENTAR NOVAMENTE O CHECKOUT
            </Link>
            <Link
              href="/carrinho"
              className="px-6 py-3.5 bg-wolf-800 hover:bg-wolf-700 text-wolf-200 font-mono text-xs font-bold uppercase rounded-xs transition-colors"
            >
              REVER CARRINHO
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutFeedbackPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center py-20 font-mono text-xs text-wolf-400">
              Carregando resultado do pagamento...
            </div>
          }
        >
          <FeedbackContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
