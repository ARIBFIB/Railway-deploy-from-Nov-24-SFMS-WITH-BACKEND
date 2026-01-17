// Use API instead of direct Supabase calls to ensure proper RLS handling
import { apiFetch } from '../utils/api';

// Helper function to get foundation ID (same as customers)
const getFoundationId = () => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  return userData.foundationId || userData.foundation_id;
};

export interface Supplier {
  id?: string;
  foundation_id: string; // Existing field
  supplier_number: string; // Existing field
  supplier_name: string; // May have been renamed from 'name'
  corporate_personal_id?: string; // Existing field
  status?: string; // Existing field
  industry_code?: string; // Existing field
  notes?: string; // Existing field
  created_at?: string; // Existing field
  updated_at?: string; // Existing field
  
  // Basic additional fields that should work
  email?: string;
  phone?: string;
  phone2?: string;
  fax?: string;
  // Fields for related data that will be mapped to addresses and contacts
  address?: string;
  address2?: string;
  postcode?: string;
  city?: string;
  country?: string;
  countryCode?: string;
}

export const supplierService = {
  // Create a new supplier
  create: async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    const foundation_id = getFoundationId();
    
    const response = await apiFetch(`/api/suppliers?foundation_id=${foundation_id}`, {
      method: 'POST',
      body: JSON.stringify({
        supplier_number: supplierData.supplier_number,
        name: supplierData.supplier_name, // API expects 'name' field
        corporate_personal_id: supplierData.corporate_personal_id,
        status: supplierData.status,
        industry_code: supplierData.industry_code,
        notes: supplierData.notes,
        email: supplierData.email,
        phone: supplierData.phone,
        addresses: [{
          street_address: supplierData.address,
          street_address2: supplierData.address2,
          postal_code: supplierData.postcode,
          city: supplierData.city,
          country: supplierData.country,
          country_code: supplierData.countryCode
        }],
        contacts: [{
          phone: supplierData.phone,
          phone2: supplierData.phone2,
          fax: supplierData.fax,
          email: supplierData.email
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create supplier');
    }

    const responseData = await response.json();
    return responseData.supplier as Supplier;
  },

  // Get all suppliers
  getAll: async () => {
    const foundation_id = getFoundationId();
    const response = await apiFetch(`/api/suppliers?foundation_id=${foundation_id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch suppliers');
    }
    
    const data = await response.json();
    return data.suppliers || [];
  },

  // Get supplier by ID
  getById: async (id: string) => {
    const foundation_id = getFoundationId();
    const response = await apiFetch(`/api/suppliers/${id}?foundation_id=${foundation_id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch supplier');
    }
    
    const data = await response.json();
    return data.supplier as Supplier;
  },

  // Update supplier
  update: async (id: string, supplierData: Partial<Supplier>) => {
    const foundation_id = getFoundationId();
    
    // Map fields to match API expectations
    const updateData: any = {};
    if (supplierData.supplier_name !== undefined) updateData.name = supplierData.supplier_name;
    if (supplierData.supplier_number !== undefined) updateData.supplier_number = supplierData.supplier_number;
    if (supplierData.corporate_personal_id !== undefined) updateData.corporate_personal_id = supplierData.corporate_personal_id;
    if (supplierData.status !== undefined) updateData.status = supplierData.status;
    if (supplierData.industry_code !== undefined) updateData.industry_code = supplierData.industry_code;
    if (supplierData.notes !== undefined) updateData.notes = supplierData.notes;
    if (supplierData.email !== undefined) updateData.email = supplierData.email;
    if (supplierData.phone !== undefined) updateData.phone = supplierData.phone;
    
    const response = await apiFetch(`/api/suppliers/${id}?foundation_id=${foundation_id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update supplier');
    }

    const responseData = await response.json();
    return responseData.supplier as Supplier;
  },

  // Delete supplier
  delete: async (id: string) => {
    const foundation_id = getFoundationId();
    const response = await apiFetch(`/api/suppliers/${id}?foundation_id=${foundation_id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete supplier');
    }
  },

  // Search suppliers
  search: async (searchTerm: string) => {
    const foundation_id = getFoundationId();
    const response = await apiFetch(`/api/suppliers/search?foundation_id=${foundation_id}&q=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search suppliers');
    }
    
    const data = await response.json();
    return data.suppliers || [];
  }
};