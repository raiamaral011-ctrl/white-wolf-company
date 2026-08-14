export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  product_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  color_name: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  gender: 'unisex' | 'masculino' | 'feminino' | 'infantil';
  sport?: string;
  featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand?: Brand;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  product_sku: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_provider: string;
  payment_id?: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shipping_address: Address;
  customer_info: {
    full_name: string;
    email: string;
    cpf: string;
    phone?: string;
  };
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  provider_payment_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  payment_method: 'pix' | 'credit_card';
  qr_code?: string;
  qr_code_base64?: string;
  created_at: string;
  updated_at: string;
}

export interface FilterOptions {
  brandSlug?: string;
  categorySlug?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: 'relevance' | 'best_sellers' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  searchQuery?: string;
}
