import axios, { AxiosError } from 'axios';
import type {
  Restaurant,
  Menu,
  Order,
  CreateOrderPayload,
  Payment,
  CreatePaymentPayload,
  DashboardStats,
  AuthResponse,
  LoginPayload,
  MenuItem,
  Category,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/dashboard';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Restaurant ──────────────────────────────────────────────────────────────
export const restaurantApi = {
  getBySlug: async (slug: string): Promise<Restaurant> => {
    const { data } = await apiClient.get(`/restaurants/${slug}/`);
    return data;
  },
  getMenu: async (slug: string): Promise<Menu> => {
    const { data } = await apiClient.get(`/restaurants/${slug}/menu/`);
    return data;
  },
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await apiClient.post('/orders/', payload);
    return data;
  },
  getById: async (id: string | number): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/${id}/`);
    return data;
  },
  updateStatus: async (
    id: string | number,
    status: string,
    estimated_time?: number
  ): Promise<Order> => {
    const { data } = await apiClient.patch(`/orders/${id}/status/`, {
      status,
      estimated_time,
    });
    return data;
  },
  list: async (params?: {
    status?: string;
    restaurant?: number;
  }): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders/', { params });
    return data;
  },
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsApi = {
  create: async (payload: CreatePaymentPayload): Promise<Payment> => {
    const { data } = await apiClient.post('/payments/', payload);
    return data;
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/dashboard/statistics/');
    return data;
  },
};

// ─── Menu Management ─────────────────────────────────────────────────────────
export const menuApi = {
  createItem: async (item: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await apiClient.post('/menu-items/', item);
    return data;
  },
  updateItem: async (
    id: number,
    item: Partial<MenuItem>
  ): Promise<MenuItem> => {
    const { data } = await apiClient.patch(`/menu-items/${id}/`, item);
    return data;
  },
  deleteItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/menu-items/${id}/`);
  },
  listItems: async (): Promise<MenuItem[]> => {
    const { data } = await apiClient.get('/menu-items/');
    return data;
  },
  createCategory: async (cat: Partial<Category>): Promise<Category> => {
    const { data } = await apiClient.post('/categories/', cat);
    return data;
  },
  updateCategory: async (
    id: number,
    cat: Partial<Category>
  ): Promise<Category> => {
    const { data } = await apiClient.patch(`/categories/${id}/`, cat);
    return data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}/`);
  },
  listCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories/');
    return data;
  },
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login/', payload);
    return data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout/');
  },
};
