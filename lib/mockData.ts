// Mock Data for JDIGITAL System

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
}

export interface Movement {
  id: string;
  date: Date;
  type: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  productId: string;
  quantity: number;
  userId: string;
  notes?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@jdigital.com',
    password: 'Admin123!',
    name: 'Administrador',
    role: 'admin',
    avatar: 'A'
  },
  {
    id: '2',
    email: 'vendedor1@jdigital.com',
    password: 'Vendedor123!',
    name: 'Juan Pérez',
    role: 'user',
    avatar: 'JP'
  },
  {
    id: '3',
    email: 'vendedor2@jdigital.com',
    password: 'Vendedor123!',
    name: 'María García',
    role: 'user',
    avatar: 'MG'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Laptops', description: 'Computadoras portátiles' },
  { id: '2', name: 'Celulares', description: 'Teléfonos móviles' },
  { id: '3', name: 'Accesorios', description: 'Accesorios tecnológicos' },
  { id: '4', name: 'Monitores', description: 'Monitores y pantallas' }
];

// Mock Providers
export const mockProviders: Provider[] = [
  { id: '1', name: 'Intelice', description: 'Distribuidor de tecnología' },
  { id: '2', name: 'Delsa', description: 'Proveedor de equipos' },
  { id: '3', name: 'Bribus', description: 'Distribuidor mayorista' }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'LP001',
    name: 'Laptop Dell XPS 13',
    category: 'Laptops',
    stock: 5,
    minStock: 2,
    buyPrice: 800,
    sellPrice: 1100,
    status: 'active'
  },
  {
    id: '2',
    sku: 'IP001',
    name: 'iPhone 15 Pro',
    category: 'Celulares',
    stock: 2,
    minStock: 3,
    buyPrice: 950,
    sellPrice: 1299,
    status: 'active'
  },
  {
    id: '3',
    sku: 'MS001',
    name: 'Mouse Logitech MX Master 3',
    category: 'Accesorios',
    stock: 15,
    minStock: 5,
    buyPrice: 45,
    sellPrice: 99,
    status: 'active'
  },
  {
    id: '4',
    sku: 'MON001',
    name: 'Monitor Samsung 27" 4K',
    category: 'Monitores',
    stock: 3,
    minStock: 1,
    buyPrice: 280,
    sellPrice: 399,
    status: 'active'
  },
  {
    id: '5',
    sku: 'KB001',
    name: 'Teclado Mecánico Razer',
    category: 'Accesorios',
    stock: 0,
    minStock: 2,
    buyPrice: 85,
    sellPrice: 149,
    status: 'active'
  },
  {
    id: '6',
    sku: 'LP002',
    name: 'Laptop HP Pavilion 15',
    category: 'Laptops',
    stock: 7,
    minStock: 2,
    buyPrice: 500,
    sellPrice: 799,
    status: 'active'
  }
];

// Mock Movements
export const mockMovements: Movement[] = [
  {
    id: '1',
    date: new Date(2026, 2, 1, 14, 30),
    type: 'entrada',
    productId: '1',
    quantity: 5,
    userId: '1',
    notes: 'Compra a Intelice'
  },
  {
    id: '2',
    date: new Date(2026, 2, 1, 16, 15),
    type: 'salida',
    productId: '2',
    quantity: 1,
    userId: '2',
    notes: 'Venta a cliente'
  },
  {
    id: '3',
    date: new Date(2026, 2, 2, 10, 0),
    type: 'entrada',
    productId: '3',
    quantity: 10,
    userId: '1',
    notes: 'Restock'
  }
];
