import { supabase } from '../config/database';
import type { SettingsScope } from '../types';

export interface BasicAccount {
  id?: string;
  account: string;
  name?: string;
}

export interface Formula {
  id?: string;
  formula?: string;
  account?: string;
  name?: string;
}

export interface AutomaticPostingLine {
  id?: string;
  account?: string;
  name?: string;
  debit?: string;
  credit?: string;
}

export interface AutomaticAccounting {
  id?: string;
  foundation_id: string;
  scope: SettingsScope;
  number: string;
  name: string;
  account?: string;
  any_amount?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  basic_accounts?: BasicAccount[];
  formulas?: Formula[];
  transactions?: AutomaticPostingLine[];
}

export interface CreateAutomaticAccountingData {
  number: string;
  name: string;
  account?: string;
  any_amount?: string;
  basic_accounts?: Omit<BasicAccount, 'id'>[];
  formulas?: Omit<Formula, 'id'>[];
  transactions?: Omit<AutomaticPostingLine, 'id'>[];
}

export interface UpdateAutomaticAccountingData extends Partial<CreateAutomaticAccountingData> {
  id?: string;
}

export class AutomaticAccountingModel {
  /**
   * Get all automatic accounting entries for a foundation
   */
  static async getByFoundation(foundationId: string, scope: SettingsScope = 'accounting'): Promise<AutomaticAccounting[]> {
    try {
      const { data, error } = await supabase
        .from('automatic_accounting')
        .select(`
          *,
          basic_accounts:automatic_accounting_basic_accounts(*),
          formulas:automatic_accounting_formulas(*),
          transactions:automatic_accounting_transactions(*)
        `)
        .eq('foundation_id', foundationId)
        .eq('scope', scope)
        .order('number', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch automatic accounting entries: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching automatic accounting entries:', error);
      throw error;
    }
  }

  /**
   * Get a specific automatic accounting entry by ID
   */
  static async getById(id: string, scope?: SettingsScope): Promise<AutomaticAccounting> {
    try {
      let query = supabase
        .from('automatic_accounting')
        .select(`
          *,
          basic_accounts:automatic_accounting_basic_accounts(*),
          formulas:automatic_accounting_formulas(*),
          transactions:automatic_accounting_transactions(*)
        `)
        .eq('id', id);

      if (scope) {
        query = query.eq('scope', scope);
      }

      const { data, error } = await query.single();

      if (error) {
        throw new Error(`Failed to fetch automatic accounting entry: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching automatic accounting entry:', error);
      throw error;
    }
  }

  /**
   * Create a new automatic accounting entry
   */
  static async create(
    foundationId: string,
    scope: SettingsScope,
    entryData: CreateAutomaticAccountingData,
    userId: string
  ): Promise<AutomaticAccounting> {
    try {
      // Create the main entry
      const { data: entry, error: entryError } = await supabase
        .from('automatic_accounting')
        .insert({
          foundation_id: foundationId,
          scope,
          number: entryData.number,
          name: entryData.name,
          account: entryData.account,
          any_amount: entryData.any_amount,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (entryError) {
        throw new Error(`Failed to create automatic accounting entry: ${entryError.message}`);
      }

      // Create basic accounts if provided
      if (entryData.basic_accounts && entryData.basic_accounts.length > 0) {
        const basicAccountsData = entryData.basic_accounts.map(acc => ({
          automatic_accounting_id: entry.id,
          account: acc.account,
          name: acc.name
        }));

        const { error: basicAccountsError } = await supabase
          .from('automatic_accounting_basic_accounts')
          .insert(basicAccountsData);

        if (basicAccountsError) {
          console.error('Failed to create basic accounts:', basicAccountsError);
        }
      }

      // Create formulas if provided
      if (entryData.formulas && entryData.formulas.length > 0) {
        const formulasData = entryData.formulas.map(formula => ({
          automatic_accounting_id: entry.id,
          formula: formula.formula,
          account: formula.account,
          name: formula.name
        }));

        const { error: formulasError } = await supabase
          .from('automatic_accounting_formulas')
          .insert(formulasData);

        if (formulasError) {
          console.error('Failed to create formulas:', formulasError);
        }
      }

      // Create transactions if provided
      if (entryData.transactions && entryData.transactions.length > 0) {
        const transactionsData = entryData.transactions.map(transaction => ({
          automatic_accounting_id: entry.id,
          account: transaction.account,
          name: transaction.name,
          debit: transaction.debit,
          credit: transaction.credit
        }));

        const { error: transactionsError } = await supabase
          .from('automatic_accounting_transactions')
          .insert(transactionsData);

        if (transactionsError) {
          console.error('Failed to create transactions:', transactionsError);
        }
      }

      // Fetch the complete entry with all related data
      return await this.getById(entry.id!, scope);
    } catch (error) {
      console.error('Error creating automatic accounting entry:', error);
      throw error;
    }
  }

  /**
   * Update an automatic accounting entry
   */
  static async update(
    id: string,
    scope: SettingsScope,
    entryData: UpdateAutomaticAccountingData,
    userId: string
  ): Promise<AutomaticAccounting> {
    try {
      // Update the main entry
      const updateFields: Partial<AutomaticAccounting> = {
        updated_by: userId
      };

      if (entryData.number !== undefined) updateFields.number = entryData.number;
      if (entryData.name !== undefined) updateFields.name = entryData.name;
      if (entryData.account !== undefined) updateFields.account = entryData.account;
      if (entryData.any_amount !== undefined) updateFields.any_amount = entryData.any_amount;

      const { error: updateError } = await supabase
        .from('automatic_accounting')
        .update(updateFields)
        .eq('id', id)
        .eq('scope', scope);

      if (updateError) {
        throw new Error(`Failed to update automatic accounting entry: ${updateError.message}`);
      }

      // Delete existing related data
      await supabase.from('automatic_accounting_basic_accounts').delete().eq('automatic_accounting_id', id);
      await supabase.from('automatic_accounting_formulas').delete().eq('automatic_accounting_id', id);
      await supabase.from('automatic_accounting_transactions').delete().eq('automatic_accounting_id', id);

      // Insert new related data
      if (entryData.basic_accounts && entryData.basic_accounts.length > 0) {
        const basicAccountsData = entryData.basic_accounts.map(acc => ({
          automatic_accounting_id: id,
          account: acc.account,
          name: acc.name
        }));

        await supabase.from('automatic_accounting_basic_accounts').insert(basicAccountsData);
      }

      if (entryData.formulas && entryData.formulas.length > 0) {
        const formulasData = entryData.formulas.map(formula => ({
          automatic_accounting_id: id,
          formula: formula.formula,
          account: formula.account,
          name: formula.name
        }));

        await supabase.from('automatic_accounting_formulas').insert(formulasData);
      }

      if (entryData.transactions && entryData.transactions.length > 0) {
        const transactionsData = entryData.transactions.map(transaction => ({
          automatic_accounting_id: id,
          account: transaction.account,
          name: transaction.name,
          debit: transaction.debit,
          credit: transaction.credit
        }));

        await supabase.from('automatic_accounting_transactions').insert(transactionsData);
      }

      // Fetch the complete entry with all related data
      return await this.getById(id, scope);
    } catch (error) {
      console.error('Error updating automatic accounting entry:', error);
      throw error;
    }
  }

  /**
   * Delete an automatic accounting entry
   */
  static async delete(id: string, scope: SettingsScope): Promise<void> {
    try {
      // Related data will be deleted via CASCADE
      const { error } = await supabase
        .from('automatic_accounting')
        .delete()
        .eq('id', id)
        .eq('scope', scope);

      if (error) {
        throw new Error(`Failed to delete automatic accounting entry: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting automatic accounting entry:', error);
      throw error;
    }
  }
}

