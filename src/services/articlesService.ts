import { apiFetch } from '../utils/api';

export interface Article {
  id: string;
  foundation_id: string;
  article_number: string;
  name: string;
  description?: string;
  category_id?: string;
  unit?: string;
  price?: number;
  cost?: number;
  vat_rate?: number;
  is_active: boolean;
}

export interface ArticleCategory {
  id: string;
  foundation_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
}

export const articlesService = {
  async list(params?: { foundation_id?: string; search?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/articles?${qs.toString()}`);
    const json = await res.json();
    return json.data as Article[];
  },

  async getById(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/articles/${id}?${qs.toString()}`);
    const json = await res.json();
    return json.data as Article;
  },

  async create(data: Partial<Article>, foundation_id: string) {
    const res = await apiFetch('/api/articles', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as Article;
  },

  async update(id: string, data: Partial<Article>, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/articles/${id}?${qs.toString()}`, {
      method: 'PUT',
      json: data
    });
    const json = await res.json();
    return json.data as Article;
  },

  async delete(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/articles/${id}?${qs.toString()}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async getCategories(foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/articles/categories?${qs.toString()}`);
    const json = await res.json();
    return json.data as ArticleCategory[];
  },

  async createCategory(data: Partial<ArticleCategory>, foundation_id: string) {
    const res = await apiFetch('/api/articles/categories', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as ArticleCategory;
  }
};
