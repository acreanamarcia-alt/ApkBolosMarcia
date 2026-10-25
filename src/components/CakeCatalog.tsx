import React, { useState } from 'react';
import { 
  Search, 
  X,
  Sparkles, 
  Plus, 
  Minus, 
  Check, 
  Clock, 
  Users, 
  Heart, 
  Wand2, 
  ArrowRight, 
  Flame, 
  Star,
  Layers,
  RotateCcw
} from 'lucide-react';
import { CakeItem, CategoryType } from '../types';
import { CAKE_ITEMS } from '../data/cakes';

interface CakeCatalogProps {
  products?: CakeItem[];
  onAddToCart: (item: CakeItem, quantity?: number) => void;
  onOpenCustomBuilder: () => void;
  onOpenCalculator: () => void;
}

export const CakeCatalog: React.FC<CakeCatalogProps> = ({
  products = CAKE_ITEMS,
  onAddToCart,
  onOpenCustomBuilder,
  onOpenCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCakeModal, setSelectedCakeModal] = useState<CakeItem | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const categories: { id: CategoryType; label: string; shortLabel: string; icon: string }[] = [
    { id: 'todos', label: 'Todos os Bolos', shortLabel: 'Todos', icon: '🍰' },
    { id: 'chocolate', label: 'Chocolates & Cacau', shortLabel: 'Chocolate', icon: '🍫' },
    { id: 'frutas', label: 'Frutas Frescas', shortLabel: 'Frutas', icon: '🍓' },
    { id: 'festas', label: 'Festas & Aniversários', shortLabel: 'Festas', icon: '🎂' },
    { id: 'caseiros', label: 'Caseiros & Café', shortLabel: 'Caseiros', icon: '☕' },
    { id: 'potes', label: 'Bolos no Pote', shortLabel: 'No Pote', icon: '🍮' },
    { id: 'tortas', label: 'Tortas Finas', shortLabel: 'Tortas', icon: '🥧' },
    { id: 'especiais', label: 'Especiais do Ateliê', shortLabel: 'Especiais', icon: '✨' },
  ];

  const quickSearchTags = ['Ninho', 'Nutella', 'Red Velvet', 'Cenoura', 'Vulcão', 'Morango', 'Brigadeiro'];

  const sourceProducts = products && products.length > 0 ? products : CAKE_ITEMS;

  const matchesCategoryHelper = (cake: CakeItem, cat: CategoryType): boolean => {
    if (cat === 'todos') return true;
    if (cat === 'chocolate') {
      const text = `${cake.name} ${cake.description} ${cake.highlights.join(' ')} ${cake.category}`.toLowerCase();
      return cake.category === 'chocolate' || 
             text.includes('chocolate') || 
             text.includes('cacau') || 
             text.includes('nutella') || 
             text.includes('brigadeiro') || 
             text.includes('brownie');
    }
    if (cat === 'frutas') {
      const text = `${cake.name} ${cake.description} ${cake.highlights.join(' ')} ${cake.category}`.toLowerCase();
      return cake.category === 'frutas' || 
             text.includes('morango') || 
             text.includes('fruta') || 
             text.includes('banana') || 
             text.includes('banoffee') || 
             text.includes('laranja') || 
             text.includes('goiabada') || 
             text.includes('limão') || 
             text.includes('vermelhas');
    }
    return cake.category === cat;
  };

  const getCategoryCount = (catId: CategoryType): number => {
    return sourceProducts.filter(cake => matchesCategoryHelper(cake, catId)).length;
  };

  const filteredCakes = sourceProducts.filter(cake => {
    const matchesCategory = matchesCategoryHelper(cake, selectedCategory);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch = 
      cake.name.toLowerCase().includes(q) ||
      cake.description.toLowerCase().includes(q) ||
      cake.highlights.some(h => h.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Barra de Filtro por Categoria no Topo do Componente */}
      <section className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#FFD1E8] p-3 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#FFD1E8] text-[#2D3142] border border-[#FF9DCB]/40">
              <Layers className="w-4 h-4 text-[#2D3142]" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#2D3142] font-serif">
                Filtrar por Categoria
              </h2>
              <p className="text-[10px] text-[#8E9AAF] hidden sm:block">
                Toque para encontrar bolos por tipo e sabor instantaneamente
              </p>
            </div>
          </div>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              className="text-[11px] font-bold text-[#2D3142] hover:text-[#2D3142] flex items-center gap-1 cursor-pointer bg-[#FFD1E8]/70 hover:bg-[#FFD1E8] px-2.5 py-1 rounded-lg transition-colors border border-[#FF9DCB]/60"
            >
              <RotateCcw className="w-3 h-3 text-[#2D3142]" />
              <span>Ver Todos ({sourceProducts.length})</span>
            </button>
          )}
        </div>

        {/* Botões de Filtro */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs whitespace-nowrap transition-all select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#FF9DCB] text-[#2D3142] shadow-md shadow-[#FF9DCB]/30 scale-102 ring-2 ring-[#FFD1E8] ring-offset-1 font-bold'
                    : 'bg-white text-[#2D3142] border border-[#FFD1E8] hover:border-[#FF9DCB] hover:bg-[#FFD1E8]/40 font-medium'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.shortLabel}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive 
                    ? 'bg-[#2D3142]/15 text-[#2D3142]' 
                    : 'bg-[#FFD1E8] text-[#2D3142] group-hover:bg-[#FFD1E8]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D3142] via-[#353A4E] to-[#2D3142] text-white p-6 sm:p-10 shadow-xl border border-[#FFD1E8]/30">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-[#FF9DCB]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-72 h-72 bg-[#C8B6FF]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD1E8]/20 border border-[#FFD1E8]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#FFD1E8] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9DCB]" />
            <span>Feito à mão no Acre com carinho e ingredientes nobres</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Bolos artesanais inesquecíveis para adoçar a sua vida.
          </h1>

          <p className="text-[#F7F7FF]/90 text-xs sm:text-sm leading-relaxed">
            Massas fofinhas e molhadinhas, recheios duplos cremosos e decoração impecável. Escolha uma de nossas criações ou monte o seu bolo sob medida!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCustomBuilder}
              className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-[#FF9DCB]"
            >
              <Wand2 className="w-4 h-4 text-[#2D3142]" />
              <span>Personalizar Bolo do Meu Jeito</span>
            </button>

            <button
              onClick={onOpenCalculator}
              className="bg-white/10 hover:bg-white/20 text-white border border-[#FFD1E8]/40 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="text-[#FFD1E8]">Calculadora de Convidados</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD1E8]" />
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#FFD1E8] shadow-xs space-y-3">
        {/* Search Bar Header & Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label htmlFor="cake-search" className="text-xs font-bold text-[#2D3142] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#2D3142]" />
              <span>Buscar Bolos e Sabores</span>
            </label>
            {searchQuery && (
              <span className="text-[11px] font-bold text-[#2D3142] bg-[#FFD1E8] px-2 py-0.5 rounded-full border border-[#FF9DCB]">
                {filteredCakes.length} {filteredCakes.length === 1 ? 'bolo encontrado' : 'bolos encontrados'}
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#8E9AAF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="cake-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome do bolo (ex: Ninho, Red Velvet, Cenoura, Vulcão, Chocolate...)"
              className="w-full bg-[#F7F7FF] border border-[#FFD1E8] hover:border-[#FF9DCB] focus:bg-white rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-[#2D3142] placeholder-[#8E9AAF] outline-none focus:ring-2 focus:ring-[#FF9DCB]/40 focus:border-[#FF9DCB] shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar busca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8E9AAF] hover:text-[#2D3142] hover:bg-[#FFD1E8]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[11px]">
          <span className="text-[#8E9AAF] font-medium whitespace-nowrap pr-1">Sugestões rápidas:</span>
          {quickSearchTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#FF9DCB] text-[#2D3142] border-[#FF9DCB] shadow-xs'
                  : 'bg-[#F7F7FF] text-[#2D3142] border-[#FFD1E8] hover:bg-[#FFD1E8] hover:border-[#FF9DCB]'
              }`}
            >
              {tag}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#2D3142] hover:text-[#2D3142]/80 underline font-semibold text-[11px] whitespace-nowrap pl-1"
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* Categories Carousel */}
        <div className="pt-2 border-t border-[#FFD1E8]/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                    isActive
                      ? 'bg-[#FF9DCB] text-[#2D3142] shadow-xs font-bold'
                      : 'bg-white text-[#2D3142] border border-[#FFD1E8] hover:border-[#FF9DCB] hover:text-[#2D3142] hover:bg-[#FFD1E8]/40'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#2D3142]/15 text-[#2D3142]' : 'bg-[#FFD1E8] text-[#2D3142]'
                  }`}>
                    {getCategoryCount(cat.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cakes Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-lg text-[#2D3142]">Nossas Delícias</h2>
            <span className="text-xs text-[#8E9AAF] font-medium">({filteredCakes.length} opções)</span>
          </div>
          <span className="text-xs text-[#2D3142] font-semibold flex items-center gap-1 bg-[#FFD1E8] px-2.5 py-1 rounded-full border border-[#FF9DCB]">
            <Clock className="w-3.5 h-3.5 text-[#2D3142]" />
            <span>Encomendas abertas</span>
          </span>
        </div>

        {filteredCakes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#FFD1E8] p-10 text-center text-[#8E9AAF] space-y-3 shadow-xs">
            <div className="w-14 h-14 bg-[#FFD1E8] rounded-full flex items-center justify-center mx-auto text-[#2D3142] border border-[#FF9DCB]">
              <Search className="w-6 h-6" />
            </div>
            <p className="font-serif text-lg text-[#2D3142] font-bold">
              {searchQuery ? `Nenhum bolo encontrado para "${searchQuery}"` : 'Nenhum bolo nesta categoria'}
            </p>
            <p className="text-xs text-[#8E9AAF] max-w-sm mx-auto">
              Tente buscar por termos mais simples como &quot;Ninho&quot;, &quot;Cenoura&quot;, &quot;Vulcão&quot; ou limpe os filtros para ver todo o cardápio.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todos');
                }}
                className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#FF9DCB]/25 transition-all cursor-pointer border border-[#FF9DCB]"
              >
                Ver Todo o Cardápio
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCakes.map((cake) => (
              <div
                key={cake.id}
                className="bg-white rounded-3xl border border-[#FFD1E8] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#FF9DCB] transition-all flex flex-col group"
              >
                {/* Image Container */}
                <div 
                  onClick={() => { setSelectedCakeModal(cake); setModalQty(1); }}
                  className="relative aspect-4/3 overflow-hidden cursor-pointer bg-[#F7F7FF]"
                >
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {cake.popular && (
                      <span className="bg-[#FF9DCB] text-[#2D3142] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white">
                        <Flame className="w-3 h-3 fill-[#2D3142]" />
                        Mais Pedido
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md text-[#2D3142] text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs border border-[#FFD1E8]">
                    {cake.slices}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => { setSelectedCakeModal(cake); setModalQty(1); }}
                        className="font-serif font-bold text-base text-[#2D3142] group-hover:text-[#2D3142]/80 transition-colors cursor-pointer line-clamp-1"
                      >
                        {cake.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5C677D] line-clamp-2 mt-1 leading-relaxed">
                      {cake.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {cake.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] text-[#2D3142] bg-[#FFD1E8]/70 px-2 py-0.5 rounded-md font-semibold border border-[#FFD1E8]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="pt-2 border-t border-[#FFD1E8]/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8E9AAF] uppercase block font-medium">Valor</span>
                      <div className="font-serif font-bold text-lg text-[#2D3142]">
                        R$ {cake.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(cake, 1)}
                      className="bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-95 text-[#2D3142] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-[#FF9DCB]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cake Details Modal */}
      {selectedCakeModal && (
        <div className="fixed inset-0 z-50 bg-[#2D3142]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FFD1E8] flex flex-col max-h-[90vh]">
            <div className="relative aspect-16/9 bg-[#F7F7FF]">
              <img
                src={selectedCakeModal.image}
                alt={selectedCakeModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedCakeModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2D3142] flex items-center justify-center font-bold text-sm shadow-md transition-all cursor-pointer border border-[#FFD1E8]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#2D3142] uppercase tracking-wider bg-[#FFD1E8] px-2 py-0.5 rounded border border-[#FF9DCB]/50">
                    {selectedCakeModal.category}
                  </span>
                  <span className="text-xs text-[#8E9AAF]">· {selectedCakeModal.prepTime}</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#2D3142]">
                  {selectedCakeModal.name}
                </h3>
              </div>

              <p className="text-sm text-[#5C677D] leading-relaxed">
                {selectedCakeModal.description}
              </p>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#FFD1E8] text-xs">
                <div>
                  <span className="text-[#8E9AAF] font-medium block">Rendimento Estimado</span>
                  <span className="font-semibold text-[#2D3142]">{selectedCakeModal.slices}</span>
                </div>
                <div>
                  <span className="text-[#8E9AAF] font-medium block">Peso Médio</span>
                  <span className="font-semibold text-[#2D3142]">{selectedCakeModal.weight}</span>
                </div>
              </div>

              {/* Quantity and Add */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 bg-[#F7F7FF] border border-[#FFD1E8] p-1 rounded-xl">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-[#2D3142] flex items-center justify-center font-bold hover:bg-[#FFD1E8] transition-colors cursor-pointer border border-[#FFD1E8]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-[#2D3142] w-6 text-center font-mono">
                    {modalQty}
                  </span>
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-[#2D3142] flex items-center justify-center font-bold hover:bg-[#FFD1E8] transition-colors cursor-pointer border border-[#FFD1E8]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(selectedCakeModal, modalQty);
                    setSelectedCakeModal(null);
                  }}
                  className="bg-[#FF9DCB] hover:bg-[#FF85BE] text-[#2D3142] font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
                >
                  <span>Adicionar</span>
                  <span>· R$ {(selectedCakeModal.price * modalQty).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
