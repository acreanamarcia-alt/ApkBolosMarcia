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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#FFD1E8] shadow-xs">
      {/* Top micro-bar: Rosa vibrante + Acento Lavanda */}
      <div className="bg-gradient-to-r from-[#FF9DCB] via-[#FFD1E8] to-[#C8B6FF] text-[#2D3142] text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between border-b border-[#FFD1E8]">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#2D3142] shrink-0" />
          <span className="truncate">Ateliê Bolos Márcia · Rio Branco - AC · Feito à mão com afeto</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-[#2D3142] font-medium">WhatsApp: (68) 99912-3456</span>
          <button
            onClick={onInstallApk}
            className="flex items-center gap-1.5 bg-white hover:bg-[#F7F7FF] text-[#2D3142] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all shadow-xs border border-[#FF9DCB] cursor-pointer hover:scale-105 active:scale-95"
            title="Instalar ícone na tela inicial do celular"
          >
            <Download className="w-3 h-3 text-[#2D3142]" />
            <span>Instalar no Celular</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & App Name with Official App Icon */}
        <div 
          onClick={() => onSelectTab('catalogo')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9DCB] to-[#FFD1E8] border border-[#FF9DCB] p-0.5 shadow-md shadow-[#FF9DCB]/40 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
            <img 
              src="/pwa-192x192.png" 
              alt="Logo Bolos Márcia" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-lg text-[#2D3142] tracking-tight leading-none group-hover:text-[#2D3142]/80 transition-colors">
                Bolos Márcia
              </span>
              <span className="bg-[#FFD1E8] text-[#2D3142] border border-[#FF9DCB] text-[10px] font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">
                APP
              </span>
            </div>
            <p className="text-[11px] text-[#8E9AAF] font-medium">Doces & Bolos Artesanais</p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#F7F7FF] border border-[#FFD1E8] rounded-xl">
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF9DCB] text-[#2D3142] font-bold shadow-xs'
                    : 'text-[#8E9AAF] hover:text-[#2D3142] hover:bg-[#FFD1E8]/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Cart Button: Cor Primária (#FF9DCB) com texto em alto contraste (#2D3142) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-[#FF9DCB] hover:bg-[#FF85BE] active:scale-95 text-[#2D3142] px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#FF9DCB]/30 transition-all cursor-pointer border border-[#FF9DCB]"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#2D3142]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C8B6FF] text-[#2D3142] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Carrinho</span>
            {totalCartValue > 0 && (
              <span className="bg-[#FFD1E8] text-[#2D3142] border border-[#FF9DCB]/60 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">
                R$ {totalCartValue.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
