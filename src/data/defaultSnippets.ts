import { Snippet } from '../types';

export const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: 'snip-debounce',
    title: 'Debounce with Immediate / Leading Option',
    language: 'javascript',
    category: 'Functions',
    tags: ['performance', 'events', 'utility'],
    isFavorite: true,
    description: 'Postpones function execution until after delay ms have elapsed since the last invocation.',
    code: `export function debounce(fn, wait = 300, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    }, wait);
    if (callNow) fn.apply(context, args);
  };
}`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'snip-slugify',
    title: 'URL Slug Generator (Unicode & Diacritics safe)',
    language: 'javascript',
    category: 'Strings',
    tags: ['seo', 'url', 'string'],
    isFavorite: false,
    description: 'Converts strings with accents, spaces, and punctuation to clean SEO slugs.',
    code: `export function slugify(str) {
  return str
    .normalize('NFKD') // Normalize unicode characters
    .replace(/[\\u0300-\\u036f]/g, '') // Remove diacritics
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
    .replace(/\\s+/g, '-') // Collapse whitespace and replace by -
    .replace(/-+/g, '-'); // Collapse dashes
}`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'snip-currency',
    title: 'Intl Currency Formatter',
    language: 'typescript',
    category: 'Formatting',
    tags: ['i18n', 'currency', 'intl'],
    isFavorite: true,
    description: 'Ultra-fast memoized currency formatting using native browser Intl.NumberFormat.',
    code: `const formatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  const key = \`\${locale}-\${currency}\`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      })
    );
  }
  return formatters.get(key)!.format(amount);
}`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'snip-color-convert',
    title: 'HEX to RGBA & RGB to HEX Converter',
    language: 'javascript',
    category: 'CSS / Colors',
    tags: ['color', 'css', 'converter'],
    isFavorite: false,
    description: 'Bi-directional color parser with alpha opacity support.',
    code: `export function hexToRgba(hex, alpha = 1) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return \`rgba(\${(num >> 16) & 255}, \${(num >> 8) & 255}, \${num & 255}, \${alpha})\`;
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: 'snip-use-localstorage',
    title: 'React useLocalStorage Hook with Sync',
    language: 'typescript',
    category: 'React Hooks',
    tags: ['react', 'hook', 'storage'],
    isFavorite: true,
    description: 'Syncs state across browser tabs using storage event listener.',
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue] as const;
}`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'snip-clamp',
    title: 'Math.clamp & Lerp Linear Interpolation',
    language: 'javascript',
    category: 'Math / Animation',
    tags: ['math', 'animation', 'utility'],
    isFavorite: false,
    description: 'Essential game dev and physics animation utilities.',
    code: `export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const lerp = (start, end, t) => start + (end - start) * t;

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};`,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  }
];
