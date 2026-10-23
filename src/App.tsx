/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BakeryHeader } from './components/BakeryHeader';
import { CakeCatalog } from './components/CakeCatalog';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { PartyCalculator } from './components/PartyCalculator';
import { AboutContact } from './components/AboutContact';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { InstallApkModal } from './components/InstallApkModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Toast } from './components/Toast';
import { ActiveTab, CakeItem, CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogo');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('bolos_marcia_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bolos_marcia_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(curr => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleAddToCart = (cake: CakeItem, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.itemId === cake.id);
      if (existing) {
        return prev.map(item => 
          item.itemId === cake.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        cartId: 'item-' + Date.now(),
        itemId: cake.id,
        title: cake.name,
        subtitle: `${cake.slices} · ${cake.weight}`,
        price: cake.price,
        quantity,
        image: cake.image,
      };
      return [...prev, newItem];
    });
    notify(`Adicionado: ${cake.name} (${quantity}x)`);
  };

  const handleAddCustomCake = (customItem: CartItem) => {
    setCartItems(prev => [...prev, customItem]);
    setActiveTab('catalogo');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));
    notify('Item removido da sacola');
  };

  const handleClearCart = () => {
    setCartItems([]);
    notify('Sacola esvaziada');
  };

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <BakeryHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onInstallApk={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        {activeTab === 'catalogo' && (
          <CakeCatalog
            onAddToCart={handleAddToCart}
            onOpenCustomBuilder={() => setActiveTab('personalizar')}
            onOpenCalculator={() => setActiveTab('calculadora')}
          />
        )}

        {activeTab === 'personalizar' && (
          <CustomCakeBuilder
            onAddCustomCake={handleAddCustomCake}
            onNotify={notify}
          />
        )}

        {activeTab === 'calculadora' && (
          <PartyCalculator
            onGoToCustomBuilder={() => setActiveTab('personalizar')}
            onGoToCatalog={() => setActiveTab('catalogo')}
          />
        )}

        {activeTab === 'sobre' && (
          <AboutContact />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart & Checkout WhatsApp Modal */}
      <CartCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onNotify={notify}
      />

      {/* Install APK / PWA Modal */}
      <InstallApkModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onNotify={notify}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
