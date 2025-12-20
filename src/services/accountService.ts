import { apiFetch } from '../utils/api';

export interface BudgetRow {
  id?: string;
  chart_of_account_id?: string;
  cost_center: string;
  annual_budget: number;
  percentage: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  christmas: number;
  created_at?: string;
  updated_at?: string;
}

export interface Account {
  id?: string;
  foundation_id: string;
  account_number: string;
  account_name: string;
  account_type: string; // Add account_type field
  vat_code?: string;
  sru?: string;
  atm?: string;
  opening_balance: number;
  budget: number;
  is_active: boolean;
  automatic_accounting?: string;
  suggest_debit_credit?: 'debit' | 'credit';
  transaction_info?: 'mandatory' | 'allowed' | 'not_allowed';
  suggest_transaction_info?: string;
  budget_distribution?: 'sek' | 'percent';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  budget_rows?: BudgetRow[];
}

export interface CreateAccountData {
  account_number: string;
  account_name: string;
  account_type: string; // Add account_type field
  vat_code?: string;
  sru?: string;
  atm?: string;
  opening_balance?: number;
  budget?: number;
  is_active?: boolean;
  automatic_accounting?: string;
  suggest_debit_credit?: 'debit' | 'credit';
  transaction_info?: 'mandatory' | 'allowed' | 'not_allowed';
  suggest_transaction_info?: string;
  budget_distribution?: 'sek' | 'percent';
  budget_rows?: Omit<BudgetRow, 'id' | 'chart_of_account_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateAccountData extends Partial<CreateAccountData> {
  id: string;
}

export interface AccountFilters {
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AccountResponse {
  success: boolean;
  data: Account;
  message?: string;
}

export interface AccountsResponse {
  success: boolean;
  data: Account[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
}

export class AccountService {
  // Create a new account
  static async createAccount(accountData: CreateAccountData): Promise<AccountResponse> {
    console.log('🔧 [AccountService] Creating account:', accountData);
    
    const response = await apiFetch('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
    
    console.log('📋 [AccountService] Create response status:', response.status, response.ok);
    
    if (!response.ok) {
      let errorMessage = 'Failed to create account';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ [AccountService] Create error response:', errorData);
      } catch (parseError) {
        console.error('❌ [AccountService] Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ [AccountService] Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }
    
    try {
      const result = await response.json();
      console.log('✅ [AccountService] Create result:', result);
      return result;
    } catch (parseError) {
      console.error('❌ [AccountService] Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ [AccountService] Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  // Get all accounts with optional filters
  static async getAccounts(filters?: AccountFilters): Promise<AccountsResponse> {
    console.log('🔧 [AccountService] Getting accounts with filters:', filters);
    const params = new URLSearchParams();
    
    if (filters?.is_active !== undefined) {
      params.append('is_active', filters.is_active.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    // Add cache busting timestamp to prevent stale data
    params.append('_t', Date.now().toString());

    const queryString = params.toString();
    const url = queryString ? `/api/accounts?${queryString}` : '/api/accounts';
    
    console.log('🔍 [AccountService] Fetching URL:', url);
    const response = await apiFetch(url);
    
    console.log('📋 [AccountService] Get response status:', response.status, response.ok);
    
    if (!response.ok) {
      let errorMessage = 'Failed to fetch accounts';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ [AccountService] Get error response:', errorData);
      } catch (parseError) {
        console.error('❌ [AccountService] Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ [AccountService] Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }
    
    try {
      const result = await response.json();
      console.log('✅ [AccountService] Get result:', {
        success: result.success,
        dataCount: result.data?.length || 0
      });
      return result;
    } catch (parseError) {
      console.error('❌ [AccountService] Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ [AccountService] Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  // Get a specific account by ID
  static async getAccountById(id: string): Promise<AccountResponse> {
    const response = await apiFetch(`/api/accounts/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch account');
    }
    
    return await response.json();
  }

  // Update an account
  static async updateAccount(id: string, accountData: UpdateAccountData): Promise<AccountResponse> {
    console.log('🔧 [AccountService] Updating account:', id, accountData);
    const response = await apiFetch(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
    
    console.log('📋 [AccountService] Update response status:', response.status, response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [AccountService] Update error:', errorData);
      throw new Error(errorData.message || 'Failed to update account');
    }
    
    const result = await response.json();
    console.log('✅ [AccountService] Update result:', result);
    return result;
  }

  // Delete an account
  static async deleteAccount(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiFetch(`/api/accounts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete account');
    }
    
    return await response.json();
  }

  // Bulk update account status (activate/deactivate)
  static async bulkUpdateStatus(accountIds: string[], isActive: boolean): Promise<BulkUpdateResponse> {
    const response = await apiFetch('/api/accounts/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ accountIds, isActive }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update account status');
    }
    
    return await response.json();
  }

  // Bulk delete accounts
  static async bulkDelete(accountIds: string[]): Promise<BulkUpdateResponse> {
    const response = await apiFetch('/api/accounts/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ accountIds }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete accounts');
    }
    
    return await response.json();
  }
}
