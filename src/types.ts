export type CategoryType = 
  | 'todos' 
  | 'chocolate' 
  | 'frutas' 
  | 'festas' 
  | 'caseiros' 
  | 'potes' 
  | 'tortas' 
  | 'especiais';

export type ActiveTab = 'catalogo' | 'personalizar' | 'calculadora' | 'carrinho' | 'sobre' | 'dev-tools' | 'admin';

export interface CakeItem {
  id: string;
  name: string;
  category: 'festas' | 'caseiros' | 'potes' | 'tortas' | 'especiais' | 'chocolate' | 'frutas';
  price: number;
  description: string;
  slices: string;
  weight: string;
  image: string;
  popular?: boolean;
  highlights: string[];
  prepTime: string;
}

export interface CustomCakeSize {
  id: string;
  name: string;
  slices: string;
  weight: string;
  basePrice: number;
}

export interface CustomCakeSelection {
  sizeId: string;
  dough: string;
  filling1: string;
  filling2: string;
  frosting: string;
  extras: string[];
  topperText: string;
  notes: string;
}

export interface CartItem {
  cartId: string;
  itemId?: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  image?: string;
  customDetails?: string[];
}

export interface OrderForm {
  name: string;
  whatsapp: string;
  deliveryType: 'delivery' | 'retirada';
  address: string;
  neighborhood: string;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: 'pix' | 'cartao' | 'dinheiro';
  changeFor: string;
  observation: string;
}

export type ToolMode = 'html' | 'playground' | 'diff' | 'regex' | 'transform' | 'snippets' | 'markdown';
export type AppTheme = 'dark' | 'midnight' | 'matrix' | 'light';

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'table' | 'result';
  args: any[];
  timestamp: string;
}

export interface CodePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  language: 'javascript' | 'html';
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  category: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  description: string;
  updatedAt: number;
}

export interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  testSample: string;
  description: string;
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  oldLineNumber?: number;
  newLineNumber?: number;
  text: string;
}

export interface JwtDecoded {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  issuedAt?: string;
  expiresAt?: string;
  expiresIn?: string;
  isValidStructure: boolean;
  error?: string;
}
