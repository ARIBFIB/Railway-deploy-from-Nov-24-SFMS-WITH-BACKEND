import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class QuantityAccountingSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quantity_accounting_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          enable_support_for_quantity_accounting: false,
          include_quantity_when_tab_entering: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching quantity accounting settings:', error);
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
      const { enable_support_for_quantity_accounting, include_quantity_when_tab_entering } = req.body;

      const { data, error } = await supabase
        .from('quantity_accounting_settings')
        .upsert({
          foundation_id: foundationId,
          enable_support_for_quantity_accounting: enable_support_for_quantity_accounting !== undefined ? enable_support_for_quantity_accounting : false,
          include_quantity_when_tab_entering: include_quantity_when_tab_entering !== undefined ? include_quantity_when_tab_entering : false,
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
      console.error('❌ Error saving quantity accounting settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

