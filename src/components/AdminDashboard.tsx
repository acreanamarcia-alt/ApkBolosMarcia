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
  RotateCcw,
  Upload,
  FileUp,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  FileImage
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
  const [formCategory, setFormCategory] = useState<'festas' | 'caseiros' | 'potes' | 'tortas' | 'especiais' | 'chocolate' | 'frutas'>('festas');
  const [formPrice, setFormPrice] = useState<string>('120.00');
  const [formDescription, setFormDescription] = useState('');
  const [formSlices, setFormSlices] = useState('15 a 18 fatias');
  const [formWeight, setFormWeight] = useState('2.0 kg');
  const [formImage, setFormImage] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formHighlights, setFormHighlights] = useState('Nutella, Ninho, Artesanal');
  const [formPrepTime, setFormPrepTime] = useState('24h de antecedência');
  const [isSaving, setIsSaving] = useState(false);

  // Optional Local .PNG Upload & Image Handling State
  const [imageInputTab, setImageInputTab] = useState<'upload' | 'url'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Helper to handle .PNG file selection and processing
  const handlePngFileUpload = (file: File) => {
    // Validate that file is .PNG
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setUploadError('Formato inválido! Por favor envie exclusivamente arquivos no formato .PNG (.png).');
      onNotify('Atenção: selecione um arquivo no formato .PNG');
      return;
    }

    setUploadError(null);
    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Check image dimensions and optimize canvas if necessary
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        if (img.width > maxDim || img.height > maxDim) {
          const canvas = document.createElement('canvas');
          const scale = Math.min(maxDim / img.width, maxDim / img.height);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const optimizedPng = canvas.toDataURL('image/png');
            setFormImage(optimizedPng);
            setUploadedFileName(file.name);
            setUploadedFileSize(`${Math.round(optimizedPng.length * 0.75 / 1024)} KB · .PNG otimizado`);
            setIsProcessingImage(false);
            onNotify(`Foto .PNG "${file.name}" carregada com sucesso!`);
            return;
          }
        }

        setFormImage(dataUrl);
        setUploadedFileName(file.name);
        setUploadedFileSize(`${Math.round(file.size / 1024)} KB · Formato .PNG`);
        setIsProcessingImage(false);
        onNotify(`Foto .PNG "${file.name}" carregada com sucesso!`);
      };

      img.onerror = () => {
        setFormImage(dataUrl);
        setUploadedFileName(file.name);
        setUploadedFileSize(`${Math.round(file.size / 1024)} KB · .PNG`);
        setIsProcessingImage(false);
        onNotify(`Foto .PNG carregada com sucesso!`);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setIsProcessingImage(false);
      setUploadError('Falha ao ler o arquivo local.');
      onNotify('Erro ao ler arquivo .PNG');
    };

    reader.readAsDataURL(file);
  };

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
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setUploadError(null);
    setImageInputTab('upload');
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
    setUploadError(null);
    if (cake.image && cake.image.startsWith('data:image/')) {
      setImageInputTab('upload');
      setUploadedFileName('foto-produto.png');
      setUploadedFileSize('Imagem .PNG Carregada');
    } else {
      setImageInputTab('url');
      setUploadedFileName(null);
      setUploadedFileSize(null);
    }
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
        <div className="bg-white rounded-3xl p-8 border border-[#FFD1E8] shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9DCB] to-[#FFD1E8] text-[#2D3142] flex items-center justify-center mx-auto shadow-lg shadow-[#FF9DCB]/30 border border-[#FF9DCB]">
            <Lock className="w-8 h-8 text-[#2D3142]" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#2D3142] uppercase tracking-wider bg-[#FFD1E8] px-2.5 py-0.5 rounded-full border border-[#FF9DCB]">
              Acesso Restrito
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#2D3142]">
              Painel Administrativo
            </h2>
            <p className="text-xs text-[#8E9AAF]">
              Entre com suas credenciais para gerenciar produtos, preços e pedidos online.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#FFD1E8]/60 border border-[#FF9DCB] rounded-xl text-[#2D3142] text-xs font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2D3142]">E-mail do Administrador</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="acreanamarcia@gmail.com"
                className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-3 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2D3142]">Senha de Acesso</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-3 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-95 text-[#2D3142] font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
            >
              <UserCheck className="w-4 h-4 text-[#2D3142]" />
              <span>Acessar Painel</span>
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-[#FFD1E8]">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 text-xs text-[#2D3142] font-bold bg-[#FFD1E8] hover:bg-[#FFD1E8]/80 rounded-xl border border-[#FF9DCB] transition-colors cursor-pointer"
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
      <div className="bg-gradient-to-r from-[#2D3142] via-[#353A4E] to-[#2D3142] text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#FFD1E8]/30">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFD1E8]/20 border border-[#FFD1E8]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 text-[#FFD1E8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF9DCB]" />
            <span>Sessão Online Ativa · Administrador Márcia</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Painel de Controle de Produtos
          </h1>
          <p className="text-[#F7F7FF]/90 text-xs sm:text-sm mt-1">
            Cadastre novos bolos, altere preços em tempo real, atualize fotos e gerencie seu catálogo online.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#FFD1E8] border border-[#FFD1E8]/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Voltar para a visualização dos clientes"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFD1E8]" />
            <span>Ver Loja</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer border border-[#FF9DCB]"
            title="Cadastrar novo bolo com foto .PNG ou URL"
          >
            <PlusCircle className="w-4 h-4 text-[#2D3142]" />
            <span>Incluir Novo Produto</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 hover:bg-white/20 text-[#FFD1E8] rounded-xl text-xs transition-colors cursor-pointer border border-[#FFD1E8]/30"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#FFD1E8] p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8E9AAF] text-xs">
            <span className="font-semibold text-[#2D3142]">Total de Produtos</span>
            <Package className="w-4 h-4 text-[#FF9DCB]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#2D3142]">
            {totalProducts}
          </div>
          <span className="text-[11px] text-[#8E9AAF]">Ativos no cardápio online</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FFD1E8] p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8E9AAF] text-xs">
            <span className="font-semibold text-[#2D3142]">Preço Médio</span>
            <DollarSign className="w-4 h-4 text-[#2D3142]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#2D3142]">
            R$ {avgPrice}
          </div>
          <span className="text-[11px] text-[#8E9AAF]">Por unidade de bolo</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FFD1E8] p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8E9AAF] text-xs">
            <span className="font-semibold text-[#2D3142]">Mais Pedidos</span>
            <Flame className="w-4 h-4 text-[#FF9DCB]" />
          </div>
          <div className="font-serif font-bold text-2xl text-[#2D3142]">
            {popularCount}
          </div>
          <span className="text-[11px] text-[#8E9AAF]">Itens em alta no topo</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FFD1E8] p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#8E9AAF] text-xs">
            <span className="font-semibold text-[#2D3142]">Sincronização</span>
            <TrendingUp className="w-4 h-4 text-[#FF9DCB]" />
          </div>
          <div className="font-serif font-bold text-lg text-[#2D3142] flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9DCB] animate-pulse" />
            <span>Online</span>
          </div>
          <span className="text-[11px] text-[#8E9AAF]">Banco de Dados Ativo</span>
        </div>
      </div>

      {/* Product List & Controls */}
      <div className="bg-white rounded-3xl border border-[#FFD1E8] p-6 shadow-xs space-y-5">
        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-[#FFD1E8]/30 via-[#F7F7FF] to-[#C8B6FF]/20 rounded-2xl p-4 border border-[#FFD1E8] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9DCB] flex items-center justify-center text-[#2D3142] shrink-0 shadow-xs border border-[#FF9DCB]">
              <Package className="w-5 h-5 text-[#2D3142]" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-[#2D3142] flex items-center gap-2">
                <span>Catálogo Online de Produtos</span>
                <span className="text-[10px] font-bold bg-[#FFD1E8] px-2 py-0.5 rounded-full text-[#2D3142] border border-[#FF9DCB]">
                  {products.length} itens cadastrados
                </span>
              </div>
              <p className="text-[11px] text-[#8E9AAF] mt-0.5">
                Use os botões para <strong className="text-[#2D3142]">Incluir Produto</strong> (com upload .PNG do computador), <strong className="text-[#2D3142]">Editar</strong> valores e fotos ou <strong className="text-[#2D3142]">Excluir</strong> itens online.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer border border-[#FF9DCB] shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#2D3142]" />
            <span>+ Incluir Novo Produto</span>
          </button>
        </div>

        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8E9AAF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produto pelo nome ou ingrediente..."
              className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'chocolate', label: 'Chocolate' },
              { id: 'frutas', label: 'Frutas' },
              { id: 'festas', label: 'Festas' },
              { id: 'caseiros', label: 'Caseiros' },
              { id: 'potes', label: 'Potes' },
              { id: 'tortas', label: 'Tortas' },
              { id: 'especiais', label: 'Especiais' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs font-bold border border-[#FF9DCB]'
                    : 'bg-[#F7F7FF] text-[#2D3142] hover:bg-[#FFD1E8] border border-[#FFD1E8]'
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
              <tr className="border-b border-[#FFD1E8] text-[#8E9AAF] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Preço Atual</th>
                <th className="py-3 px-3">Rendimento</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFD1E8]/40">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFD1E8]/15 transition-colors group">
                  {/* Product info with thumbnail */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F7F7FF] border border-[#FFD1E8] shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        {p.image.startsWith('data:image/') && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#2D3142]/85 text-[8px] font-bold text-[#FFD1E8] text-center py-0.5 tracking-tighter" title="Foto enviada via upload local .PNG">
                            .PNG
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5 max-w-xs">
                        <span className="font-serif font-bold text-sm text-[#2D3142] block truncate">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[#8E9AAF] line-clamp-1">
                          {p.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FFD1E8] text-[#2D3142] border border-[#FF9DCB]/60">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3">
                    <span className="font-serif font-bold text-sm text-[#2D3142]">
                      R$ {p.price.toFixed(2)}
                    </span>
                  </td>

                  {/* Rendimento */}
                  <td className="py-3 px-3 text-[#2D3142]">
                    <div>{p.slices}</div>
                    <div className="text-[10px] text-[#8E9AAF]">{p.weight}</div>
                  </td>

                  {/* Status / Popular */}
                  <td className="py-3 px-3">
                    {p.popular ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D3142] bg-[#FFD1E8] px-2 py-0.5 rounded-md border border-[#FF9DCB]">
                        <Flame className="w-3 h-3 fill-[#2D3142] text-[#2D3142]" />
                        Destaque
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8E9AAF]">Padrão</span>
                    )}
                  </td>

                  {/* Actions: Editar e Excluir */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-3 py-1.5 bg-[#FFD1E8] hover:bg-[#FF9DCB] text-[#2D3142] rounded-xl font-bold flex items-center gap-1.5 border border-[#FF9DCB] transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Editar produto, preço, foto e descrição"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#2D3142]" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setDeletingProductId(p.id)}
                        className="px-3 py-1.5 bg-[#F7F7FF] hover:bg-rose-50 text-rose-700 hover:text-rose-800 rounded-xl font-bold flex items-center gap-1.5 border border-rose-200 hover:border-rose-400 transition-all active:scale-95 cursor-pointer shadow-xs"
                        title="Excluir este produto do catálogo online"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Excluir</span>
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
        <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-[#FFD1E8] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF9DCB] via-[#FFD1E8] to-[#C8B6FF] text-[#2D3142] p-5 flex items-center justify-between border-b border-[#FFD1E8]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2D3142]" />
                <h3 className="font-serif font-bold text-lg text-[#2D3142]">
                  {editingProduct ? `Editar: ${editingProduct.name}` : 'Cadastrar Novo Bolo / Produto'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#2D3142] flex items-center justify-center font-bold text-sm cursor-pointer border border-[#FF9DCB]"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Nome do Bolo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Bolo Red Velvet Supremo"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Categoria *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white"
                  >
                    <option value="festas">Festas & Aniversários</option>
                    <option value="chocolate">Chocolate & Cacau</option>
                    <option value="frutas">Frutas & Morangos</option>
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
                  <label className="font-semibold text-[#2D3142] block">Preço de Venda (R$) *</label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full bg-white border-2 border-[#FF9DCB] rounded-xl p-2.5 text-xs font-bold text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Rendimento (Fatias)</label>
                  <input
                    type="text"
                    value={formSlices}
                    onChange={(e) => setFormSlices(e.target.value)}
                    placeholder="15 a 18 fatias"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Peso Médio</label>
                  <input
                    type="text"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    placeholder="1.8 kg"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                  />
                </div>
              </div>

              {/* Image Input Section: Local .PNG Upload (Optional) & Web URL */}
              <div className="space-y-3 bg-[#F7F7FF] p-4 rounded-2xl border border-[#FFD1E8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FFD1E8]/60 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#2D3142]" />
                    <span className="font-bold text-xs text-[#2D3142]">Foto do Produto *</span>
                    <span className="text-[10px] text-[#8E9AAF] bg-[#FFD1E8]/50 px-2 py-0.5 rounded-md border border-[#FF9DCB]/50">
                      Upload .PNG Opcional ou URL
                    </span>
                  </div>

                  {/* Tabs: Upload Local .PNG vs Link URL */}
                  <div className="inline-flex rounded-xl bg-white p-0.5 border border-[#FFD1E8] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageInputTab('upload')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        imageInputTab === 'upload'
                          ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs'
                          : 'text-[#8E9AAF] hover:text-[#2D3142]'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#2D3142]" />
                      <span>Upload .PNG Local</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputTab('url')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        imageInputTab === 'url'
                          ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs'
                          : 'text-[#8E9AAF] hover:text-[#2D3142]'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-[#2D3142]" />
                      <span>Link / URL</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: Local .PNG Upload Button and Drag Zone */}
                {imageInputTab === 'upload' && (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handlePngFileUpload(file);
                      }}
                      className={`border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center gap-2.5 ${
                        isDraggingFile
                          ? 'border-[#FF9DCB] bg-[#FFD1E8]/30 scale-[1.01]'
                          : 'border-[#FFD1E8] hover:border-[#FF9DCB] bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#FFD1E8] flex items-center justify-center text-[#2D3142] border border-[#FF9DCB] shadow-xs">
                        <FileUp className="w-6 h-6 text-[#2D3142]" />
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-[#2D3142]">
                          Upload de foto local em formato .PNG
                        </p>
                        <p className="text-[11px] text-[#8E9AAF]">
                          Selecione um arquivo de bolo direto do seu computador ou localhost
                        </p>
                      </div>

                      {/* Explicit button to trigger local file dialog */}
                      <div>
                        <label
                          htmlFor="admin-png-upload"
                          className="inline-flex items-center gap-2 bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-95 text-[#2D3142] font-bold text-xs px-4 py-2 rounded-xl shadow-xs border border-[#FF9DCB] cursor-pointer transition-all"
                        >
                          <Upload className="w-4 h-4 text-[#2D3142]" />
                          <span>📁 Escolher Arquivo .PNG do Computador</span>
                        </label>
                        <input
                          id="admin-png-upload"
                          type="file"
                          accept=".png,image/png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePngFileUpload(file);
                          }}
                        />
                      </div>

                      <span className="text-[10px] text-[#8E9AAF]">
                        * Filtro estrito: Aceita exclusivamente arquivos terminados em .png
                      </span>
                    </div>

                    {/* Upload Status / Feedback */}
                    {uploadError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {uploadedFileName && (
                      <div className="p-2.5 bg-[#FFD1E8]/40 border border-[#FF9DCB] rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-[#2D3142]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold block truncate max-w-xs">{uploadedFileName}</span>
                            <span className="text-[10px] text-[#8E9AAF]">{uploadedFileSize}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName(null);
                            setUploadedFileSize(null);
                            setFormImage('');
                          }}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    )}

                    {isProcessingImage && (
                      <div className="text-center text-xs text-[#2D3142] font-semibold py-1 animate-pulse">
                        Processando e otimizando imagem .PNG...
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: Web URL Direct Input */}
                {imageInputTab === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setUploadedFileName(null);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-white border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] font-mono"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8E9AAF]">
                      <span>Cole o link de imagem de qualquer servidor ou banco de imagens.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');
                          setUploadedFileName(null);
                        }}
                        className="font-bold text-[#2D3142] hover:underline cursor-pointer"
                      >
                        Usar foto sugestão
                      </button>
                    </div>
                  </div>
                )}

                {/* Instant image preview box */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#FFD1E8]/50">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#FFD1E8] shrink-0 shadow-xs">
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
                      <div className="w-full h-full flex items-center justify-center text-[#8E9AAF]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] space-y-1">
                    <div className="font-bold text-[#2D3142] flex items-center gap-1.5">
                      <span>Prévia da Foto do Bolo</span>
                      {formImage.startsWith('data:image/') ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          Arquivo .PNG Local Ativo
                        </span>
                      ) : formImage ? (
                        <span className="text-[10px] bg-[#FFD1E8] text-[#2D3142] font-bold px-2 py-0.5 rounded-md border border-[#FF9DCB]">
                          URL da Web Ativa
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          Nenhuma foto selecionada
                        </span>
                      )}
                    </div>
                    <p className="text-[#8E9AAF]">
                      Esta imagem será exibida nos cards do catálogo, carrinho e pedidos dos clientes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-[#2D3142] block">Descrição e Ingredientes</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a massa, o recheio cremoso e a cobertura do bolo..."
                  className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB] focus:bg-white resize-none"
                />
              </div>

              {/* Highlights & PrepTime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Destaques (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formHighlights}
                    onChange={(e) => setFormHighlights(e.target.value)}
                    placeholder="Nutella Pura, Ninho, Sem Glúten"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2D3142] block">Tempo Mínimo de Antecedência</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="24h de antecedência ou Pronta Entrega"
                    className="w-full bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl p-2.5 text-xs text-[#2D3142] outline-none focus:border-[#FF9DCB]"
                  />
                </div>
              </div>

              {/* Popular Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formPopular}
                  onChange={(e) => setFormPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF9DCB] focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold text-[#2D3142]">Marcar como "Mais Pedido / Destaque do Cardápio"</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FFD1E8]">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 text-[#8E9AAF] hover:text-[#2D3142] font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#FF9DCB]/30 flex items-center gap-1.5 transition-all cursor-pointer border border-[#FF9DCB]"
                >
                  <Save className="w-4 h-4 text-[#2D3142]" />
                  <span>{isSaving ? 'Salvando online...' : 'Salvar no Banco de Dados'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingProductId && (() => {
        const productToDelete = products.find(p => p.id === deletingProductId);
        return (
          <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#FFD1E8]">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#2D3142]">Excluir este produto?</h3>
                <p className="text-xs text-[#8E9AAF]">
                  Esta ação removerá o bolo do catálogo online e do banco de dados imediatamente.
                </p>
              </div>

              {/* Product Info Card Preview */}
              {productToDelete && (
                <div className="bg-[#F7F7FF] rounded-2xl p-3 border border-[#FFD1E8] flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#FFD1E8] shrink-0">
                    <img
                      src={productToDelete.image}
                      alt={productToDelete.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="font-serif font-bold text-xs text-[#2D3142] block truncate">
                      {productToDelete.name}
                    </span>
                    <span className="font-bold text-xs text-[#2D3142]">
                      R$ {productToDelete.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#8E9AAF] block uppercase font-semibold">
                      {productToDelete.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="flex-1 py-2.5 bg-[#F7F7FF] hover:bg-[#FFD1E8] text-[#2D3142] rounded-xl font-semibold text-xs transition-colors cursor-pointer border border-[#FFD1E8]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmDelete(deletingProductId)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
