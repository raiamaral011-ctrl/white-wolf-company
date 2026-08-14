import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatCurrency } from '@/lib/utils';

export default function AdminPedidosPage() {
  const orders = [
    { id: 'ORD-172363000-482', customer: 'Lucas Silva', date: '14/08/2026', total: 1199.90, status: 'approved', payment: 'PIX' },
    { id: 'ORD-172352000-112', customer: 'Fernanda Oliveira', date: '02/08/2026', total: 799.90, status: 'shipped', payment: 'Cartão de Crédito' },
    { id: 'ORD-172341000-901', customer: 'Marcelo Santos', date: '01/08/2026', total: 1999.90, status: 'delivered', payment: 'PIX' },
  ];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="border-b border-wolf-800 pb-6">
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            GESTÃO DE VENDAS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            PEDIDOS DOS CLIENTES
          </h1>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">ID DO PEDIDO</th>
                <th className="p-4">CLIENTE</th>
                <th className="p-4">DATA</th>
                <th className="p-4">FORMA PAGTO</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white">#{o.id}</td>
                  <td className="p-4 text-wolf-300">{o.customer}</td>
                  <td className="p-4 text-wolf-400">{o.date}</td>
                  <td className="p-4 text-wolf-400">{o.payment}</td>
                  <td className="p-4 font-bold text-emerald-400">{formatCurrency(o.total)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold rounded-xs">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
