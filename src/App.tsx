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
import { AdminDashboard } from './components/AdminDashboard';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { InstallApkModal } from './components/InstallApkModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Toast } from './components/Toast';
import { ActiveTab, CakeItem, CartItem } from './types';
import { CAKE_ITEMS } from './data/cakes';
import { subscribeToProducts, saveProductOnline, deleteProductOnline } from './services/productService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogo');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Online Products State with Realtime Firestore Sync
  const [products, setProducts] = useState<CakeItem[]>(() => {
    try {
      const stored = localStorage.getItem('bolos_marcia_online_products');
      return stored ? JSON.parse(stored) : CAKE_ITEMS;
    } catch {
      return CAKE_ITEMS;
    }
  });

  // Subscribe to realtime products from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProducts((updated) => {
      if (updated && updated.length > 0) {
        setProducts(updated);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  // Admin Product Actions
  const handleSaveProduct = async (cake: CakeItem) => {
    await saveProductOnline(cake);
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === cake.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cake;
        return copy;
      }
      return [cake, ...prev];
    });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProductOnline(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F7F7FF] text-[#2D3142] flex flex-col font-sans">
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
            products={products}
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

        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onNotify={notify}
            onExitAdmin={() => setActiveTab('catalogo')}
          />
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
