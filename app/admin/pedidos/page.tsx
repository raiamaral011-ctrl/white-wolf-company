'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, Eye, Edit2, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenStatusModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setNewPaymentStatus(order.payment_status || 'pending');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: newStatus,
          payment_status: newPaymentStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Status do pedido atualizado com sucesso!');
        setStatusModalOpen(false);
        loadOrders();
      } else {
        showToast(data.message || 'Erro ao atualizar status.', 'error');
      }
    } catch (err: any) {
      showToast('Erro: ' + err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'processing':
      case 'em processamento':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'shipped':
      case 'enviado':
        return 'bg-indigo-950 text-indigo-400 border-indigo-800';
      case 'delivered':
      case 'entregue':
        return 'bg-emerald-900 text-emerald-300 border-emerald-600';
      case 'cancelled':
      case 'cancelado':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-amber-950 text-amber-400 border-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 border text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 max-w-sm ${
          toast.type === 'error' ? 'bg-rose-950 border-rose-600' : 'bg-wolf-900 border-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              GESTÃO DE VENDAS
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
              PEDIDOS DOS CLIENTES ({loading ? '...' : orders.length})
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
            </h1>
          </div>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">ID DO PEDIDO</th>
                <th className="p-4">CLIENTE</th>
                <th className="p-4">DATA</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">PAGAMENTO</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {orders.map((o) => {
                const customerName = o.customer_info?.full_name || o.customer_info?.fullName || 'Cliente';
                const dateStr = new Date(o.created_at || Date.now()).toLocaleDateString('pt-BR');
                const badgeClass = getStatusBadge(o.status);

                return (
                  <tr key={o.id} className="hover:bg-wolf-950/50">
                    <td className="p-4 font-bold text-white">#{o.id}</td>
                    <td className="p-4 text-wolf-300">{customerName}</td>
                    <td className="p-4 text-wolf-400">{dateStr}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(o.total || 0)}</td>
                    <td className="p-4 text-wolf-400 uppercase">{o.payment_status || 'Pendente'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 border text-[10px] uppercase font-bold rounded-xs ${badgeClass}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenStatusModal(o)}
                        className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-white rounded-xs"
                        title="Alterar Status"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* EDIT ORDER STATUS MODAL */}
      {statusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-wolf-900 border border-wolf-800 max-w-lg w-full p-6 space-y-6 rounded-sm">
            <div className="flex justify-between items-center border-b border-wolf-800 pb-4">
              <h3 className="text-sm font-bold uppercase font-heading text-white tracking-wider">
                GERENCIAR PEDIDO #{selectedOrder.id}
              </h3>
              <button onClick={() => setStatusModalOpen(false)} className="text-wolf-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items & Customer Info */}
            <div className="space-y-3 text-xs font-mono bg-wolf-950 p-4 border border-wolf-800 rounded-xs">
              <p className="text-white font-bold">Cliente: <span className="text-wolf-300">{selectedOrder.customer_info?.full_name || selectedOrder.customer_info?.fullName}</span></p>
              <p className="text-white font-bold">Email: <span className="text-wolf-300">{selectedOrder.customer_info?.email}</span></p>
              <p className="text-white font-bold">Total: <span className="text-emerald-400">{formatCurrency(selectedOrder.total)}</span></p>
              
              <div className="pt-2 border-t border-wolf-800 space-y-1">
                <p className="text-wolf-400 font-bold uppercase">Itens:</p>
                {(selectedOrder.items || []).map((it: any, idx: number) => (
                  <p key={idx} className="text-wolf-300 text-[11px]">
                    • {it.product_name} ({it.size}) x{it.quantity} - {formatCurrency(it.subtotal || it.unit_price * it.quantity)}
                  </p>
                ))}
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-wolf-300 mb-1">STATUS DO PEDIDO</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-accent"
                >
                  <option value="pending">Pendente (pending)</option>
                  <option value="approved">Pagamento Aprovado (approved)</option>
                  <option value="processing">Em Processamento (processing)</option>
                  <option value="shipped">Enviado (shipped)</option>
                  <option value="delivered">Entregue (delivered)</option>
                  <option value="cancelled">Cancelado (cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-wolf-300 mb-1">STATUS DO PAGAMENTO</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-accent"
                >
                  <option value="pending">Pendente (pending)</option>
                  <option value="approved">Aprovado (approved)</option>
                  <option value="rejected">Rejeitado (rejected)</option>
                  <option value="refunded">Reembolsado (refunded)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-wolf-800">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-wolf-800 text-white font-bold uppercase rounded-xs"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-accent hover:bg-rose-700 disabled:opacity-50 text-white font-bold uppercase rounded-xs"
                >
                  {updating ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
