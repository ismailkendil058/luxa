export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  category: string;
  images: string[] | null;
  stock: number | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  variants: ProductVariant[] | null;
  created_at: string;
  updated_at: string;
}

export interface Wilaya {
  id: number;
  code: string;
  name: string;
  shipping_bureau: number;
  shipping_domicile: number;
  is_active: boolean | null;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  wilaya_id: number | null;
  wilaya?: Wilaya;
  delivery_method: string;
  shipping_cost: number;
  items: CartItem[] | any[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSettings {
  id: number;
  admin_password_hash: string;
  default_shipping_bureau: number;
  default_shipping_domicile: number;
  updated_at: string;
}

export type Category = 'visage' | 'yeux' | 'levres' | 'palettes' | 'accessoires';

export const categoryLabels: Record<Category, string> = {
  visage: 'Visage',
  yeux: 'Yeux',
  levres: 'Lèvres',
  palettes: 'Palettes',
  accessoires: 'Accessoires'
};
