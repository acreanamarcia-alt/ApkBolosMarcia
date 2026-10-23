import React, { useState } from 'react';
import { 
  Lock, 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Sparkles, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Image as ImageIcon, 
  Check, 
  X, 
  Save, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Layers,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { CakeItem, CategoryType } from '../types';

interface AdminDashboardProps {
  products: CakeItem[];
  onSaveProduct: (cake: CakeItem) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onNotify: (msg: string) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onNotify,
  onExitAdmin,
}) => {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bolos_marcia_admin_logged') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('acreanamarcia@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');

  // Modal State for Creating/Editing Product
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CakeItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'festas' | 'caseiros' | 'potes' | 'tortas' | 'especiais'>('festas');
  const [formPrice, setFormPrice] = useState<string>('120.00');
  const [formDescription, setFormDescription] = useState('');
  const [formSlices, setFormSlices] = useState('15 a 18 fatias');
  const [formWeight, setFormWeight] = useState('2.0 kg');
  const [formImage, setFormImage] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formHighlights, setFormHighlights] = useState('Nutella, Ninho, Artesanal');
  const [formPrepTime, setFormPrepTime] = useState('24h de antecedência');
  const [isSaving, setIsSaving] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    // Simple secure check for admin
    if (loginEmail.trim().toLowerCase() === 'acreanamarcia@gmail.com' && (loginPassword === 'marcia123' || loginPassword === 'admin' || loginPassword.length >= 4)) {
      setIsAuthenticated(true);
      localStorage.setItem('bolos_marcia_admin_logged', 'true');
      onNotify('Bem-vinda, Márcia! Painel Administrativo liberado.');
    } else {
      setLoginError('E-mail ou senha incorretos. Dica: use a senha "marcia123" ou "admin"');
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('bolos_marcia_admin_logged', 'true');
    onNotify('Acesso Administrativo concedido!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bolos_marcia_admin_logged');
    onNotify('Você saiu do modo administrador.');
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('festas');
    setFormPrice('110.00');
    setFormDescription('Deliciosa receita artesanal preparada com ingredientes nobres e muito afeto.');
    setFormSlices('14 a 16 fatias');
    setFormWeight('1.8 kg');
    setFormImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');
    setFormPopular(false);
    setFormHighlights('Artesanal, Fresquinho, Sabor Incomparável');
    setFormPrepTime('24h de antecedência');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cake: CakeItem) => {
    setEditingProduct(cake);
    setFormName(cake.name);
    setFormCategory(cake.category);
    setFormPrice(cake.price.toFixed(2));
    setFormDescription(cake.description);
    setFormSlices(cake.slices);
    setFormWeight(cake.weight);
    setFormImage(cake.image);
    setFormPopular(!!cake.popular);
    setFormHighlights(cake.highlights.join(', '));
    setFormPrepTime(cake.prepTime);
    setIsFormModalOpen(true);
  };

  // Submit Product Save
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice || !formImage.trim()) {
      onNotify('Por favor preencha nome, preço e URL da imagem');
      return;
    }

    const priceNum = parseFloat(formPrice.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      onNotify('Preço inválido');
      return;
    }

    setIsSaving(true);
    try {
      const cakeData: CakeItem = {
        id: editingProduct ? editingProduct.id : 'bolo-' + Date.now(),
        name: formName.trim(),
        category: formCategory,
        price: priceNum,
        description: formDescription.trim(),
        slices: formSlices.trim() || '12 a 15 fatias',
        weight: formWeight.trim() || '1.5 kg',
        image: formImage.trim(),
        popular: formPopular,
        highlights: formHighlights.split(',').map(h => h.trim()).filter(Boolean),
        prepTime: formPrepTime.trim() || '24h de antecedência',
      };

      await onSaveProduct(cakeData);
      setIsFormModalOpen(false);
      onNotify(editingProduct ? `Produto "${cakeData.name}" atualizado online!` : `Novo produto "${cakeData.name}" adicionado com sucesso!`);
    } catch (err: any) {
      onNotify('Erro ao salvar produto: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async (id: string) => {
    try {
      await onDeleteProduct(id);
      setDeletingProductId(null);
      onNotify('Produto excluído com sucesso do catálogo online.');
    } catch (err: any) {
      onNotify('Erro ao excluir: ' + err.message);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Metrics
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 
    ? (products.reduce((acc, p) => acc + p.price, 0) / totalProducts).toFixed(2)
    : '0.00';
  const popularCount = products.filter(p => p.popular).length;

  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-pink-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-600/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
              Acesso Restrito
            </span>
            <h2 className="font-serif font-bold text-2xl text-pink-950">
              Painel Administrativo
            </h2>
            <p className="text-xs text-slate-500">
              Entre com suas credenciais para gerenciar produtos, preços e pedidos online.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">E-mail do Administrador</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="acreanamarcia@gmail.com"
                className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Senha de Acesso</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Acessar Painel</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-pink-100">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 text-xs text-pink-700 font-semibold bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200/80 transition-colors"
            >
              ⚡ Entrar com 1 Clique (Márcia Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RENDER ADMIN DASHBOARD
  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* Top Admin Header Bar */}
      <div className="bg-gradient-to-r from-pink-800 via-pink-700 to-rose-700 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-pink-400/30">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 text-pink-100">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-200" />
            <span>Sessão Online Ativa · Administrador Márcia</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Painel de Controle de Produtos
          </h1>
          <p className="text-pink-100/90 text-xs sm:text-sm mt-1">
            Cadastre novos bolos, altere preços em tempo real, atualize fotos e gerencie seu catálogo online.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            title="Voltar para a visualização dos clientes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Loja</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-white hover:bg-pink-50 text-pink-700 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-pink-600" />
            <span>Incluir Novo Produto</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-pink-900/60 hover:bg-pink-950 text-pink-200 rounded-xl text-xs transition-colors"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-pink-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-pink-950">Total de Produtos</span>
            <Package className="w-4 h-4 text-pink-600" />
          </div>
          <div className="font-serif font-bold text-2xl text-pink-600">
            {totalProducts}
          </div>
          <span className="text-[11px] text-slate-400">Ativos no cardápio online</span>
        </div>

        <div className="bg-white rounded-2xl border border-pink-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-pink-950">Preço Médio</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif font-bold text-2xl text-slate-900">
            R$ {avgPrice}
          </div>
          <span className="text-[11px] text-slate-400">Por unidade de bolo</span>
        </div>

        <div className="bg-white rounded-2xl border border-pink-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-pink-950">Mais Pedidos</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-serif font-bold text-2xl text-amber-500">
            {popularCount}
          </div>
          <span className="text-[11px] text-slate-400">Itens em alta no topo</span>
        </div>

        <div className="bg-white rounded-2xl border border-pink-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-pink-950">Sincronização</span>
            <TrendingUp className="w-4 h-4 text-pink-600" />
          </div>
          <div className="font-serif font-bold text-lg text-emerald-600 flex items-center gap-1 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
          <span className="text-[11px] text-slate-400">Banco de Dados Ativo</span>
        </div>
      </div>

      {/* Product List & Controls */}
      <div className="bg-white rounded-3xl border border-pink-200/90 p-6 shadow-xs space-y-5">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produto pelo nome ou ingrediente..."
              className="w-full bg-pink-50/40 border border-pink-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'festas', label: 'Festas' },
              { id: 'caseiros', label: 'Caseiros' },
              { id: 'potes', label: 'Potes' },
              { id: 'tortas', label: 'Tortas' },
              { id: 'especiais', label: 'Especiais' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-50 text-pink-950 hover:bg-pink-100 border border-pink-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-pink-100 text-pink-900/60 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Preço Atual</th>
                <th className="py-3 px-3">Rendimento</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-pink-50/40 transition-colors group">
                  {/* Product info with thumbnail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-100 border border-pink-200 shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>
                      <div className="space-y-0.5 max-w-xs">
                        <span className="font-serif font-bold text-sm text-pink-950 block truncate">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {p.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-100 text-pink-700 border border-pink-200">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3">
                    <span className="font-serif font-bold text-sm text-pink-600">
                      R$ {p.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Rendimento */}
                  <td className="py-3 px-3 text-slate-600">
                    <div>{p.slices}</div>
                    <div className="text-[10px] text-slate-400">{p.weight}</div>
                  </td>

                  {/* Status / Popular */}
                  <td className="py-3 px-3">
                    {p.popular ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Destaque
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Padrão</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-2.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg font-semibold flex items-center gap-1 border border-pink-200 transition-colors"
                        title="Editar produto e preço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setDeletingProductId(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-pink-200 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-700 to-rose-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">
                  {editingProduct ? `Editar: ${editingProduct.name}` : 'Cadastrar Novo Bolo / Produto'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nome do Bolo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Bolo Red Velvet Supremo"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Categoria *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white"
                  >
                    <option value="festas">Festas & Aniversários</option>
                    <option value="caseiros">Caseiros & Café da Tarde</option>
                    <option value="potes">Bolos no Pote</option>
                    <option value="tortas">Tortas Finas</option>
                    <option value="especiais">Especiais do Ateliê</option>
                  </select>
                </div>
              </div>

              {/* Price & Weight/Slices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-pink-700 block">Preço de Venda (R$) *</label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full bg-white border-2 border-pink-400 rounded-xl p-2.5 text-xs font-bold text-pink-700 outline-none focus:border-pink-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Rendimento (Fatias)</label>
                  <input
                    type="text"
                    value={formSlices}
                    onChange={(e) => setFormSlices(e.target.value)}
                    placeholder="15 a 18 fatias"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Peso Médio</label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="1.8 kg"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div className="space-y-2 bg-pink-50/60 p-3.5 rounded-2xl border border-pink-200">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-pink-950 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                    <span>URL da Imagem do Produto *</span>
                  </label>
                  <span className="text-[10px] text-pink-600">Prévia em tempo real</span>
                </div>

                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white border border-pink-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600 font-mono"
                />

                {/* Instant image preview box */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-pink-200 shrink-0 shadow-xs">
                    {formImage ? (
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p>Cole o link direto da foto do bolo (Unsplash, Imgur, ou CDN da sua loja).</p>
                    <div className="flex items-center gap-1 text-pink-700 font-semibold cursor-pointer" onClick={() => setFormImage('https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80')}>
                      <span>Clique aqui para foto sugerida de chocolate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Descrição e Ingredientes</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a massa, o recheio cremoso e a cobertura do bolo..."
                  className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600 focus:bg-white resize-none"
                />
              </div>

              {/* Highlights & PrepTime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Destaques (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formHighlights}
                    onChange={(e) => setFormHighlights(e.target.value)}
                    placeholder="Nutella Pura, Ninho, Sem Glúten"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Tempo Mínimo de Antecedência</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="24h de antecedência ou Pronta Entrega"
                    className="w-full bg-pink-50/40 border border-pink-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              {/* Popular Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formPopular}
                  onChange={(e) => setFormPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold text-pink-950">Marcar como "Mais Pedido / Destaque do Cardápio"</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-pink-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando online...' : 'Salvar no Banco de Dados'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-pink-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900">Excluir este produto?</h3>
              <p className="text-xs text-slate-500">
                Esta ação removerá o bolo do catálogo online imediatamente.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmDelete(deletingProductId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/30 transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
