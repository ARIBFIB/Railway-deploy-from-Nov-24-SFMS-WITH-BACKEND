import { supabase } from '../config/database';

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

export class AccountModel {
  static async create(foundationId: string, accountData: CreateAccountData, userId: string): Promise<Account> {
    try {
      // First, create the account
      const insertData = {
        foundation_id: foundationId,
        account_number: accountData.account_number,
        account_name: accountData.account_name,
        vat_code: accountData.vat_code,
        sru: accountData.sru,
        atm: accountData.atm,
        opening_balance: accountData.opening_balance || 0,
        budget: accountData.budget || 0,
        is_active: accountData.is_active !== undefined ? accountData.is_active : true,
        automatic_accounting: accountData.automatic_accounting,
        suggest_debit_credit: accountData.suggest_debit_credit,
        transaction_info: accountData.transaction_info,
        suggest_transaction_info: accountData.suggest_transaction_info,
        budget_distribution: accountData.budget_distribution,
        created_by: userId,
        updated_by: userId
      };

      const { data: account, error: accountError } = await supabase
        .from('chart_of_accounts')
        .insert(insertData)
        .select()
        .single();

      if (accountError) {
        throw new Error(`Failed to create account: ${accountError.message}`);
      }

      // If budget rows are provided, create them
      if (accountData.budget_rows && accountData.budget_rows.length > 0) {
        const budgetRowsData = accountData.budget_rows.map(row => ({
          chart_of_account_id: account.id,
          cost_center: row.cost_center,
          annual_budget: row.annual_budget,
          percentage: row.percentage,
          jan: row.jan,
          feb: row.feb,
          mar: row.mar,
          apr: row.apr,
          may: row.may,
          jun: row.jun,
          jul: row.jul,
          aug: row.aug,
          sep: row.sep,
          oct: row.oct,
          nov: row.nov,
          dec: row.dec,
          christmas: row.christmas
        }));

        const { error: budgetError } = await supabase
          .from('budget_rows')
          .insert(budgetRowsData);

        if (budgetError) {
          console.error('Failed to create budget rows:', budgetError);
          // Don't throw error here, account was created successfully
        }
      }

      // Fetch the complete account with budget rows
      return await this.getById(account.id!);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  static async getById(accountId: string): Promise<Account> {
    try {
      const { data: account, error: accountError } = await supabase
        .from('chart_of_accounts')
        .select(`
          *,
          budget_rows (*)
        `)
        .eq('id', accountId)
        .single();

      if (accountError) {
        throw new Error(`Failed to fetch account: ${accountError.message}`);
      }

      return account;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  static async getByFoundation(foundationId: string, filters?: {
    is_active?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ accounts: Account[]; total: number }> {
    try {
      let query = supabase
        .from('chart_of_accounts')
        .select(`
          *,
          budget_rows (*)
        `, { count: 'exact' })
        .eq('foundation_id', foundationId)
        .order('account_number', { ascending: true });

      if (filters?.is_active !== undefined) {
        console.log('🔍 [AccountModel] Applying is_active filter:', filters.is_active);
        query = query.eq('is_active', filters.is_active);
      } else {
        console.log('🔍 [AccountModel] No is_active filter - showing all accounts');
      }

      if (filters?.search) {
        query = query.or(`account_number.ilike.%${filters.search}%,account_name.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data: accounts, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch accounts: ${error.message}`);
      }

      const result = {
        accounts: accounts || [],
        total: count || 0
      };
      
      console.log('📊 [AccountModel] Returning accounts:', result.accounts.length, 'total:', result.total);
      if (result.accounts.length > 0) {
        console.log('📋 [AccountModel] Account statuses:', result.accounts.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          is_active: acc.is_active
        })));
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  // New method to get ALL accounts without filters or pagination
  static async getAllByFoundation(foundationId: string): Promise<{ success: boolean; data: Account[] }> {
    try {
      console.log('🚀 AccountModel.getAllByFoundation - Starting');
      console.log('📊 Foundation ID:', foundationId);
      
      const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('account_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all accounts:', error);
        throw new Error(`Failed to fetch accounts: ${error.message}`);
      }

      console.log('✅ Successfully fetched all accounts:', {
        count: accounts?.length || 0,
        accountNumbers: accounts?.map(acc => acc.account_number) || []
      });

      return {
        success: true,
        data: accounts || []
      };
    } catch (error) {
      console.error('❌ Error in AccountModel.getAllByFoundation:', error);
      throw error;
    }
  }

  // Method to get ALL accounts from all foundations (for admin users)
  static async getAll(): Promise<{ success: boolean; data: Account[] }> {
    try {
      console.log('🚀 AccountModel.getAll - Starting (Admin access)');
      
      const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('account_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all accounts:', error);
        throw new Error(`Failed to fetch accounts: ${error.message}`);
      }

      console.log('✅ Successfully fetched all accounts (Admin):', {
        count: accounts?.length || 0,
        accountNumbers: accounts?.map(acc => acc.account_number) || []
      });

      return {
        success: true,
        data: accounts || []
      };
    } catch (error) {
      console.error('❌ Error in AccountModel.getAll:', error);
      throw error;
    }
  }

  static async update(accountId: string, accountData: UpdateAccountData, userId: string): Promise<Account> {
    try {
      const updateFields = {
        account_number: accountData.account_number,
        account_name: accountData.account_name,
        vat_code: accountData.vat_code,
        sru: accountData.sru,
        atm: accountData.atm,
        opening_balance: accountData.opening_balance,
        budget: accountData.budget,
        is_active: accountData.is_active,
        automatic_accounting: accountData.automatic_accounting,
        suggest_debit_credit: accountData.suggest_debit_credit,
        transaction_info: accountData.transaction_info,
        suggest_transaction_info: accountData.suggest_transaction_info,
        budget_distribution: accountData.budget_distribution,
        updated_by: userId
      };

      // Update the account
      const { data: account, error: accountError } = await supabase
        .from('chart_of_accounts')
        .update(updateFields)
        .eq('id', accountId)
        .select()
        .single();

      if (accountError) {
        throw new Error(`Failed to update account: ${accountError.message}`);
      }

      // If budget rows are provided, update them
      if (accountData.budget_rows) {
        // Delete existing budget rows
        await supabase
          .from('budget_rows')
          .delete()
          .eq('chart_of_account_id', accountId);

        // Insert new budget rows
        if (accountData.budget_rows.length > 0) {
          const budgetRowsData = accountData.budget_rows.map(row => ({
            chart_of_account_id: accountId,
            cost_center: row.cost_center,
            annual_budget: row.annual_budget,
            percentage: row.percentage,
            jan: row.jan,
            feb: row.feb,
            mar: row.mar,
            apr: row.apr,
            may: row.may,
            jun: row.jun,
            jul: row.jul,
            aug: row.aug,
            sep: row.sep,
            oct: row.oct,
            nov: row.nov,
            dec: row.dec,
            christmas: row.christmas
          }));

          const { error: budgetError } = await supabase
            .from('budget_rows')
            .insert(budgetRowsData);

          if (budgetError) {
            console.error('Failed to update budget rows:', budgetError);
            // Don't throw error here, account was updated successfully
          }
        }
      }

      // Fetch the complete account with budget rows
      return await this.getById(accountId);
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  static async delete(accountId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chart_of_accounts')
        .delete()
        .eq('id', accountId);

      if (error) {
        throw new Error(`Failed to delete account: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  static async bulkUpdateStatus(accountIds: string[], isActive: boolean, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chart_of_accounts')
        .update({
          is_active: isActive,
          updated_by: userId
        })
        .in('id', accountIds);

      if (error) {
        throw new Error(`Failed to update account status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating account status:', error);
      throw error;
    }
  }

  static async bulkDelete(accountIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('chart_of_accounts')
        .delete()
        .in('id', accountIds);

      if (error) {
        throw new Error(`Failed to delete accounts: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting accounts:', error);
      throw error;
    }
  }
}
