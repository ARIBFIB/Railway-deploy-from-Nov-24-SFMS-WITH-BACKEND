import { apiFetch } from '../utils/api';

export interface TransactionAccount {
  id: string;
  foundation_id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  description?: string;
  is_active: boolean;
}

export const transactionAccountsService = {
  async list(params?: { foundation_id?: string; search?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/transaction-accounts?${qs.toString()}`);
    const json = await res.json();
    return json.data as TransactionAccount[];
  },

  async getById(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/transaction-accounts/${id}?${qs.toString()}`);
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async create(data: Partial<TransactionAccount>, foundation_id: string) {
    const res = await apiFetch('/api/transaction-accounts', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async update(id: string, data: Partial<TransactionAccount>, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/transaction-accounts/${id}?${qs.toString()}`, {
      method: 'PUT',
      json: data
    });
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async delete(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/transaction-accounts/${id}?${qs.toString()}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  async bulkUpdateStatus(ids: string[], is_active: boolean, foundation_id: string) {
    const res = await apiFetch('/api/transaction-accounts/bulk-update', {
      method: 'PATCH',
      json: { transaction_account_ids: ids, is_active },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as TransactionAccount[];
  }
};
