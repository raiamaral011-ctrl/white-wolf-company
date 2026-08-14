import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminClientesPage() {
  const customers = [
    { id: '1', name: 'Lucas Silva', email: 'lucas.silva@exemplo.com.br', cpf: '123.456.789-00', orders: 2 },
    { id: '2', name: 'Fernanda Oliveira', email: 'fernanda@exemplo.com.br', cpf: '987.654.321-11', orders: 1 },
    { id: '3', name: 'Marcelo Santos', email: 'marcelo@exemplo.com.br', cpf: '456.789.123-22', orders: 4 },
  ];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="border-b border-wolf-800 pb-6">
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            BASE DE USUÁRIOS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            CLIENTES CADASTRADOS ({customers.length})
          </h1>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">NOME</th>
                <th className="p-4">E-MAIL</th>
                <th className="p-4">CPF</th>
                <th className="p-4">PEDIDOS REALIZADOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white">{c.name}</td>
                  <td className="p-4 text-wolf-300">{c.email}</td>
                  <td className="p-4 text-wolf-400">{c.cpf}</td>
                  <td className="p-4 font-bold text-accent">{c.orders} pedido(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
