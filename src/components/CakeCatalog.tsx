import React, { useState } from 'react';
import { 
  Search, 
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
  Star
} from 'lucide-react';
import { CakeItem, CategoryType } from '../types';
import { CAKE_ITEMS } from '../data/cakes';

interface CakeCatalogProps {
  onAddToCart: (item: CakeItem, quantity?: number) => void;
  onOpenCustomBuilder: () => void;
  onOpenCalculator: () => void;
}

export const CakeCatalog: React.FC<CakeCatalogProps> = ({
  onAddToCart,
  onOpenCustomBuilder,
  onOpenCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCakeModal, setSelectedCakeModal] = useState<CakeItem | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: 'todos', label: 'Todos os Bolos', icon: '🍰' },
    { id: 'festas', label: 'Festas & Aniversários', icon: '🎂' },
    { id: 'caseiros', label: 'Caseiros & Café', icon: '☕' },
    { id: 'potes', label: 'Bolos no Pote', icon: '🍮' },
    { id: 'tortas', label: 'Tortas Finas', icon: '🥧' },
    { id: 'especiais', label: 'Especiais do Ateliê', icon: '✨' },
  ];

  const filteredCakes = CAKE_ITEMS.filter(cake => {
    const matchesCategory = selectedCategory === 'todos' || cake.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      cake.name.toLowerCase().includes(q) ||
      cake.description.toLowerCase().includes(q) ||
      cake.highlights.some(h => h.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Welcome Banner: Rosa Forte com toque aveludado */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-900 via-pink-700 to-rose-700 text-white p-6 sm:p-10 shadow-xl border border-pink-400/20">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-pink-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-pink-800/70 border border-pink-300/40 px-3 py-1 rounded-full text-xs font-semibold text-pink-100 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>Feito à mão no Acre com carinho e ingredientes nobres</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Bolos artesanais inesquecíveis para adoçar a sua vida.
          </h1>

          <p className="text-pink-100/90 text-xs sm:text-sm leading-relaxed">
            Massas fofinhas e molhadinhas, recheios duplos cremosos e decoração impecável. Escolha uma de nossas criações ou monte o seu bolo sob medida!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCustomBuilder}
              className="bg-white hover:bg-pink-50 text-pink-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-pink-600" />
              <span>Personalizar Bolo do Meu Jeito</span>
            </button>

            <button
              onClick={onOpenCalculator}
              className="bg-pink-800/60 hover:bg-pink-800/80 text-white border border-pink-300/40 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <span>Calculadora de Convidados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-3">
        {/* Search Bar */}
        <div className="relative max-w-lg">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por sabor (Ninho, Nutella, Morango, Cenoura...)"
            className="w-full bg-white border border-pink-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-pink-900/40 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 shadow-xs"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'bg-white text-pink-950 border border-pink-200/90 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Cakes Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-lg text-pink-950">Nossas Delícias</h2>
            <span className="text-xs text-pink-900/60 font-medium">({filteredCakes.length} opções)</span>
          </div>
          <span className="text-xs text-pink-600 font-semibold flex items-center gap-1 bg-pink-100/70 px-2.5 py-1 rounded-full border border-pink-200/80">
            <Clock className="w-3.5 h-3.5 text-pink-600" />
            <span>Encomendas abertas</span>
          </span>
        </div>

        {filteredCakes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-pink-200 p-12 text-center text-slate-500 space-y-2">
            <p className="font-serif text-lg text-pink-950 font-semibold">Nenhum bolo encontrado</p>
            <p className="text-xs text-slate-500">Tente buscar por outro sabor ou selecione todas as categorias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCakes.map((cake) => (
              <div
                key={cake.id}
                className="bg-white rounded-3xl border border-pink-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-pink-400 transition-all flex flex-col group"
              >
                {/* Image Container */}
                <div 
                  onClick={() => { setSelectedCakeModal(cake); setModalQty(1); }}
                  className="relative aspect-4/3 overflow-hidden cursor-pointer bg-pink-50"
                >
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {cake.popular && (
                      <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-pink-600/30">
                        <Flame className="w-3 h-3 fill-white" />
                        Mais Pedido
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md text-pink-950 text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs border border-pink-100">
                    {cake.slices}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 
                        onClick={() => { setSelectedCakeModal(cake); setModalQty(1); }}
                        className="font-serif font-bold text-base text-pink-950 group-hover:text-pink-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {cake.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {cake.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {cake.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md font-medium border border-pink-100">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="pt-2 border-t border-pink-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-pink-900/50 uppercase block font-medium">Valor</span>
                      <div className="font-serif font-bold text-lg text-pink-600">
                        R$ {cake.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(cake, 1)}
                      className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-pink-600/25 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-200 flex flex-col max-h-[90vh]">
            <div className="relative aspect-16/9 bg-pink-100">
              <img
                src={selectedCakeModal.image}
                alt={selectedCakeModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedCakeModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-pink-950 flex items-center justify-center font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider bg-pink-100 px-2 py-0.5 rounded">
                    {selectedCakeModal.category}
                  </span>
                  <span className="text-xs text-slate-500">· {selectedCakeModal.prepTime}</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-pink-950">
                  {selectedCakeModal.name}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedCakeModal.description}
              </p>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-pink-100 text-xs">
                <div>
                  <span className="text-pink-900/60 font-medium block">Rendimento Estimado</span>
                  <span className="font-semibold text-slate-900">{selectedCakeModal.slices}</span>
                </div>
                <div>
                  <span className="text-pink-900/60 font-medium block">Peso Médio</span>
                  <span className="font-semibold text-slate-900">{selectedCakeModal.weight}</span>
                </div>
              </div>

              {/* Quantity and Add */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 p-1 rounded-xl">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-pink-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-pink-950 w-6 text-center font-mono">
                    {modalQty}
                  </span>
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-pink-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(selectedCakeModal, modalQty);
                    setSelectedCakeModal(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
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
