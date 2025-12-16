import { apiFetch } from '../utils/api';

export interface TransactionAccount {
  id: string;
  foundation_id: string;
  name?: string; // Controller uses 'name'
  account_name?: string; // Frontend often uses this
  account_number: string;
  bank?: string;
  iban?: string;
  currency?: string;
  account_type?: string;
  description?: string;
  is_active: boolean;
  current_balance?: number; // Might not be in DB transaction_accounts directly, often calculated or separate
}

export interface BankTransaction {
  id: string;
  transaction_account_id: string;
  transaction_date: string; // or accounting_date
  description: string;
  reference_number?: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
  balance_after: number;
  category?: string;
  is_reconciled: boolean;
}

export const transactionAccountsService = {
  async list(params?: { foundation_id?: string; search?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id); // Controller expects header usually but let's see
    // Controller: const foundation_id = req.headers['x-foundation-id'] as string;
    // So we must pass header. 

    // NOTE: apiFetch likely handles auth token, but headers like X-Foundation-ID might need manual addition if the API specifically demands it.
    // The previous service code used `headers: { 'X-Foundation-ID': foundation_id }`.
    // I should preserve that pattern.

    // BUT list() in controller uses `req.headers`.
    // The previous file's `list` method used query params? No, looking at previous file:
    // It constructed QS.
    // But `apiFetch` call didn't include headers for `list`. 
    // This implies `list` might fail if controller demands header.
    // Controller: `const foundation_id = req.headers['x-foundation-id'] as string;`
    // YES, it requires header. 

    // If usage of list() passes foundation_id in params, I should move it to headers.

    const headers: Record<string, string> = {};
    if (params?.foundation_id) {
      headers['X-Foundation-ID'] = params.foundation_id;
    }

    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);

    const res = await apiFetch(`/api/transaction-accounts?${qs.toString()}`, {
      headers
    });
    const json = await res.json();
    return json.data as TransactionAccount[];
  },

  async getById(id: string, foundation_id: string) {
    const res = await apiFetch(`/api/transaction-accounts/${id}`, {
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async create(data: Partial<TransactionAccount>, foundation_id: string) {
    const res = await apiFetch('/api/transaction-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async update(id: string, data: Partial<TransactionAccount>, foundation_id: string) {
    const res = await apiFetch(`/api/transaction-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as TransactionAccount;
  },

  async delete(id: string, foundation_id: string) {
    const res = await apiFetch(`/api/transaction-accounts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Foundation-ID': foundation_id }
    });
    return res.ok;
  },

  async getTransactions(accountId: string, foundation_id: string) {
    const res = await apiFetch(`/api/transaction-accounts/${accountId}/transactions`, {
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as BankTransaction[];
  }
};
