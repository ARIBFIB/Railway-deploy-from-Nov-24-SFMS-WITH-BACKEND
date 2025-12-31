import { apiFetch } from '../utils/api';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  selected: boolean;
  matched: boolean;
  voucher_number?: string;
  comment?: string;
}

export interface ReconciliationData {
  accountingTransactions: Transaction[];
  loadedTransactions: Transaction[];
}

export interface ReconciliationFilters {
  account: string;
  start_date: string;
  end_date: string;
  verification_series?: string;
}

export class ReconciliationService {
  static async getLedgerEntries(filters: ReconciliationFilters): Promise<{ success: boolean; data: ReconciliationData; message?: string }> {
    const queryParams = new URLSearchParams();
    queryParams.append('account', filters.account);
    queryParams.append('start_date', filters.start_date);
    queryParams.append('end_date', filters.end_date);

    if (filters.verification_series) {
      queryParams.append('verification_series', filters.verification_series);
    }

    const response = await apiFetch(`/api/reconciliation/ledger-entries?${queryParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch ledger entries');
    }

    return await response.json();
  }

  static async updateComment(id: string, comment: string): Promise<{ success: boolean; message?: string }> {
    const response = await apiFetch('/api/reconciliation/update-comment', {
      method: 'POST',
      body: JSON.stringify({ id, comment })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update comment');
    }

    return await response.json();
  }
}