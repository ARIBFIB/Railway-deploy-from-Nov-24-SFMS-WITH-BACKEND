import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class TransactionAccountController {
  // Get all transaction accounts for a foundation
  static async getTransactionAccounts(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: accounts, error } = await supabase
        .from('transaction_accounts')
        .select('*')
        .eq('foundation_id', foundation_id)
        .order('name');

      if (error) {
        throw createError('Failed to fetch transaction accounts', 500);
      }

      res.json({
        success: true,
        data: accounts
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get transaction account by ID
  static async getTransactionAccountById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: account, error } = await supabase
        .from('transaction_accounts')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (error) {
        throw createError('Transaction account not found', 404);
      }

      res.json({
        success: true,
        data: account
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new transaction account
  static async createTransactionAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const {
        name,
        account_with,
        bank,
        bank_for_international_payments,
        bank_transfer,
        bankgirot_customer_number,
        clearing_number,
        account_number,
        iban,
        bic,
        swish_number,
        accounting_account
      } = req.body;

      const { data: account, error } = await supabase
        .from('transaction_accounts')
        .insert({
          foundation_id,
          name,
          account_with,
          bank,
          bank_for_international_payments,
          bank_transfer,
          bankgirot_customer_number,
          clearing_number,
          account_number,
          iban,
          bic,
          swish_number,
          accounting_account,
          created_by: user_id
        })
        .select()
        .single();

      if (error) {
        throw createError('Failed to create transaction account', 500);
      }

      res.status(201).json({
        success: true,
        data: account,
        message: 'Transaction account created successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update transaction account
  static async updateTransactionAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const updateData = { ...req.body, updated_by: user_id };

      const { data: account, error } = await supabase
        .from('transaction_accounts')
        .update(updateData)
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .select()
        .single();

      if (error) {
        throw createError('Failed to update transaction account', 500);
      }

      res.json({
        success: true,
        data: account,
        message: 'Transaction account updated successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete transaction account
  static async deleteTransactionAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { error } = await supabase
        .from('transaction_accounts')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (error) {
        throw createError('Failed to delete transaction account', 500);
      }

      res.json({
        success: true,
        message: 'Transaction account deleted successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update default account configuration
  static async updateDefaultAccountConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const {
        default_main_account,
        default_account_customer_invoice,
        preselected_salary_account,
        preselected_account_direct_debit,
        linked_to_payment_account
      } = req.body;

      // Update or create default account configuration
      const { data: config, error } = await supabase
        .from('default_account_configs')
        .upsert({
          foundation_id,
          default_main_account,
          default_account_customer_invoice,
          preselected_salary_account,
          preselected_account_direct_debit,
          linked_to_payment_account,
          updated_by: user_id
        })
        .select()
        .single();

      if (error) {
        throw createError('Failed to update default account configuration', 500);
      }

      res.json({
        success: true,
        data: config,
        message: 'Default account configuration updated successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get default account configuration
  static async getDefaultAccountConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: config, error } = await supabase
        .from('default_account_configs')
        .select('*')
        .eq('foundation_id', foundation_id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw createError('Failed to fetch default account configuration', 500);
      }

      res.json({
        success: true,
        data: config || {
          default_main_account: '',
          default_account_customer_invoice: '',
          preselected_salary_account: '',
          preselected_account_direct_debit: '',
          linked_to_payment_account: ''
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Test bank connection
  static async testBankConnection(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: account, error: accountError } = await supabase
        .from('transaction_accounts')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (accountError) {
        throw createError('Transaction account not found', 404);
      }

      // Here you would implement actual bank connection testing
      // For now, we'll simulate a successful connection
      const connectionTest = {
        account_id: id,
        status: 'connected',
        last_tested: new Date().toISOString(),
        balance: 0, // This would come from actual bank API
        currency: 'SEK'
      };

      res.json({
        success: true,
        data: connectionTest,
        message: 'Bank connection test completed'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get account transactions
  static async getAccountTransactions(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { page = 1, limit = 50, from_date, to_date } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      let query = supabase
        .from('bank_transactions')
        .select('*')
        .eq('transaction_account_id', id)
        .eq('foundation_id', foundation_id);

      // Apply date filters
      if (from_date) {
        query = query.gte('transaction_date', from_date);
      }
      if (to_date) {
        query = query.lte('transaction_date', to_date);
      }

      // Apply pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1).order('transaction_date', { ascending: false });

      const { data: transactions, error } = await query;

      if (error) {
        throw createError('Failed to fetch account transactions', 500);
      }

      // Get total count for pagination
      const { count } = await supabase
        .from('bank_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('transaction_account_id', id)
        .eq('foundation_id', foundation_id);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
