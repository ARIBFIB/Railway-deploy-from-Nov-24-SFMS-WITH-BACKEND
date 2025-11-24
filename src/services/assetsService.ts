import { apiFetch } from '../utils/api';

export interface Asset {
  id: string;
  foundation_id: string;
  asset_number: string;
  name: string;
  description?: string;
  category?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  depreciation_method?: string;
  useful_life_years?: number;
  residual_value?: number;
  location?: string;
  status: string;
}

export interface AssetDepreciationSchedule {
  id: string;
  asset_id: string;
  foundation_id: string;
  year: number;
  month: number;
  depreciation_amount: number;
  accumulated_depreciation: number;
  book_value: number;
}

export const assetsService = {
  async list(params?: { foundation_id?: string; search?: string; status?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/assets?${qs.toString()}`);
    const json = await res.json();
    return json.data as Asset[];
  },

  async getById(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/assets/${id}?${qs.toString()}`);
    const json = await res.json();
    return json.data as Asset;
  },

  async create(data: Partial<Asset>, foundation_id: string) {
    const res = await apiFetch('/api/assets', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as Asset;
  },

  async update(id: string, data: Partial<Asset>, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/assets/${id}?${qs.toString()}`, {
      method: 'PUT',
      json: data
    });
    const json = await res.json();
    return json.data as Asset;
  },

  async delete(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/assets/${id}?${qs.toString()}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async getDepreciationSchedule(asset_id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/assets/${asset_id}/depreciation-schedule?${qs.toString()}`);
    const json = await res.json();
    return json.data as AssetDepreciationSchedule[];
  }
};
