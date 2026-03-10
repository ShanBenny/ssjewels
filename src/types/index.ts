export type Category = 'Imitation Jewellery' | 'Ladies Sarees' | 'Small Home Items';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category?: string; // Derived for UI
  image_url: string;
  images: string[]; // For UI compatibility
  featured?: boolean;
  stock: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  is_admin?: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  user_id?: string;
  created_at: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  amount: number;
  status: string;
  created_at?: string;
}
