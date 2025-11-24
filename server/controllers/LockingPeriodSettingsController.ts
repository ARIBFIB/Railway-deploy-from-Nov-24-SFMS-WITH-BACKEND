import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class LockingPeriodSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      // Get settings
      const { data: settings, error: settingsError } = await supabase
        .from('locking_period_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      // Get manual period locking entries
      const { data: manualLocking, error: manualError } = await supabase
        .from('manual_period_locking')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true });

      if (manualError) throw manualError;

      // Convert to frontend format
      const manualPeriodLocking = (manualLocking || []).map(entry => ({
        id: entry.id,
        user: entry.user_name,
        lockedPeriod: entry.locked_period || '',
        type: entry.type as 'individual' | 'system' | 'integration' | 'all'
      }));

      res.status(200).json({
        success: true,
        data: {
          automaticPeriodLocking: settings?.automatic_period_locking || false,
          manualPeriodLocking: manualPeriodLocking.length > 0 
            ? manualPeriodLocking 
            : [
                { id: '1', user: 'Yellow Ali', lockedPeriod: '', type: 'individual' as const },
                { id: '2', user: 'test test', lockedPeriod: '', type: 'individual' as const },
                { id: '3', user: 'Internal system user', lockedPeriod: '', type: 'system' as const },
                { id: '4', user: 'Externally via integration', lockedPeriod: '', type: 'integration' as const },
                { id: '5', user: 'All users', lockedPeriod: '', type: 'all' as const }
              ]
        }
      });
    } catch (error) {
      console.error('❌ Error fetching locking period settings:', error);
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
      const { automaticPeriodLocking, manualPeriodLocking } = req.body;

      // Upsert settings
      const { data: settings, error: settingsError } = await supabase
        .from('locking_period_settings')
        .upsert({
          foundation_id: foundationId,
          automatic_period_locking: automaticPeriodLocking !== undefined ? automaticPeriodLocking : false,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (settingsError) throw settingsError;

      // Handle manual period locking entries
      if (manualPeriodLocking && Array.isArray(manualPeriodLocking)) {
        // Delete existing entries
        await supabase
          .from('manual_period_locking')
          .delete()
          .eq('foundation_id', foundationId);

        // Insert new entries
        const entriesToInsert = manualPeriodLocking.map((entry: any) => ({
          foundation_id: foundationId,
          user_name: entry.user || '',
          locked_period: entry.lockedPeriod || null,
          type: entry.type || 'individual',
          created_by: userId,
          updated_by: userId
        }));

        if (entriesToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('manual_period_locking')
            .insert(entriesToInsert);

          if (insertError) throw insertError;
        }
      }

      // Fetch updated manual locking entries
      const { data: manualLocking } = await supabase
        .from('manual_period_locking')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true });

      const manualPeriodLockingFormatted = (manualLocking || []).map(entry => ({
        id: entry.id,
        user: entry.user_name,
        lockedPeriod: entry.locked_period || '',
        type: entry.type as 'individual' | 'system' | 'integration' | 'all'
      }));

      res.status(200).json({
        success: true,
        data: {
          automaticPeriodLocking: settings.automatic_period_locking,
          manualPeriodLocking: manualPeriodLockingFormatted
        },
        message: 'Settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving locking period settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}




























