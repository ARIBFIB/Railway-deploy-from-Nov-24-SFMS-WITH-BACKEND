import { apiFetch } from '../utils/api';

// Define the Item interface
export interface Item {
  id: string;
  foundation_id: string;
  item_number: string;
  ean?: string;
  name: string;
  supplier?: string;
  manufacturer?: string;
  manufacturer_item_number?: string;
  unit?: string;
  notes?: string;
  active: boolean;
  item_package: boolean;
  item_type: 'goods' | 'service' | 'other';
  stock_item: boolean;
  external_webshop: boolean;
  discontinued: boolean;
  bulky: boolean;
  sale_account: string;
  vat: string;
  sales_se_reverse_charge?: string;
  sales_eu_reverse_charge: string;
  sales_eu_subject_to_vat: string;
  sales_export: string;
  purchase_account: string;
  cost_calculation: number;
  stock_value: number;
  in_warehouse: number;
  reserved_quantity: number;
  available_amount: number;
  order_point: number;
  stock_location?: string;
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  weight_grams?: number;
  created_at: string;
  updated_at: string;
}

// Define the Item creation payload interface
export interface CreateItemPayload {
  foundation_id?: string;
  item_number: string;
  ean?: string;
  name: string;
  supplier?: string;
  manufacturer?: string;
  manufacturer_item_number?: string;
  unit?: string;
  notes?: string;
  active: boolean;
  item_package: boolean;
  item_type: 'goods' | 'service' | 'other';
  stock_item: boolean;
  external_webshop: boolean;
  discontinued: boolean;
  bulky: boolean;
  sale_account: string;
  vat: string;
  sales_se_reverse_charge?: string;
  sales_eu_reverse_charge: string;
  sales_eu_subject_to_vat: string;
  sales_export: string;
  purchase_account: string;
  cost_calculation: number;
  stock_value: number;
  in_warehouse: number;
  reserved_quantity: number;
  available_amount: number;
  order_point: number;
  stock_location?: string;
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  weight_grams?: number;
}

// Define the Item update payload interface
export interface UpdateItemPayload extends Partial<CreateItemPayload> { }

// Service functions
export const itemService = {
  // Get all items for the current foundation
  async getItems(foundationId: string): Promise<{ data: Item[] | null; error: any }> {
    try {
      const response = await apiFetch('/api/items');
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData };
      }
      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error fetching items:', error);
      return { data: null, error };
    }
  },

  // Get a single item by ID
  async getItemById(itemId: string): Promise<{ data: Item | null; error: any }> {
    try {
      const response = await apiFetch(`/api/items/${itemId}`);
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData };
      }
      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error fetching item:', error);
      return { data: null, error };
    }
  },

  // Create a new item
  async createItem(itemData: CreateItemPayload): Promise<{ data: Item | null; error: any }> {
    try {
      const response = await apiFetch('/api/items', {
        method: 'POST',
        json: itemData
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData };
      }
      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error creating item:', error);
      return { data: null, error };
    }
  },

  // Update an existing item
  async updateItem(itemId: string, itemData: UpdateItemPayload): Promise<{ data: Item | null; error: any }> {
    try {
      const response = await apiFetch(`/api/items/${itemId}`, {
        method: 'PUT',
        json: itemData
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData };
      }
      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error updating item:', error);
      return { data: null, error };
    }
  },

  // Delete an item
  async deleteItem(itemId: string): Promise<{ error: any }> {
    try {
      const response = await apiFetch(`/api/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData };
      }
      return { error: null };
    } catch (error) {
      console.error('Error deleting item:', error);
      return { error };
    }
  }
};