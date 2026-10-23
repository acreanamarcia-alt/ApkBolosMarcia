import React from 'react';
import { 
  ShoppingBag, 
  Cake, 
  Sparkles, 
  Phone, 
  Download, 
  Calculator, 
  HeartHandshake, 
  Wand2, 
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, CartItem } from '../types';

interface BakeryHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onInstallApk: () => void;
}

export const BakeryHeader: React.FC<BakeryHeaderProps> = ({
  activeTab,
  onSelectTab,
  cartItems,
  onOpenCart,
  onInstallApk,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/90 shadow-xs">
      {/* Top micro-bar: Rosa Forte */}
      <div className="bg-gradient-to-r from-pink-700 via-pink-600 to-rose-600 text-white text-[11px] font-medium py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3 h-3 text-pink-200 shrink-0" />
          <span className="truncate">Ateliê Bolos Márcia · Rio Branco - AC · Feito à mão com afeto</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-pink-100">WhatsApp: (68) 99912-3456</span>
          <button
            onClick={onInstallApk}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <Download className="w-2.5 h-2.5" />
            <span>Instalar APK</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & App Name */}
        <div 
          onClick={() => onSelectTab('catalogo')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center text-white shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg text-pink-950 tracking-tight leading-none group-hover:text-pink-600 transition-colors">
                Bolos Márcia
              </span>
              <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                APK
              </span>
            </div>
            <p className="text-[11px] text-pink-900/60 font-medium">Doces & Bolos Artesanais</p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-pink-50 border border-pink-200/80 rounded-xl">
          {[
            { id: 'catalogo', label: 'Cardápio', icon: <Cake className="w-4 h-4" /> },
            { id: 'personalizar', label: 'Monte Seu Bolo', icon: <Wand2 className="w-4 h-4" /> },
            { id: 'calculadora', label: 'Calculadora de Festa', icon: <Calculator className="w-4 h-4" /> },
            { id: 'sobre', label: 'O Ateliê', icon: <HeartHandshake className="w-4 h-4" /> },
            { id: 'admin', label: 'Painel Admin', icon: <ShieldCheck className="w-4 h-4" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'text-pink-950/80 hover:text-pink-600 hover:bg-pink-100/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Cart Button: Rosa Forte */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-pink-600/25 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-pink-200 text-pink-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-pink-300">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Carrinho</span>
            {totalCartValue > 0 && (
              <span className="bg-pink-700 px-1.5 py-0.5 rounded text-[11px] font-mono">
                R$ {totalCartValue.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
