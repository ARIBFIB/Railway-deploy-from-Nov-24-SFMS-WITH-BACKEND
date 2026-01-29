import { apiFetch } from '../utils/api';

export interface PersonnelCategory {
  id: string;
  name: string;
  type: string;
  foundation_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePersonnelCategoryPayload {
  name: string;
  type: string;
  foundation_id: string;
}

export interface UpdatePersonnelCategoryPayload {
  name?: string;
  type?: string;
}

class PersonnelCategoriesService {
  private baseUrl = '/api/personnel-categories';

  async list(foundationId: string): Promise<PersonnelCategory[]> {
    try {
      const response = await apiFetch(`${this.baseUrl}?foundation_id=${foundationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch personnel categories:', error);
      throw error;
    }
  }

  async getById(id: string, foundationId: string): Promise<PersonnelCategory> {
    try {
      const response = await apiFetch(`${this.baseUrl}/${id}?foundation_id=${foundationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch personnel category ${id}:`, error);
      throw error;
    }
  }

  async create(payload: CreatePersonnelCategoryPayload): Promise<PersonnelCategory> {
    try {
      const response = await apiFetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create personnel category');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to create personnel category:', error);
      throw error;
    }
  }

  async update(id: string, payload: UpdatePersonnelCategoryPayload, foundationId: string): Promise<PersonnelCategory> {
    try {
      const response = await apiFetch(`${this.baseUrl}/${id}?foundation_id=${foundationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update personnel category');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Failed to update personnel category ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string, foundationId: string): Promise<void> {
    try {
      const response = await apiFetch(`${this.baseUrl}/${id}?foundation_id=${foundationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete personnel category');
      }
    } catch (error) {
      console.error(`Failed to delete personnel category ${id}:`, error);
      throw error;
    }
  }
}

export const personnelCategoriesService = new PersonnelCategoriesService();