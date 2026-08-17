'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BRANDS, CATEGORIES } from '@/lib/data/products';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertTriangle, Package, Image as ImageIcon, Layers } from 'lucide-react';

interface VariantInput {
  size: string;
  stock: number;
  color: string;
  color_name: string;
}

const DEFAULT_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function AdminNovoProdutoPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    brand_id: BRANDS[0]?.id || '',
    category_id: CATEGORIES[0]?.id || '',
    description: '',
    sku: '',
    price: '',
    compare_at_price: '',
    gender: 'unisex',
    sport: 'running',
    featured: false,
    is_new: true,
    is_sale: false,
    image_url: '',
  });

  const [variants, setVariants] = useState<VariantInput[]>([
    { size: '39', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '40', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '41', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '42', stock: 10, color: '#0f172a', color_name: 'Padrão' },
  ]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'imagem' | 'variantes'>('info');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', stock: 5, color: '#0f172a', color_name: 'Padrão' }]);
  };

  const removeVariant = (i: number) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i: number, field: keyof VariantInput, value: string | number) => {
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const addCommonSizes = () => {
    const existing = variants.map((v) => v.size);
    const newOnes = DEFAULT_SIZES.filter((s) => !existing.includes(s)).map((s) => ({
      size: s,
      stock: 10,
      color: '#0f172a',
      color_name: 'Padrão',
    }));
    setVariants([...variants, ...newOnes]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.price) {
      showToast('Preencha todos os campos obrigatórios: Nome, SKU e Preço.', 'error');
      return;
    }

    if (variants.some((v) => !v.size.trim())) {
      showToast('Todas as variantes precisam ter um tamanho definido.', 'error');
      setActiveTab('variantes');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, variants }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('✓ Produto cadastrado e publicado com sucesso na loja!', 'success');
        setTimeout(() => router.push('/admin/produtos'), 2000);
      } else {
        showToast(data.message || 'Erro ao cadastrar produto.', 'error');
      }
    } catch (err: any) {
      showToast('Erro de conexão: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'INFORMAÇÕES', icon: Package },
    { id: 'imagem', label: 'IMAGEM', icon: ImageIcon },
    { id: 'variantes', label: `VARIANTES (${variants.length})`, icon: Layers },
  ] as const;

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 border text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 max-w-sm ${
          toast.type === 'error' ? 'bg-rose-950 border-rose-600' : 'bg-wolf-900 border-emerald-600'
        }`}>
          {toast.type === 'error'
            ? <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-wolf-800 pb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="text-xs font-mono text-wolf-400 hover:text-white flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> VOLTAR PARA LISTA
            </button>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              GERENCIAMENTO DE CATÁLOGO
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              CADASTRAR NOVO PRODUTO
            </h1>
            <p className="text-xs font-mono text-wolf-400 mt-1">
              O produto será publicado imediatamente na loja após o cadastro.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-0 border border-wolf-800 rounded-sm overflow-hidden bg-wolf-900/50">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase transition-colors ${
                  activeTab === id
                    ? 'bg-accent text-white'
                    : 'text-wolf-400 hover:text-white hover:bg-wolf-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* TAB: INFORMAÇÕES GERAIS */}
          {activeTab === 'info' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">
                DADOS DO PRODUTO
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-wolf-300 block mb-1">NOME DO PRODUTO *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Tênis Nike Air Max 270"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">MARCA *</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs"
                  >
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">CATEGORIA *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">SKU ÚNICO *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="EX: NK-AM270-BLK"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono uppercase rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">GÊNERO</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs"
                  >
                    <option value="unisex">Unissex</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="infantil">Infantil</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">PREÇO (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1199.90"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">PREÇO ORIGINAL (R$) — para desconto</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    placeholder="1499.90 (opcional)"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono rounded-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-wolf-300 block mb-1">DESCRIÇÃO DETALHADA *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o produto, tecnologias de amortecimento, composição do material..."
                    className="w-full bg-wolf-950 border border-wolf-800 p-3 text-xs text-white focus:outline-none focus:border-accent font-sans rounded-xs"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-wolf-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    DESTACAR NA HOME
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono text-wolf-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    MARCAR COMO NOVIDADE
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono text-wolf-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_sale}
                      onChange={(e) => setFormData({ ...formData, is_sale: e.target.checked })}
                      className="accent-rose-600 w-4 h-4"
                    />
                    MARCAR EM PROMOÇÃO
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('imagem')}
                  className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                >
                  PRÓXIMO: IMAGEM →
                </button>
              </div>
            </div>
          )}

          {/* TAB: IMAGEM */}
          {activeTab === 'imagem' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">
                IMAGEM PRINCIPAL DO PRODUTO
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">
                    URL DA IMAGEM
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-... (deixe vazio para usar imagem padrão)"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono rounded-xs"
                  />
                  <p className="text-[11px] text-wolf-500 mt-1.5 font-mono">
                    Recomendado: imagens do Unsplash, CDN ou hospedagem pública. Tamanho ideal: 800×800px.
                  </p>
                </div>

                {/* Preview */}
                {formData.image_url && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-wolf-400 uppercase">PRÉ-VISUALIZAÇÃO:</span>
                    <div className="relative w-48 h-48 bg-wolf-800 border border-wolf-700 rounded-xs overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                        }}
                      />
                    </div>
                  </div>
                )}

                {!formData.image_url && (
                  <div className="p-6 border border-dashed border-wolf-700 rounded-sm text-center space-y-2">
                    <ImageIcon className="w-10 h-10 text-wolf-600 mx-auto" />
                    <p className="text-xs font-mono text-wolf-500">
                      Sem imagem definida. Será usada uma imagem padrão de tênis.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setActiveTab('info')} className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs">
                  ← VOLTAR
                </button>
                <button type="button" onClick={() => setActiveTab('variantes')} className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs">
                  PRÓXIMO: VARIANTES →
                </button>
              </div>
            </div>
          )}

          {/* TAB: VARIANTES */}
          {activeTab === 'variantes' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">
                  TAMANHOS E ESTOQUE INICIAL
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addCommonSizes}
                    className="px-3 py-1.5 bg-wolf-800 hover:bg-wolf-700 text-wolf-200 font-mono text-[10px] font-bold uppercase rounded-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> TAMANHOS 37-45
                  </button>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1.5 bg-accent hover:bg-rose-700 text-white font-mono text-[10px] font-bold uppercase rounded-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADICIONAR
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-wolf-500">
                Defina os tamanhos disponíveis e a quantidade em estoque. Variantes com estoque 0 aparecem como <strong className="text-rose-400">ESGOTADAS</strong> na loja.
              </p>

              <div className="space-y-3">
                {/* Headers */}
                <div className="grid grid-cols-12 gap-3 text-[10px] font-mono text-wolf-500 uppercase px-1">
                  <div className="col-span-2">TAMANHO</div>
                  <div className="col-span-3">ESTOQUE INICIAL</div>
                  <div className="col-span-3">NOME DA COR</div>
                  <div className="col-span-3">COR (HEX)</div>
                  <div className="col-span-1"></div>
                </div>

                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                        placeholder="40"
                        className="w-full bg-wolf-950 border border-wolf-800 focus:border-accent px-3 py-2 text-xs font-mono text-white text-center rounded-xs focus:outline-none"
                      />
                    </div>

                    <div className="col-span-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateVariant(i, 'stock', Math.max(0, v.stock - 1))}
                        className="w-7 h-8 bg-wolf-800 hover:bg-wolf-700 text-white flex items-center justify-center rounded-xs shrink-0"
                      >−</button>
                      <input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={(e) => updateVariant(i, 'stock', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`flex-1 bg-wolf-950 border focus:outline-none px-2 py-2 text-xs font-mono text-center text-white rounded-xs ${
                          v.stock === 0 ? 'border-rose-800 text-rose-400' : 'border-wolf-800 focus:border-accent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => updateVariant(i, 'stock', v.stock + 1)}
                        className="w-7 h-8 bg-wolf-800 hover:bg-wolf-700 text-white flex items-center justify-center rounded-xs shrink-0"
                      >+</button>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="text"
                        value={v.color_name}
                        onChange={(e) => updateVariant(i, 'color_name', e.target.value)}
                        placeholder="Preto"
                        className="w-full bg-wolf-950 border border-wolf-800 focus:border-accent px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none"
                      />
                    </div>

                    <div className="col-span-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={v.color}
                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                        className="w-9 h-8 bg-wolf-950 border border-wolf-800 rounded-xs cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                        className="flex-1 bg-wolf-950 border border-wolf-800 focus:border-accent px-2 py-2 text-xs font-mono text-white rounded-xs focus:outline-none"
                      />
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        disabled={variants.length <= 1}
                        className="w-8 h-8 bg-rose-950/60 hover:bg-rose-700 border border-rose-900 text-rose-400 hover:text-white flex items-center justify-center rounded-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remover variante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-wolf-800 flex items-center justify-between gap-4">
                <button type="button" onClick={() => setActiveTab('imagem')} className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs">
                  ← VOLTAR
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-none px-10 py-3.5 bg-accent hover:bg-rose-700 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-xl shadow-rose-950/40"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'PUBLICANDO NA LOJA...' : 'SALVAR E PUBLICAR PRODUTO'}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
