'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Plus, Edit3, Trash2, ArrowUp, ArrowDown, Eye, Save, X, Image as ImageIcon,
  CheckCircle2, AlertTriangle, RefreshCw, Layout, Layers, Tag, Package, Sparkles,
  Sliders, Link as LinkIcon, ExternalLink, SwitchCamera, FileText
} from 'lucide-react';
import Image from 'next/image';

export interface HomeSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  content?: any;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const SECTION_TYPES = [
  { id: 'hero', name: 'Banner Hero Principal', desc: 'Destaque grande no topo da página' },
  { id: 'banner_split', name: 'Banners Duplos (Lado a Lado)', desc: 'Dois destaques em par' },
  { id: 'categories', name: 'Grade de Categorias', desc: 'Exibe as categorias cadastradas no banco' },
  { id: 'brands', name: 'Grid de Marcas Parceiras', desc: 'Exibe as marcas cadastradas no banco' },
  { id: 'products', name: 'Vitrine de Produtos', desc: 'Exibe produtos do banco por categoria, marca ou promoção' },
  { id: 'text_image', name: 'Destaque Texto + Imagem', desc: 'Bloco institucional ou história de coleção' },
  { id: 'cta', name: 'Faixa de Chamada para Ação (CTA)', desc: 'Faixa com oferta e botão de ação' },
  { id: 'newsletter', name: 'Caixa de Newsletter', desc: 'Formulário de inscrição de e-mail' },
  { id: 'spacer', name: 'Bloco de Espaçamento', desc: 'Espaço em branco entre seções' },
];

export default function AdminGerenciarHomePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    type: string;
    title: string;
    subtitle: string;
    description: string;
    image_url: string;
    button_text: string;
    button_url: string;
    is_active: boolean;
    content: any;
  }>({
    type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_url: '',
    is_active: true,
    content: { productSource: 'all', limit: 8 },
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/home-sections');
      if (res.ok) {
        const data = await res.json();
        setSections(data);
      }
    } catch (err) {
      console.error('Error fetching home sections:', err);
      showToast('Erro ao carregar seções da Home.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/admin/home-upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
        showToast('Imagem enviada com sucesso para o Supabase Storage!');
      } else {
        showToast(data.message || 'Erro ao enviar imagem.', 'error');
      }
    } catch (err) {
      showToast('Erro ao fazer upload da imagem.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/home-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Nova seção criada e adicionada à Home com sucesso!');
        setIsCreateOpen(false);
        resetForm();
        fetchSections();
      } else {
        showToast(data.message || 'Erro ao criar seção.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao criar seção.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSection.id, ...formData }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Seção da Home atualizada com sucesso!');
        setEditingSection(null);
        resetForm();
        fetchSections();
      } else {
        showToast(data.message || 'Erro ao atualizar seção.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao atualizar seção.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/home-sections?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSections((prev) => prev.filter((s) => s.id !== id));
        showToast('Seção removida com sucesso da Home!');
      } else {
        showToast(data.message || 'Erro ao remover seção.', 'error');
      }
    } catch (err) {
      showToast('Erro ao remover seção.', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleToggleActive = async (section: HomeSection) => {
    const newStatus = !section.is_active;
    setSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, is_active: newStatus } : s))
    );

    try {
      const res = await fetch('/api/admin/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, is_active: newStatus }),
      });

      if (!res.ok) {
        // Revert
        setSections((prev) =>
          prev.map((s) => (s.id === section.id ? { ...s, is_active: !newStatus } : s))
        );
        showToast('Erro ao alterar status da seção.', 'error');
      } else {
        showToast(newStatus ? 'Seção ativada na Home!' : 'Seção desativada na Home.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update display orders
    const reordered = newSections.map((sec, idx) => ({
      ...sec,
      display_order: idx + 1,
    }));

    setSections(reordered);

    try {
      await fetch('/api/admin/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reorder: reordered.map((s) => ({ id: s.id, display_order: s.display_order })),
        }),
      });
      showToast('Ordem das seções atualizada!');
    } catch (err) {
      console.error('Error reordering sections:', err);
    }
  };

  const openEditModal = (sec: HomeSection) => {
    setEditingSection(sec);
    setFormData({
      type: sec.type,
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      description: sec.description || '',
      image_url: sec.image_url || '',
      button_text: sec.button_text || '',
      button_url: sec.button_url || '',
      is_active: sec.is_active,
      content: sec.content || { productSource: 'all', limit: 8 },
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'hero',
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      button_text: '',
      button_url: '',
      is_active: true,
      content: { productSource: 'all', limit: 8 },
    });
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 border text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950 border-rose-600'
              : 'bg-wolf-900 border-emerald-600'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* HEADER & TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              GERENCIADOR DINÂMICO
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              EDITOR DA PÁGINA INICIAL
            </h1>
            <p className="text-xs text-wolf-400 font-mono mt-1">
              Crie, edite, reordene e ative seções na Home sem precisar alterar código.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-wolf-900 border border-wolf-800 p-1 rounded-xs flex gap-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-xs transition-colors flex items-center gap-2 ${
                  activeTab === 'editor'
                    ? 'bg-accent text-white'
                    : 'text-wolf-400 hover:text-white'
                }`}
              >
                <Layout className="w-4 h-4" /> SEÇÕES ({sections.length})
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-xs transition-colors flex items-center gap-2 ${
                  activeTab === 'preview'
                    ? 'bg-accent text-white'
                    : 'text-wolf-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" /> VISUALIZAR PREVIEW
              </button>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 rounded-xs transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" /> ADICIONAR SEÇÃO
            </button>
          </div>
        </div>

        {/* EDITOR TAB */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            {loading ? (
              <div className="p-12 bg-wolf-900 border border-wolf-800 rounded-sm text-center text-wolf-400 font-mono text-xs">
                <RefreshCw className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
                Carregando seções da Home do Supabase...
              </div>
            ) : sections.length === 0 ? (
              <div className="p-16 bg-wolf-900/60 border border-wolf-800 rounded-sm text-center space-y-4 font-mono">
                <Layout className="w-12 h-12 text-wolf-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white uppercase">
                    Nenhum conteúdo configurado na Home ainda
                  </h3>
                  <p className="text-xs text-wolf-400 max-w-md mx-auto">
                    A página inicial começará limpa. Clique abaixo para criar a primeira seção (Banner Hero, Vitrine de Produtos, Categorias etc.).
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setIsCreateOpen(true);
                  }}
                  className="px-5 py-3 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> CRIAR PRIMEIRA SEÇÃO DA HOME
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((sec, index) => {
                  const typeObj = SECTION_TYPES.find((t) => t.id === sec.type);
                  return (
                    <div
                      key={sec.id}
                      className={`bg-wolf-900 border rounded-sm p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        sec.is_active ? 'border-wolf-800' : 'border-rose-900/50 opacity-60 bg-wolf-950'
                      }`}
                    >
                      {/* Left Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 bg-wolf-950 hover:bg-wolf-800 disabled:opacity-30 text-wolf-300 rounded-xs"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono font-bold text-center text-wolf-500">
                            #{index + 1}
                          </span>
                          <button
                            disabled={index === sections.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 bg-wolf-950 hover:bg-wolf-800 disabled:opacity-30 text-wolf-300 rounded-xs"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail / Type Icon */}
                        <div className="w-16 h-16 bg-wolf-950 border border-wolf-800 rounded-xs overflow-hidden shrink-0 relative flex items-center justify-center">
                          {sec.image_url ? (
                            <Image
                              src={sec.image_url}
                              alt={sec.title || 'Banner'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Sparkles className="w-6 h-6 text-accent" />
                          )}
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-accent/20 border border-accent/40 text-accent font-mono font-bold text-[10px] uppercase rounded-xs">
                              {typeObj?.name || sec.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 font-mono font-bold text-[10px] uppercase rounded-xs ${
                                sec.is_active
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {sec.is_active ? 'ATIVO NA HOME' : 'INATIVO'}
                            </span>
                          </div>

                          <h3 className="text-base font-bold font-heading uppercase text-white">
                            {sec.title || '(Sem Título)'}
                          </h3>

                          {sec.subtitle && (
                            <p className="text-xs text-wolf-400 font-mono line-clamp-1">
                              {sec.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-wolf-800 pt-3 md:pt-0">
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleActive(sec)}
                          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-xs border transition-colors ${
                            sec.is_active
                              ? 'bg-wolf-950 border-emerald-700 text-emerald-400 hover:bg-emerald-950'
                              : 'bg-wolf-950 border-wolf-700 text-wolf-400 hover:text-white'
                          }`}
                        >
                          {sec.is_active ? 'DESATIVAR' : 'ATIVAR'}
                        </button>

                        <button
                          onClick={() => openEditModal(sec)}
                          className="p-2 bg-wolf-950 hover:bg-wolf-800 border border-wolf-700 text-white rounded-xs transition-colors"
                          title="Editar Seção"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(sec.id)}
                          className="p-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xs transition-colors"
                          title="Excluir Seção"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="bg-wolf-900 border border-wolf-800 rounded-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-wolf-800 pb-4">
              <span className="text-xs font-mono text-wolf-400 uppercase">
                PREVIEW EM TEMPO REAL DAS SEÇÕES ATIVAS
              </span>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
              >
                ABRIR SITE EM NOVA ABA <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-wolf-950 border border-wolf-800 rounded-sm overflow-hidden p-6 space-y-8 min-h-[500px]">
              {sections.filter((s) => s.is_active).length === 0 ? (
                <div className="text-center py-20 text-wolf-500 font-mono text-xs space-y-2">
                  <Eye className="w-8 h-8 mx-auto text-wolf-600" />
                  <p>Nenhuma seção ativa para pré-visualização.</p>
                </div>
              ) : (
                sections
                  .filter((s) => s.is_active)
                  .map((sec) => (
                    <div
                      key={sec.id}
                      className="p-6 bg-wolf-900/60 border border-wolf-800 rounded-sm space-y-4 relative group"
                    >
                      <span className="absolute top-3 right-3 text-[10px] font-mono text-wolf-500 uppercase bg-wolf-950 px-2 py-0.5 border border-wolf-800">
                        {sec.type}
                      </span>

                      {sec.image_url && (
                        <div className="aspect-[21/9] relative rounded-sm overflow-hidden bg-black">
                          <Image src={sec.image_url} alt={sec.title || 'Banner'} fill className="object-cover" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-xs font-mono text-accent uppercase font-bold">
                          {sec.subtitle || 'DESTAQUE WHITE WOLF'}
                        </span>
                        <h2 className="text-2xl font-black font-heading uppercase text-white">
                          {sec.title}
                        </h2>
                        <p className="text-xs text-wolf-300 font-sans max-w-2xl">
                          {sec.description}
                        </p>
                      </div>

                      {sec.button_text && (
                        <span className="inline-block px-5 py-2.5 bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider">
                          {sec.button_text} →
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* MODAL CREATE / EDIT */}
        {(isCreateOpen || editingSection) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-wolf-950 border border-wolf-800 max-w-2xl w-full p-6 sm:p-8 space-y-6 rounded-sm my-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-wolf-800 pb-4">
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-heading">
                  {editingSection ? 'EDITAR SEÇÃO DA HOME' : 'NOVA SEÇÃO PARA A HOME'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingSection(null);
                  }}
                  className="text-wolf-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={editingSection ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                {/* Tipo de Seção */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                    TIPO DE COMPONENTE / SEÇÃO:
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                  >
                    {SECTION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — ({t.desc})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Título */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                    TÍTULO PRINCIPAL:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: NOVA COLEÇÃO DE ELITE, ASICS GEL-NIMBUS, etc."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Subtítulo */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                    SUBTÍTULO / CHAPEÚ (OPCIONAL):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: LANÇAMENTO OFICIAL • ALTA PERFORMANCE"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                    DESCRIÇÃO:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Texto explicativo ou chamada para a coleção..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-sans focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Upload de Imagem */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-wolf-300 font-bold uppercase block">
                    IMAGEM DA SEÇÃO (SUPABASE STORAGE):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="URL da Imagem ou faça Upload abaixo"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="flex-1 bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-4 py-2.5 bg-wolf-800 hover:bg-wolf-700 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 rounded-xs shrink-0"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {uploadingImage ? 'ENVIANDO...' : 'UPLOAD FOTO'}
                    </button>
                  </div>
                  {formData.image_url && (
                    <div className="relative aspect-[21/9] bg-black border border-wolf-800 rounded-xs overflow-hidden mt-2">
                      <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Botões e Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                      TEXTO DO BOTÃO:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: VER PRODUTOS, CONFIRA AGORA"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-wolf-300 font-bold uppercase">
                      LINK DE DESTINO (URL):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: /produtos?marca=nike ou /tenis"
                      value={formData.button_url}
                      onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                      className="w-full bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-2.5 font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Opções de Vitrine para Seção 'products' */}
                {formData.type === 'products' && (
                  <div className="p-4 bg-wolf-900/60 border border-wolf-800 space-y-2 rounded-xs">
                    <label className="text-xs font-mono text-accent font-bold uppercase block">
                      FILTRO DA VITRINE DE PRODUTOS:
                    </label>
                    <select
                      value={formData.content?.productSource || 'all'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content: { ...formData.content, productSource: e.target.value },
                        })
                      }
                      className="w-full bg-wolf-950 border border-wolf-800 text-white text-xs px-3 py-2 font-mono"
                    >
                      <option value="all">Todos os Tênis do Banco</option>
                      <option value="nike">Apenas Tênis Nike</option>
                      <option value="adidas">Apenas Tênis Adidas</option>
                      <option value="tenis">Apenas Categoria Tênis</option>
                      <option value="maratona">🏃 Apenas Tênis de Maratona (Alta Performance)</option>
                      <option value="sale">Apenas Tênis em Promoção (Ofertas)</option>
                    </select>
                  </div>
                )}

                {/* Active Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="accent-rose-600 bg-wolf-900 border-wolf-700"
                    />
                    <span>ATIVAR ESTA SEÇÃO IMEDIATAMENTE NA HOME DO SITE</span>
                  </label>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-3 pt-4 border-t border-wolf-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingSection(null);
                    }}
                    className="px-4 py-2.5 bg-wolf-900 text-wolf-400 hover:text-white font-mono text-xs font-bold uppercase"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'SALVANDO...' : 'SALVAR NO SUPABASE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CONFIRM DELETE */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-wolf-950 border border-rose-700 max-w-md w-full p-6 space-y-4 rounded-sm shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400 font-heading">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-black uppercase">CONFIRMAR EXCLUSÃO</h3>
              </div>
              <p className="text-xs text-wolf-300 font-mono leading-relaxed">
                Tem certeza que deseja remover esta seção da página inicial? A alteração é definitiva no banco de dados.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 bg-wolf-900 text-wolf-400 hover:text-white font-mono text-xs font-bold uppercase"
                >
                  CANCELAR
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase"
                >
                  EXCLUIR SEÇÃO
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
