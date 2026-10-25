import React from 'react';
import { 
  Cake, 
  Wand2, 
  Calculator, 
  ShoppingBag, 
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, CartItem } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  cartItems,
  onOpenCart,
}) => {
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'catalogo', label: 'Cardápio', icon: <Cake className="w-4 h-4" /> },
    { id: 'personalizar', label: 'Monte Bolo', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'calculadora', label: 'Calculadora', icon: <Calculator className="w-4 h-4" /> },
    { id: 'sobre', label: 'Ateliê', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#FFD1E8] py-1.5 px-1 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as ActiveTab)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#2D3142] font-bold'
                : 'text-[#8E9AAF] hover:text-[#2D3142] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-[#FFD1E8] text-[#2D3142] border border-[#FF9DCB]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Cart button */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-[#2D3142] relative cursor-pointer"
      >
        <div className="relative p-1.5 rounded-xl hover:bg-[#FFD1E8]/40 transition-colors">
          <ShoppingBag className="w-4 h-4 text-[#2D3142]" />
          {totalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#FF9DCB] text-[#2D3142] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
              {totalCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-bold text-[#2D3142]">Sacola</span>
      </button>
    </nav>
  );
};
