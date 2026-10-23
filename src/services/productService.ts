import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CakeItem } from '../types';
import { CAKE_ITEMS } from '../data/cakes';

const PRODUCTS_COLLECTION = 'products';
const STORAGE_KEY = 'bolos_marcia_online_products';

export async function fetchProducts(): Promise<CakeItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (!querySnapshot.empty) {
      const items: CakeItem[] = [];
      querySnapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as CakeItem);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return items;
    }

    // Seed if empty
    await seedInitialProducts();
    return CAKE_ITEMS;
  } catch (error) {
    console.warn('Firestore fetch fallback to cache/local:', error);
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : CAKE_ITEMS;
  }
}

export function subscribeToProducts(callback: (products: CakeItem[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snapshot) => {
      if (!snapshot.empty) {
        const items: CakeItem[] = [];
        snapshot.forEach(docSnap => {
          items.push({ id: docSnap.id, ...docSnap.data() } as CakeItem);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        callback(items);
      } else {
        seedInitialProducts().then(() => callback(CAKE_ITEMS));
      }
    }, (error) => {
      console.warn('Realtime subscription error, using local fallback:', error);
      const cached = localStorage.getItem(STORAGE_KEY);
      callback(cached ? JSON.parse(cached) : CAKE_ITEMS);
    });
    return unsub;
  } catch (err) {
    console.warn('Error starting subscription:', err);
    callback(CAKE_ITEMS);
    return () => {};
  }
}

export async function seedInitialProducts(): Promise<void> {
  try {
    for (const cake of CAKE_ITEMS) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, cake.id), cake, { merge: true });
    }
  } catch (err) {
    console.warn('Could not seed to Firestore directly:', err);
  }
}

export async function saveProductOnline(cake: CakeItem): Promise<void> {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, cake.id), cake, { merge: true });
  } catch (err) {
    console.warn('Firestore write failed, updating local state:', err);
  }

  // Always update local cache
  const cached = localStorage.getItem(STORAGE_KEY);
  const items: CakeItem[] = cached ? JSON.parse(cached) : [...CAKE_ITEMS];
  const idx = items.findIndex(i => i.id === cake.id);
  if (idx >= 0) {
    items[idx] = cake;
  } else {
    items.unshift(cake);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function deleteProductOnline(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (err) {
    console.warn('Firestore delete failed, updating local state:', err);
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    const items: CakeItem[] = JSON.parse(cached);
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
