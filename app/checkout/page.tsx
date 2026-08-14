'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, ArrowRight, Check, CreditCard, QrCode, Copy, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Lucas Silva',
    email: 'lucas.silva@exemplo.com.br',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    cep: '01310-100',
    street: 'Avenida Paulista',
    number: '1000',
    complement: 'Apto 42',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    shippingMethod: 'normal' as 'normal' | 'express',
    paymentMethod: 'pix' as 'pix' | 'credit_card',
    cardNumber: '',
    cardHolder: '',
    cardExp: '',
    cardCvv: '',
    installments: 1,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmitOrder();
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutData: {
            fullName: formData.fullName,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
            cep: formData.cep,
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            shippingMethod: formData.shippingMethod,
            paymentMethod: formData.paymentMethod,
            installments: formData.installments,
          },
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao finalizar pedido.');
      }

      setCreatedOrder(data.order);
      setStep(5);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado durante o checkout.');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (createdOrder?.paymentDetails?.qrCode) {
      navigator.clipboard.writeText(createdOrder.paymentDetails.qrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  if (items.length === 0 && step !== 5) {
    return (
      <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold font-heading uppercase text-white">NENHUM ITEM NO CARRINHO</h2>
            <p className="text-wolf-400 text-sm">Adicione produtos ao carrinho antes de ir para o checkout.</p>
            <Link href="/tenis" className="inline-block px-8 py-3 bg-accent text-white font-bold text-xs uppercase tracking-widest">
              IR PARA O CATÁLOGO
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* STEP PROGRESS HEADER */}
      <section className="bg-wolf-900 border-b border-wolf-800 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center text-xs font-mono">
            {[
              { num: 1, label: 'Identificação' },
              { num: 2, label: 'Endereço' },
              { num: 3, label: 'Entrega' },
              { num: 4, label: 'Pagamento' },
              { num: 5, label: 'Confirmação' },
            ].map((s) => (
              <div key={s.num} className={`flex items-center gap-2 ${step >= s.num ? 'text-accent font-bold' : 'text-wolf-600'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-[11px] ${step >= s.num ? 'border-accent bg-accent text-white' : 'border-wolf-700 bg-wolf-950'}`}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden md:inline uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-3 rounded-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 5: SUCCESSFUL CONFIRMATION */}
        {step === 5 && createdOrder ? (
          <div className="max-w-2xl mx-auto bg-wolf-900 border border-wolf-800 p-8 space-y-8 rounded-sm shadow-2xl text-center">
            <div className="space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
                PEDIDO CRIADO COM SUCESSO!
              </span>
              <h2 className="text-2xl font-black font-heading uppercase text-white">
                NÚMERO DO PEDIDO: #{createdOrder.id}
              </h2>
              <p className="text-xs text-wolf-300">
                Enviamos os detalhes da sua compra para <strong className="text-white">{createdOrder.customerInfo.email}</strong>.
              </p>
            </div>

            {/* PIX DISPLAY IF PIX */}
            {createdOrder.paymentMethod === 'pix' && (
              <div className="p-6 bg-wolf-950 border border-wolf-800 rounded-sm space-y-4 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                  <QrCode className="w-5 h-5" />
                  PAGUE COM PIX - APROVAÇÃO INSTANTÂNEA
                </div>
                <p className="text-xs text-wolf-300">
                  Escaneie o QR Code abaixo no app do seu banco ou copie a chave Pix Copia e Cola:
                </p>

                <div className="flex justify-center p-4 bg-white rounded-xs">
                  <QrCode className="w-48 h-48 text-black" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-wolf-400 uppercase">CÓDIGO PIX COPIA E COLA:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdOrder.paymentDetails?.qrCode || '00020126580014BR.GOV.BCB.PIX...'}
                      className="flex-1 bg-wolf-900 border border-wolf-800 px-3 py-2 text-xs font-mono text-wolf-300 focus:outline-none"
                    />
                    <button
                      onClick={copyPixCode}
                      className="px-4 py-2 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedPix ? 'COPIADO!' : 'COPIAR'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUMMARY INFO */}
            <div className="p-4 bg-wolf-950/60 border border-wolf-800 rounded-sm text-left text-xs font-mono space-y-2">
              <div className="flex justify-between text-wolf-400">
                <span>Subtotal:</span>
                <span className="text-white">{formatCurrency(createdOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-wolf-400">
                <span>Frete:</span>
                <span className="text-white">{createdOrder.shipping === 0 ? 'GRÁTIS' : formatCurrency(createdOrder.shipping)}</span>
              </div>
              {createdOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Desconto PIX (5%):</span>
                  <span>-{formatCurrency(createdOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold pt-2 border-t border-wolf-800 text-sm">
                <span>TOTAL PAGO:</span>
                <span className="text-accent">{formatCurrency(createdOrder.total)}</span>
              </div>
            </div>

            <Link
              href="/minha-conta/pedidos"
              className="inline-block px-8 py-4 bg-white text-wolf-950 font-black text-xs uppercase tracking-widest hover:bg-wolf-200 transition-colors"
            >
              VER MEUS PEDIDOS NA CONTA →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* STEP FORM INPUTS (7 Cols) */}
            <div className="lg:col-span-7 bg-wolf-900 border border-wolf-800 p-6 space-y-6 rounded-sm">
              {/* STEP 1: IDENTIFICATION */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-heading uppercase text-white border-b border-wolf-800 pb-3">
                    1. IDENTIFICAÇÃO DO CLIENTE
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-wolf-300 block mb-1">NOME COMPLETO *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL PRINCIPAL *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">CPF *</label>
                        <input
                          type="text"
                          required
                          value={formData.cpf}
                          onChange={(e) => handleChange('cpf', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">TELEFONE DE CONTATO *</label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-heading uppercase text-white border-b border-wolf-800 pb-3">
                    2. ENDEREÇO DE ENTREGA
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">CEP *</label>
                        <input
                          type="text"
                          required
                          value={formData.cep}
                          onChange={(e) => handleChange('cep', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">CIDADE *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-mono text-wolf-300 block mb-1">LOGRADOURO (RUA) *</label>
                        <input
                          type="text"
                          required
                          value={formData.street}
                          onChange={(e) => handleChange('street', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">NÚMERO *</label>
                        <input
                          type="text"
                          required
                          value={formData.number}
                          onChange={(e) => handleChange('number', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">COMPLEMENTO</label>
                        <input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => handleChange('complement', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-wolf-300 block mb-1">BAIRRO *</label>
                        <input
                          type="text"
                          required
                          value={formData.neighborhood}
                          onChange={(e) => handleChange('neighborhood', e.target.value)}
                          className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SHIPPING */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-heading uppercase text-white border-b border-wolf-800 pb-3">
                    3. FORMA DE ENTREGA
                  </h2>
                  <div className="space-y-3">
                    <label className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-colors ${formData.shippingMethod === 'normal' ? 'border-accent bg-wolf-950' : 'border-wolf-800 bg-wolf-950/40'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'normal'}
                          onChange={() => handleChange('shippingMethod', 'normal')}
                          className="accent-rose-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-white uppercase block">ENTREGA NORMAL (4-6 DIAS ÚTEIS)</span>
                          <span className="text-[11px] text-wolf-400">Transportadora parceira com rastreio completo.</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {subtotal >= 299 ? 'GRÁTIS' : formatCurrency(19.9)}
                      </span>
                    </label>

                    <label className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-colors ${formData.shippingMethod === 'express' ? 'border-accent bg-wolf-950' : 'border-wolf-800 bg-wolf-950/40'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'express'}
                          onChange={() => handleChange('shippingMethod', 'express')}
                          className="accent-rose-600"
                        />
                        <div>
                          <span className="text-xs font-bold text-white uppercase block">ENTREGA EXPRESSA (1-2 DIAS ÚTEIS)</span>
                          <span className="text-[11px] text-wolf-400">Sedex / Courier priorul.</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatCurrency(34.9)}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold font-heading uppercase text-white border-b border-wolf-800 pb-3">
                    4. PAGAMENTO MERCADO PAGO
                  </h2>
                  <div className="space-y-3">
                    <label className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-colors ${formData.paymentMethod === 'pix' ? 'border-accent bg-wolf-950' : 'border-wolf-800 bg-wolf-950/40'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'pix'}
                          onChange={() => handleChange('paymentMethod', 'pix')}
                          className="accent-rose-600"
                        />
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-emerald-400" />
                          <div>
                            <span className="text-xs font-bold text-white uppercase block">PIX (5% DE DESCONTO)</span>
                            <span className="text-[11px] text-wolf-400">Aprovação imediata e QR Code na tela.</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">DESCONTO 5%</span>
                    </label>

                    <label className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-colors ${formData.paymentMethod === 'credit_card' ? 'border-accent bg-wolf-950' : 'border-wolf-800 bg-wolf-950/40'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={() => handleChange('paymentMethod', 'credit_card')}
                          className="accent-rose-600"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-accent" />
                          <div>
                            <span className="text-xs font-bold text-white uppercase block">CARTÃO DE CRÉDITO</span>
                            <span className="text-[11px] text-wolf-400">Parcele em até 10x sem juros.</span>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* CREDIT CARD FIELDS IF CARD SELECTED */}
                    {formData.paymentMethod === 'credit_card' && (
                      <div className="p-4 bg-wolf-950 border border-wolf-800 space-y-3 rounded-sm mt-3">
                        <div>
                          <label className="text-[11px] font-mono text-wolf-400 block mb-1">NÚMERO DO CARTÃO</label>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) => handleChange('cardNumber', e.target.value)}
                            className="w-full bg-wolf-900 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-mono text-wolf-400 block mb-1">VALIDADE (MM/AA)</label>
                            <input
                              type="text"
                              placeholder="12/28"
                              value={formData.cardExp}
                              onChange={(e) => handleChange('cardExp', e.target.value)}
                              className="w-full bg-wolf-900 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-mono text-wolf-400 block mb-1">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              value={formData.cardCvv}
                              onChange={(e) => handleChange('cardCvv', e.target.value)}
                              className="w-full bg-wolf-900 border border-wolf-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between pt-4 border-t border-wolf-800">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    className="px-6 py-3 bg-wolf-950 border border-wolf-800 hover:bg-wolf-800 text-white font-mono text-xs font-bold uppercase"
                  >
                    ← VOLTAR
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3.5 bg-accent hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-rose-950/50 disabled:opacity-50"
                >
                  {loading ? 'PROCESSANDO...' : step === 4 ? 'FINALIZAR E PAGAR' : 'AVANÇAR DA ETAPA →'}
                </button>
              </div>
            </div>

            {/* ORDER SIDEBAR SUMMARY (5 Cols) */}
            <div className="lg:col-span-5 bg-wolf-900 border border-wolf-800 p-6 space-y-4 rounded-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading border-b border-wolf-800 pb-3">
                RESUMO DO PEDIDO ({items.length} ITENS)
              </h3>
              <div className="space-y-3 text-xs font-mono text-wolf-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-white font-bold">{shipping === 0 ? 'GRÁTIS' : formatCurrency(shipping)}</span>
                </div>
                {formData.paymentMethod === 'pix' && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Desconto PIX (5%)</span>
                    <span>-{formatCurrency(subtotal * 0.05)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-3 border-t border-wolf-800">
                  <span>TOTAL ESTIMADO</span>
                  <span className="text-accent font-mono text-base">
                    {formatCurrency(subtotal + shipping - (formData.paymentMethod === 'pix' ? subtotal * 0.05 : 0))}
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
