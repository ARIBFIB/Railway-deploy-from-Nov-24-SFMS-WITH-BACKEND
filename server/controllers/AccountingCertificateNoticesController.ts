import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class AccountingCertificateNoticesController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('accounting_certificate_notices')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          send_notice_to_attestors: false,
          schedule_frequency: 'annually',
          schedule_days: null,
          email_enabled: false,
          email_heading: null,
          email_message: null,
          sms_enabled: false,
          sms_message: null
        }
      });
    } catch (error) {
      console.error('❌ Error fetching accounting certificate notices:', error);
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
        send_notice_to_attestors,
        schedule_frequency,
        schedule_days,
        email_enabled,
        email_heading,
        email_message,
        sms_enabled,
        sms_message
      } = req.body;

      const { data, error } = await supabase
        .from('accounting_certificate_notices')
        .upsert({
          foundation_id: foundationId,
          send_notice_to_attestors: send_notice_to_attestors !== undefined ? send_notice_to_attestors : false,
          schedule_frequency: schedule_frequency || 'annually',
          schedule_days: schedule_days || null,
          email_enabled: email_enabled !== undefined ? email_enabled : false,
          email_heading: email_heading || null,
          email_message: email_message || null,
          sms_enabled: sms_enabled !== undefined ? sms_enabled : false,
          sms_message: sms_message || null,
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
      console.error('❌ Error saving accounting certificate notices:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

