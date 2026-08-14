'use client';

import React from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MapPin, Plus } from 'lucide-react';

export default function MeusEnderecosPage() {
  const addresses = [
    {
      id: 'addr-1',
      name: 'Residencial',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      cep: '01310-100',
      isDefault: true,
    },
  ];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            ENTREGA E LOGÍSTICA
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-accent" /> MEUS ENDEREÇOS DE ENTREGA
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="flex justify-end">
          <button className="px-4 py-2.5 bg-accent text-white font-mono text-xs font-bold uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" /> NOVO ENDEREÇO
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-3 relative">
              {addr.isDefault && (
                <span className="px-2 py-0.5 bg-emerald-500 text-wolf-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xs">
                  PRINCIPAL
                </span>
              )}
              <h3 className="font-bold text-white uppercase text-sm font-heading">{addr.name}</h3>
              <div className="text-xs font-mono text-wolf-300 space-y-1">
                <p>{addr.street}, {addr.number} - {addr.complement}</p>
                <p>{addr.neighborhood} - {addr.city}/{addr.state}</p>
                <p>CEP: {addr.cep}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
