import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class AccountingViewSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('accounting_view_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          enable_transaction_info: false,
          include_transaction_info_when_tab_entering: false,
          show_account_balance_column_in_posting_view: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching accounting view settings:', error);
      res.status(500).json(createError(`Failed to fetch settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static upsertSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const {
        enable_transaction_info,
        include_transaction_info_when_tab_entering,
        show_account_balance_column_in_posting_view
      } = req.body;

      const { data, error } = await supabase
        .from('accounting_view_settings')
        .upsert({
          foundation_id: foundationId,
          enable_transaction_info: enable_transaction_info !== undefined ? enable_transaction_info : false,
          include_transaction_info_when_tab_entering: include_transaction_info_when_tab_entering !== undefined ? include_transaction_info_when_tab_entering : false,
          show_account_balance_column_in_posting_view: show_account_balance_column_in_posting_view !== undefined ? show_account_balance_column_in_posting_view : false,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving accounting view settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

