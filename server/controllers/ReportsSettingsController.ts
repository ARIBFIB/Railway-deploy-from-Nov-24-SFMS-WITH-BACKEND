import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class ReportsSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reports_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          leave_report_selection_window_open_after_printing: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching reports settings:', error);
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
      // Handle both field name formats (frontend sends camelCase, backend uses snake_case)
      const { 
        leave_report_selection_window_open_after_printing,
        enable_reports_support,
        include_reports_when_tab_entering
      } = req.body;

      // Map frontend field names to backend field names
      const leaveWindowOpen = leave_report_selection_window_open_after_printing !== undefined 
        ? leave_report_selection_window_open_after_printing 
        : (enable_reports_support !== undefined ? enable_reports_support : false);

      const { data, error } = await supabase
        .from('reports_settings')
        .upsert({
          foundation_id: foundationId,
          leave_report_selection_window_open_after_printing: leaveWindowOpen,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Reports settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving reports settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

