import React from 'react';
import { 
  Cake, 
  Wand2, 
  Calculator, 
  ShoppingBag, 
  HeartHandshake 
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
    { id: 'personalizar', label: 'Personalizar', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'calculadora', label: 'Calculadora', icon: <Calculator className="w-4 h-4" /> },
    { id: 'sobre', label: 'Ateliê', icon: <HeartHandshake className="w-4 h-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 py-1.5 px-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as ActiveTab)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-rose-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-rose-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Cart button */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center p-1 rounded-xl text-slate-700 relative cursor-pointer"
      >
        <div className="relative p-1">
          <ShoppingBag className="w-4 h-4 text-rose-600" />
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-bold text-rose-600">Sacola</span>
      </button>
    </nav>
  );
};
