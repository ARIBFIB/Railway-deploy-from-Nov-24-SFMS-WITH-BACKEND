import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class FinancialYearSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data: settings, error: settingsError } = await supabase
        .from('financial_year_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      const { data: years, error: yearsError } = await supabase
        .from('financial_years')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('from_date', { ascending: false });

      if (yearsError) throw yearsError;

      res.status(200).json({
        success: true,
        data: {
          settings: settings || {
            create_fiscal_years_automatically: false
          },
          years: years || [],
          fiscal_years: years || []
        }
      });
    } catch (error) {
      console.error('❌ Error fetching financial year settings:', error);
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
      const { create_fiscal_years_automatically, fiscal_years } = req.body;

      // Update settings
      const { data, error } = await supabase
        .from('financial_year_settings')
        .upsert({
          foundation_id: foundationId,
          create_fiscal_years_automatically: create_fiscal_years_automatically !== undefined ? create_fiscal_years_automatically : false,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      // Handle fiscal_years if provided
      if (fiscal_years && Array.isArray(fiscal_years)) {
        // Get existing years to determine which to delete
        const { data: existingYears } = await supabase
          .from('financial_years')
          .select('id')
          .eq('foundation_id', foundationId);

        const existingIds = (existingYears || []).map(y => y.id);
        const newIds = fiscal_years
          .map((y: any) => y.id)
          .filter((id: string) => id && typeof id === 'string' && id.length > 0);

        // Delete years that are not in the new list (only if they have UUID format)
        const idsToDelete = existingIds.filter(id => {
          // Only delete if it's a UUID (not a temporary frontend ID)
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
          return isUUID && !newIds.includes(id);
        });
        
        if (idsToDelete.length > 0) {
          await supabase
            .from('financial_years')
            .delete()
            .in('id', idsToDelete);
        }

        // Update or insert years
        for (const year of fiscal_years) {
          const yearData: any = {
            foundation_id: foundationId,
            from_date: year.fromDate || year.from_date,
            to_date: year.toDate || year.to_date,
            accounting_method: year.accountingMethod || year.accounting_method || null,
            account_chart: year.accountChart || year.account_chart || null,
            is_preselected: year.isPreselected !== undefined ? year.isPreselected : (year.is_preselected !== undefined ? year.is_preselected : false),
            open_at_login: year.openAtLogin !== undefined ? year.openAtLogin : (year.open_at_login !== undefined ? year.open_at_login : false),
            updated_by: userId,
            updated_at: new Date().toISOString()
          };

          // Check if ID is a UUID (existing DB record) or temporary frontend ID
          const isUUID = year.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(year.id);
          
          if (isUUID && existingIds.includes(year.id)) {
            // Update existing year
            await supabase
              .from('financial_years')
              .update(yearData)
              .eq('id', year.id)
              .eq('foundation_id', foundationId);
          } else {
            // Insert new year
            yearData.created_by = userId;
            const { data: newYear } = await supabase
              .from('financial_years')
              .insert(yearData)
              .select()
              .single();
            
            // Update the year ID in the response if needed
            if (newYear) {
              year.id = newYear.id;
            }
          }
        }
      }

      // Fetch updated years
      const { data: years } = await supabase
        .from('financial_years')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('from_date', { ascending: false });

      res.status(200).json({
        success: true,
        data: {
          settings: data,
          years: years || [],
          fiscal_years: years || []
        },
        message: 'Financial year settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving financial year settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static getYears = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('financial_years')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('from_date', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('❌ Error fetching financial years:', error);
      res.status(500).json(createError(`Failed to fetch financial years: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static createYear = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const { from_date, to_date, accounting_method, account_chart, is_preselected, open_at_login } = req.body;

      // Validate dates - check for empty strings, null, or undefined
      if (!from_date || from_date.trim() === '' || !to_date || to_date.trim() === '') {
        res.status(400).json(createError('From date and To date are required'));
        return;
      }

      const { data, error } = await supabase
        .from('financial_years')
        .insert({
          foundation_id: foundationId,
          from_date,
          to_date,
          accounting_method: accounting_method || null,
          account_chart: account_chart || null,
          is_preselected: is_preselected !== undefined ? is_preselected : false,
          open_at_login: open_at_login !== undefined ? open_at_login : false,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data,
        message: 'Financial year created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating financial year:', error);
      res.status(500).json(createError(`Failed to create financial year: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static updateYear = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const { id } = req.params;

    if (!foundationId || !userId || !id) {
      res.status(400).json(createError('Foundation ID, User ID, and Year ID are required'));
      return;
    }

    try {
      const { from_date, to_date, accounting_method, account_chart, is_preselected, open_at_login } = req.body;

      const { data, error } = await supabase
        .from('financial_years')
        .update({
          from_date,
          to_date,
          accounting_method: accounting_method || null,
          account_chart: account_chart || null,
          is_preselected: is_preselected !== undefined ? is_preselected : false,
          open_at_login: open_at_login !== undefined ? open_at_login : false,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('foundation_id', foundationId)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Financial year updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating financial year:', error);
      res.status(500).json(createError(`Failed to update financial year: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static deleteYear = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { id } = req.params;

    if (!foundationId || !id) {
      res.status(400).json(createError('Foundation ID and Year ID are required'));
      return;
    }

    try {
      const { error } = await supabase
        .from('financial_years')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundationId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Financial year deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting financial year:', error);
      res.status(500).json(createError(`Failed to delete financial year: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static togglePreselected = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const { id } = req.params;

    if (!foundationId || !userId || !id) {
      res.status(400).json(createError('Foundation ID, User ID, and Year ID are required'));
      return;
    }

    try {
      // Get current state
      const { data: year, error: fetchError } = await supabase
        .from('financial_years')
        .select('is_preselected')
        .eq('id', id)
        .eq('foundation_id', foundationId)
        .single();

      if (fetchError || !year) {
        res.status(404).json(createError('Financial year not found'));
        return;
      }

      // Toggle preselected status
      const { data, error } = await supabase
        .from('financial_years')
        .update({
          is_preselected: !year.is_preselected,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('foundation_id', foundationId)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Financial year preselected status updated successfully'
      });
    } catch (error) {
      console.error('❌ Error toggling financial year preselected:', error);
      res.status(500).json(createError(`Failed to toggle preselected: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

