// Restaurant
export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  address: string;
  phone: string;
  is_open: boolean;
  currency: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  description: string;
  order: number;
  is_active: boolean;
}

// Menu Item
export interface MenuItem {
  id: number;
  category: number;
  category_name: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number;
}

export interface Menu {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

// Cart
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// Order
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: number;
  menu_item: number;
  menu_item_name: string;
  menu_item_price: string;
  quantity: number;
  subtotal: string;
  special_instructions: string;
}

export interface Order {
  id: number;
  restaurant: number;
  restaurant_name: string;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  items: OrderItem[];
  total_amount: string;
  notes: string;
  created_at: string;
  updated_at: string;
  estimated_time: number | null;
}

// Create Order Payload
export interface CreateOrderPayload {
  restaurant: number;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  notes?: string;
  items: {
    menu_item: number;
    quantity: number;
    special_instructions?: string;
  }[];
}

// Payment
export interface Payment {
  id: number;
  order: number;
  amount: string;
  method: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  created_at: string;
}

export interface CreatePaymentPayload {
  order: number;
  amount: string;
  method: 'cash' | 'card' | 'mobile';
}

// Dashboard Statistics
export interface DashboardStats {
  total_revenue: string;
  total_orders: number;
  orders_today: number;
  revenue_today: string;
  top_items: {
    menu_item__name: string;
    total_quantity: number;
    total_revenue: string;
  }[];
  orders_by_status: {
    status: OrderStatus;
    count: number;
  }[];
  revenue_by_day: {
    date: string;
    revenue: string;
    orders: number;
  }[];
}

// Auth
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  restaurant: number | null;
  restaurant_slug: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// API Error
export interface ApiError {
  message: string;
  detail?: string;
  [key: string]: unknown;
}
