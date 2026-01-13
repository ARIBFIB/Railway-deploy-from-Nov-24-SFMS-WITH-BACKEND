import { apiFetch } from '../utils/api';

// Type definitions
export interface CustomerData {
  id?: string;
  foundation_id: string;
  customer_number: string;
  customer_type: 'business' | 'private' | 'company';
  corporate_personal_id?: string;
  name: string;
  status: 'active' | 'inactive';
  industry_code?: string;
  workplace_number?: string;
  store_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerAddress {
  id?: string;
  customer_id?: string;
  address_type?: 'billing' | 'delivery' | string;
  name?: string;
  address?: string;
  address2?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  country_code?: string;
  is_primary?: boolean;
}

export interface CustomerContact {
  id?: string;
  customer_id?: string;
  phone?: string;
  phone2?: string;
  fax?: string;
  email?: string;
  web_address?: string;
}

export interface CreateCustomerPayload {
  customer: CustomerData;
  addresses?: CustomerAddress[];
  contacts?: CustomerContact[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    statusCode?: number;
  };
  customers?: T[]; // For getCustomers legacy compatibility
  total?: number;
}

// Customer Service Functions
export const customerService = {
  // Create a new customer with related data
  createCustomer: async (payload: CreateCustomerPayload): Promise<ApiResponse<CustomerData>> => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundation_id = userData.foundationId || userData.foundation_id;

      const response = await apiFetch(`/api/customers?foundation_id=${foundation_id}`, {
        method: 'POST',
        body: JSON.stringify({
          ...payload.customer,
          addresses: payload.addresses,
          contacts: payload.contacts
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      const responseData = await response.json();
      return {
        success: true,
        data: responseData.customer,
        message: responseData.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },

  // Get all customers for a foundation
  getCustomers: async (foundationId: string): Promise<any[]> => {
    try {
      const response = await apiFetch(`/api/customers?foundation_id=${foundationId}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      return data.customers || [];
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return [];
    }
  },

  // Get a single customer by ID
  getCustomerById: async (customerId: string): Promise<ApiResponse<CustomerData>> => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundation_id = userData.foundationId || userData.foundation_id;

      const response = await apiFetch(`/api/customers/${customerId}?foundation_id=${foundation_id}`);
      if (!response.ok) throw new Error('Failed to fetch customer');
      const data = await response.json();

      return {
        success: true,
        data: data.customer
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },

  // Update a customer
  updateCustomer: async (customerId: string, updates: CreateCustomerPayload): Promise<ApiResponse<CustomerData>> => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundation_id = userData.foundationId || userData.foundation_id;

      const response = await apiFetch(`/api/customers/${customerId}?foundation_id=${foundation_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updates.customer,
          addresses: updates.addresses,
          contacts: updates.contacts
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update customer');
      }

      const responseData = await response.json();
      return {
        success: true,
        data: responseData.customer,
        message: responseData.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  },

  // Delete a customer
  deleteCustomer: async (customerId: string): Promise<ApiResponse<void>> => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundation_id = userData.foundationId || userData.foundation_id;

      const response = await apiFetch(`/api/customers/${customerId}?foundation_id=${foundation_id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }

      const responseData = await response.json();
      return {
        success: true,
        message: responseData.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.message }
      };
    }
  }
};