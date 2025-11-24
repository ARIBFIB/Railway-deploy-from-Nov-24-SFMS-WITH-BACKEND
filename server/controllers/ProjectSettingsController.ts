import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class ProjectSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          enable_support_for_project_accounting: false,
          include_projects_on_tab_enter_input: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching project settings:', error);
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
        enable_support_for_project_accounting,
        include_projects_on_tab_enter_input,
        enable_project_support,
        include_project_when_tab_entering
      } = req.body;

      // Map frontend field names to backend field names
      const enableSupport = enable_support_for_project_accounting !== undefined 
        ? enable_support_for_project_accounting 
        : (enable_project_support !== undefined ? enable_project_support : false);
      
      const includeOnTabEnter = include_projects_on_tab_enter_input !== undefined 
        ? include_projects_on_tab_enter_input 
        : (include_project_when_tab_entering !== undefined ? include_project_when_tab_entering : false);

      const { data, error } = await supabase
        .from('project_settings')
        .upsert({
          foundation_id: foundationId,
          enable_support_for_project_accounting: enableSupport,
          include_projects_on_tab_enter_input: includeOnTabEnter,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Project settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving project settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

