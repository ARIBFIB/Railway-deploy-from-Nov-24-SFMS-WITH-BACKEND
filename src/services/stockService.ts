import { apiFetch } from '../utils/api';

export interface Warehouse {
  id: string;
  foundation_id: string;
  name: string;
  location?: string;
  description?: string;
  is_active: boolean;
}

export interface StockLevel {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  min_stock_level?: number;
  max_stock_level?: number;
  reorder_point?: number;
  products?: {
    id: string;
    name: string;
    article_number: string;
    unit: string;
  };
  warehouses?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface StockMovement {
  id: string;
  foundation_id: string;
  product_id: string;
  warehouse_id?: string;
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    article_number: string;
  };
  warehouses?: {
    id: string;
    name: string;
  };
}

export const stockService = {
  async getStockLevels(params?: { foundation_id?: string; product_id?: string; warehouse_id?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.product_id) qs.set('product_id', params.product_id);
    if (params?.warehouse_id) qs.set('warehouse_id', params.warehouse_id);
    const res = await apiFetch(`/api/stock/levels?${qs.toString()}`);
    const json = await res.json();
    return json.data as StockLevel[];
  },

  async getStockLevelById(id: string, foundation_id?: string) {
    const res = await apiFetch(`/api/stock/levels/${id}`);
    const json = await res.json();
    return json.data as StockLevel;
  },

  async createStockMovement(data: Partial<StockMovement>, foundation_id: string) {
    const res = await apiFetch('/api/stock/movements', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as StockMovement;
  },

  async getStockMovements(params?: { foundation_id?: string; product_id?: string; warehouse_id?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.product_id) qs.set('product_id', params.product_id);
    if (params?.warehouse_id) qs.set('warehouse_id', params.warehouse_id);
    const res = await apiFetch(`/api/stock/movements?${qs.toString()}`);
    const json = await res.json();
    return json.data as StockMovement[];
  },

  async getWarehouses(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/stock/warehouses?${qs.toString()}`);
    const json = await res.json();
    return json.data as Warehouse[];
  },

  async getWarehouseById(id: string, foundation_id?: string) {
    const res = await apiFetch(`/api/stock/warehouses/${id}`);
    const json = await res.json();
    return json.data as Warehouse;
  },

  async createWarehouse(data: Partial<Warehouse>, foundation_id: string) {
    const res = await apiFetch('/api/stock/warehouses', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as Warehouse;
  },

  async updateWarehouse(id: string, data: Partial<Warehouse>, foundation_id?: string) {
    const res = await apiFetch(`/api/stock/warehouses/${id}`, {
      method: 'PUT',
      json: data
    });
    const json = await res.json();
    return json.data as Warehouse;
  },

  async deleteWarehouse(id: string, foundation_id?: string) {
    const res = await apiFetch(`/api/stock/warehouses/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  }
};
