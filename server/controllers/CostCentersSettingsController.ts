import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class CostCentersSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cost_centers_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          enable_cost_center_support: false,
          include_cost_center_when_tab_entering: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching cost centers settings:', error);
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
      const { enable_cost_center_support, include_cost_center_when_tab_entering } = req.body;

      const { data, error } = await supabase
        .from('cost_centers_settings')
        .upsert({
          foundation_id: foundationId,
          enable_cost_center_support: enable_cost_center_support !== undefined ? enable_cost_center_support : false,
          include_cost_center_when_tab_entering: include_cost_center_when_tab_entering !== undefined ? include_cost_center_when_tab_entering : false,
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
      console.error('❌ Error saving cost centers settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

