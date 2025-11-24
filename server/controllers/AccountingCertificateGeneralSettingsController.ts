import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class AccountingCertificateGeneralSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('accounting_certificate_general_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          fiscal_year_start: null,
          fiscal_year_end: null,
          accounting_certificate_enabled: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching accounting certificate general settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
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
      const { fiscal_year_start, fiscal_year_end, accounting_certificate_enabled } = req.body;

      const { data, error } = await supabase
        .from('accounting_certificate_general_settings')
        .upsert({
          foundation_id: foundationId,
          fiscal_year_start: fiscal_year_start || null,
          fiscal_year_end: fiscal_year_end || null,
          accounting_certificate_enabled: accounting_certificate_enabled !== undefined ? accounting_certificate_enabled : false,
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
      console.error('❌ Error saving accounting certificate general settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

