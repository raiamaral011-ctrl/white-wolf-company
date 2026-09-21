'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertTriangle,
  Package, Image as ImageIcon, Layers, Upload, X, Film, Link,
  RefreshCw
} from 'lucide-react';

interface VariantInput {
  size: string;
  stock: number;
  color: string;
  color_name: string;
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  source: 'upload' | 'url';
  preview: string;      // local preview URL
  url: string;          // final URL (after upload or the typed URL)
  filename?: string;
  contentType?: string;
  base64?: string;
  uploading?: boolean;
  uploadError?: string;
}

interface BrandOption { id: string; name: string; slug: string; }
interface CategoryOption { id: string; name: string; slug: string; }

const DEFAULT_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

export default function AdminNovoProdutoPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    category_id: '',
    description: '',
    sku: '',
    price: '',
    compare_at_price: '',
    gender: 'unisex',
    sport: 'running',
    featured: false,
    is_new: true,
    is_sale: false,
    is_maratona: false,
  });

  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');

  const [variants, setVariants] = useState<VariantInput[]>([
    { size: '39', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '40', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '41', stock: 10, color: '#0f172a', color_name: 'Padrão' },
    { size: '42', stock: 10, color: '#0f172a', color_name: 'Padrão' },
  ]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'midia' | 'variantes'>('info');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load brands + categories from Supabase via API
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch('/api/admin/meta');
        if (res.ok) {
          const data = await res.json();
          setBrands(data.brands || []);
          setCategories(data.categories || []);
          if (data.brands?.length > 0) {
            setFormData(f => ({ ...f, brand_id: data.brands[0].id }));
          }
          if (data.categories?.length > 0) {
            setFormData(f => ({ ...f, category_id: data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error('Error loading meta:', err);
      } finally {
        setLoadingMeta(false);
      }
    }
    loadMeta();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 6000);
  };

  // Handle file selection (image or video)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const id = 'media-' + Date.now() + '-' + Math.random().toString(36).slice(2);
        setMediaFiles(prev => [...prev, {
          id,
          type: isVideo ? 'video' : 'image',
          source: 'upload',
          preview: base64,
          url: '',
          filename: file.name,
          contentType: file.type,
          base64,
          uploading: false,
          uploadError: undefined,
        }]);
      };
      reader.readAsDataURL(file);
    });
    // Reset so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload a single media file to Supabase Storage
  const uploadMediaFile = async (media: MediaFile): Promise<string> => {
    if (media.source === 'url') return media.url;

    setMediaFiles(prev =>
      prev.map(m => m.id === media.id ? { ...m, uploading: true, uploadError: undefined } : m)
    );

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: media.base64,
          filename: media.filename,
          contentType: media.contentType,
          folder: 'products',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMediaFiles(prev =>
          prev.map(m => m.id === media.id ? { ...m, url: data.url, uploading: false } : m)
        );
        return data.url;
      } else {
        throw new Error(data.message || 'Erro no upload');
      }
    } catch (err: any) {
      setMediaFiles(prev =>
        prev.map(m => m.id === media.id ? { ...m, uploading: false, uploadError: err.message } : m)
      );
      throw err;
    }
  };

  const addUrlMedia = () => {
    const url = urlInput.trim();
    if (!url) return;
    const id = 'media-url-' + Date.now();
    setMediaFiles(prev => [...prev, {
      id,
      type: urlType,
      source: 'url',
      preview: url,
      url,
    }]);
    setUrlInput('');
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', stock: 5, color: '#0f172a', color_name: 'Padrão' }]);
  };

  const removeVariant = (i: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i: number, field: keyof VariantInput, value: string | number) => {
    setVariants(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const addCommonSizes = () => {
    const existing = new Set(variants.map(v => v.size));
    const newOnes = DEFAULT_SIZES
      .filter(s => !existing.has(s))
      .map(s => ({ size: s, stock: 10, color: '#0f172a', color_name: 'Padrão' }));
    setVariants([...variants, ...newOnes]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Informe o nome do produto.', 'error');
      setActiveTab('info');
      return;
    }
    if (!formData.sku.trim()) {
      showToast('Informe o SKU do produto.', 'error');
      setActiveTab('info');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Informe um preço válido.', 'error');
      setActiveTab('info');
      return;
    }
    if (variants.some(v => !v.size.trim())) {
      showToast('Todas as variantes precisam ter tamanho definido.', 'error');
      setActiveTab('variantes');
      return;
    }

    setSaving(true);

    try {
      // 1. Upload pending files
      const uploadedMedia: { url: string; type: 'image' | 'video' }[] = [];

      for (const media of mediaFiles) {
        try {
          const url = await uploadMediaFile(media);
          if (url) uploadedMedia.push({ url, type: media.type });
        } catch {
          showToast('Erro ao enviar arquivo: ' + (media.filename || media.url), 'error');
          setSaving(false);
          return;
        }
      }

      // 2. Submit product
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          media: uploadedMedia,
          variants,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('✓ Produto publicado na loja com sucesso!', 'success');
        setTimeout(() => router.push('/admin/produtos'), 2000);
      } else {
        showToast(data.message || 'Erro desconhecido ao cadastrar.', 'error');
      }
    } catch (err: any) {
      showToast('Erro de rede: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'INFORMAÇÕES', icon: Package },
    { id: 'midia', label: `MÍDIA (${mediaFiles.length})`, icon: ImageIcon },
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
              Preencha as informações, adicione imagens/vídeos e defina o estoque por tamanho.
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

          {/* ======================== TAB: INFORMAÇÕES ======================== */}
          {activeTab === 'info' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">DADOS DO PRODUTO</h2>

              {loadingMeta && (
                <div className="flex items-center gap-2 text-xs font-mono text-wolf-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Carregando marcas e categorias do banco...
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-wolf-300 block mb-1">NOME DO PRODUTO *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Tênis Nike Air Max 270 React"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">MARCA *</label>
                  <select
                    value={formData.brand_id}
                    onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
                    disabled={loadingMeta}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs disabled:opacity-50"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">CATEGORIA *</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    disabled={loadingMeta}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs disabled:opacity-50"
                  >
                    {categories.map(c => (
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
                    onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="EX: NK-AM270-BLK"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono uppercase rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">GÊNERO</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
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
                    min="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1199.90"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">PREÇO ORIGINAL — para mostrar desconto (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compare_at_price}
                    onChange={e => setFormData({ ...formData, compare_at_price: e.target.value })}
                    placeholder="1499.90"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono rounded-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-wolf-300 block mb-1">DESCRIÇÃO DETALHADA *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o produto: tecnologias, materiais, diferenciais..."
                    className="w-full bg-wolf-950 border border-wolf-800 p-3 text-xs text-white focus:outline-none focus:border-accent font-sans rounded-xs"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
                  {[
                    { key: 'featured', label: 'DESTACAR NA HOME' },
                    { key: 'is_new', label: 'MARCAR COMO NOVIDADE' },
                    { key: 'is_sale', label: 'MARCAR EM PROMOÇÃO' },
                    { key: 'is_maratona', label: '🏃 MARATONA (TÊNIS DE ALTA PERFORMANCE / CORRIDA)' },
                  ].map(({ key, label }) => (
                    <label key={key} className={`flex items-center gap-2 text-xs font-mono cursor-pointer ${key === 'is_maratona' ? 'text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-xs' : 'text-wolf-300'}`}>
                      <input
                        type="checkbox"
                        checked={formData[key as keyof typeof formData] as boolean}
                        onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('midia')}
                  className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                >
                  PRÓXIMO: MÍDIA →
                </button>
              </div>
            </div>
          )}

          {/* ======================== TAB: MÍDIA ======================== */}
          {activeTab === 'midia' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">
                  IMAGENS E VÍDEOS DO PRODUTO
                </h2>
                <p className="text-[11px] font-mono text-wolf-500 mt-1">
                  Adicione imagens (JPG, PNG, WEBP) e vídeos (MP4, WEBM). A primeira imagem será a capa do produto.
                </p>
              </div>

              {/* Upload Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex-1 border-2 border-dashed border-wolf-700 hover:border-accent rounded-sm p-6 cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors group"
                >
                  <Upload className="w-8 h-8 text-wolf-500 group-hover:text-accent transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-bold font-mono text-wolf-300 group-hover:text-white uppercase">
                      CLIQUE PARA ENVIAR ARQUIVO
                    </p>
                    <p className="text-[11px] text-wolf-500 mt-1">
                      Imagens: JPG, PNG, WEBP • Vídeos: MP4, WEBM • Máx. 50MB cada
                    </p>
                  </div>
                </label>
              </div>

              {/* Add by URL */}
              <div className="p-4 bg-wolf-950 border border-wolf-800 rounded-sm space-y-3">
                <span className="text-xs font-mono text-wolf-400 uppercase flex items-center gap-2">
                  <Link className="w-3.5 h-3.5" /> OU ADICIONAR POR URL
                </span>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex rounded-xs overflow-hidden border border-wolf-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => setUrlType('image')}
                      className={`px-3 py-2 text-[10px] font-mono font-bold uppercase ${urlType === 'image' ? 'bg-accent text-white' : 'bg-wolf-900 text-wolf-400'}`}
                    >
                      IMAGEM
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlType('video')}
                      className={`px-3 py-2 text-[10px] font-mono font-bold uppercase ${urlType === 'video' ? 'bg-accent text-white' : 'bg-wolf-900 text-wolf-400'}`}
                    >
                      VÍDEO
                    </button>
                  </div>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrlMedia())}
                    placeholder="https://..."
                    className="flex-1 bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent rounded-xs min-w-48"
                  />
                  <button
                    type="button"
                    onClick={addUrlMedia}
                    disabled={!urlInput.trim()}
                    className="px-4 py-2 bg-accent hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold uppercase font-mono rounded-xs"
                  >
                    ADICIONAR
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {mediaFiles.map((media, index) => (
                    <div
                      key={media.id}
                      className={`relative rounded-sm border overflow-hidden group ${
                        media.uploadError ? 'border-rose-600' : 'border-wolf-700'
                      }`}
                    >
                      {/* First item badge */}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs">
                          CAPA
                        </span>
                      )}

                      {/* Type badge */}
                      <span className="absolute top-2 right-8 z-10 bg-black/70 text-white text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                        {media.type === 'video' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                        {media.type}
                      </span>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center rounded-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Preview */}
                      <div className="aspect-square bg-wolf-800 flex items-center justify-center">
                        {media.type === 'video' ? (
                          <video
                            src={media.preview}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={media.preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200';
                            }}
                          />
                        )}
                      </div>

                      {/* Status bar */}
                      <div className={`px-2 py-1.5 text-[10px] font-mono ${
                        media.uploadError
                          ? 'bg-rose-950 text-rose-400'
                          : media.url
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-wolf-900 text-wolf-400'
                      }`}>
                        {media.uploading ? '⟳ Enviando...' :
                         media.uploadError ? '✗ ' + media.uploadError :
                         media.url ? '✓ Pronto' :
                         media.source === 'url' ? '✓ URL definida' :
                         '○ Aguardando envio'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-wolf-800 rounded-sm text-wolf-600">
                  <ImageIcon className="w-10 h-10 mb-3" />
                  <p className="text-xs font-mono">Nenhuma mídia adicionada ainda.</p>
                  <p className="text-[11px] font-mono mt-1">Será usada uma imagem padrão de tênis.</p>
                </div>
              )}

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

          {/* ======================== TAB: VARIANTES ======================== */}
          {activeTab === 'variantes' && (
            <div className="bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-wolf-300">
                    TAMANHOS E ESTOQUE INICIAL
                  </h2>
                  <p className="text-[11px] font-mono text-wolf-500 mt-1">
                    Variantes com estoque 0 aparecem como <strong className="text-rose-400">ESGOTADAS</strong> na loja.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addCommonSizes}
                    className="px-3 py-1.5 bg-wolf-800 hover:bg-wolf-700 text-wolf-200 font-mono text-[10px] font-bold uppercase rounded-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> 37-45
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

              <div className="space-y-3">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-3 text-[10px] font-mono text-wolf-500 uppercase px-1">
                  <div className="col-span-2">TAMANHO</div>
                  <div className="col-span-3">ESTOQUE</div>
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
                        onChange={e => updateVariant(i, 'size', e.target.value)}
                        placeholder="40"
                        className={`w-full bg-wolf-950 border focus:outline-none px-3 py-2 text-xs font-mono text-white text-center rounded-xs ${
                          !v.size.trim() ? 'border-rose-700' : 'border-wolf-800 focus:border-accent'
                        }`}
                      />
                    </div>

                    <div className="col-span-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateVariant(i, 'stock', Math.max(0, v.stock - 1))}
                        className="w-7 h-8 bg-wolf-800 hover:bg-rose-700 text-white flex items-center justify-center rounded-xs shrink-0 font-bold"
                      >−</button>
                      <input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={e => updateVariant(i, 'stock', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`flex-1 bg-wolf-950 border focus:outline-none px-2 py-2 text-xs font-mono text-center text-white rounded-xs font-bold ${
                          v.stock === 0 ? 'border-rose-700 text-rose-400' : 'border-wolf-800 focus:border-accent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => updateVariant(i, 'stock', v.stock + 1)}
                        className="w-7 h-8 bg-wolf-800 hover:bg-emerald-700 text-white flex items-center justify-center rounded-xs shrink-0 font-bold"
                      >+</button>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="text"
                        value={v.color_name}
                        onChange={e => updateVariant(i, 'color_name', e.target.value)}
                        placeholder="Preto"
                        className="w-full bg-wolf-950 border border-wolf-800 focus:border-accent px-3 py-2 text-xs font-mono text-white rounded-xs focus:outline-none"
                      />
                    </div>

                    <div className="col-span-3 flex items-center gap-2">
                      <input
                        type="color"
                        value={v.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        className="w-9 h-8 bg-wolf-950 border border-wolf-800 rounded-xs cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        className="flex-1 bg-wolf-950 border border-wolf-800 focus:border-accent px-2 py-2 text-xs font-mono text-white rounded-xs focus:outline-none"
                      />
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        disabled={variants.length <= 1}
                        className="w-8 h-8 bg-rose-950/60 hover:bg-rose-700 border border-rose-900 text-rose-400 hover:text-white flex items-center justify-center rounded-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-wolf-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('midia')}
                  className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                >
                  ← VOLTAR
                </button>

                <button
                  type="submit"
                  disabled={saving || loadingMeta}
                  className="w-full sm:w-auto px-10 py-3.5 bg-accent hover:bg-rose-700 disabled:opacity-60 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-xl shadow-rose-950/40"
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
