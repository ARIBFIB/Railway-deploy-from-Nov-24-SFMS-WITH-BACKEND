import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class VATSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data: settings, error: settingsError } = await supabase
        .from('vat_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      const { data: entries, error: entriesError } = await supabase
        .from('vat_entries')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('vat_code', { ascending: true });

      if (entriesError) throw entriesError;

      res.status(200).json({
        success: true,
        data: {
          settings: settings || {
            vat_type: null,
            about: null,
            propose_vat_on_supplier_invoices: null,
            incoming_invoices_action: null
          },
          entries: entries || [],
          output_vat_entries: entries || []
        }
      });
    } catch (error) {
      console.error('❌ Error fetching VAT settings:', error);
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
      const { vat_type, about, propose_vat_on_supplier_invoices, incoming_invoices_action, output_vat_entries } = req.body;

      // Update settings
      const { data, error } = await supabase
        .from('vat_settings')
        .upsert({
          foundation_id: foundationId,
          vat_type: vat_type || null,
          about: about || null,
          propose_vat_on_supplier_invoices: propose_vat_on_supplier_invoices || null,
          incoming_invoices_action: incoming_invoices_action || null,
          updated_by: userId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      // Handle output_vat_entries if provided
      if (output_vat_entries && Array.isArray(output_vat_entries)) {
        // Delete existing entries for this foundation
        await supabase
          .from('vat_entries')
          .delete()
          .eq('foundation_id', foundationId);

        // Insert new entries
        if (output_vat_entries.length > 0) {
          const entriesToInsert = output_vat_entries.map((entry: any) => ({
            foundation_id: foundationId,
            vat_code: entry.vatCode || entry.vat_code || '',
            description: entry.description || null,
            vat_rate: entry.vatRate || entry.vat_rate || null,
            valid_from: entry.validFrom || entry.valid_from || null,
            valid_to: entry.validTo || entry.valid_to || null,
            is_deletable: entry.isDeletable !== undefined ? entry.isDeletable : (entry.is_deletable !== undefined ? entry.is_deletable : true),
            created_by: userId,
            updated_by: userId
          }));

          const { error: entriesError } = await supabase
            .from('vat_entries')
            .insert(entriesToInsert);

          if (entriesError) throw entriesError;
        }
      }

      // Fetch updated entries
      const { data: entries } = await supabase
        .from('vat_entries')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('vat_code', { ascending: true });

      res.status(200).json({
        success: true,
        data: {
          settings: data,
          output_vat_entries: entries || []
        },
        message: 'VAT settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving VAT settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static getEntries = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vat_entries')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('vat_code', { ascending: true });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('❌ Error fetching VAT entries:', error);
      res.status(500).json(createError(`Failed to fetch VAT entries: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static createEntry = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const { vat_code, description, vat_rate, valid_from, valid_to } = req.body;

      if (!vat_code) {
        res.status(400).json(createError('VAT code is required'));
        return;
      }

      const { data, error } = await supabase
        .from('vat_entries')
        .insert({
          foundation_id: foundationId,
          vat_code,
          description: description || null,
          vat_rate: vat_rate || null,
          valid_from: valid_from || null,
          valid_to: valid_to || null,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data,
        message: 'VAT entry created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating VAT entry:', error);
      res.status(500).json(createError(`Failed to create VAT entry: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static updateEntry = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const { id } = req.params;

    if (!foundationId || !userId || !id) {
      res.status(400).json(createError('Foundation ID, User ID, and Entry ID are required'));
      return;
    }

    try {
      const { vat_code, description, vat_rate, valid_from, valid_to } = req.body;

      const { data, error } = await supabase
        .from('vat_entries')
        .update({
          vat_code,
          description: description || null,
          vat_rate: vat_rate || null,
          valid_from: valid_from || null,
          valid_to: valid_to || null,
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
        message: 'VAT entry updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating VAT entry:', error);
      res.status(500).json(createError(`Failed to update VAT entry: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static deleteEntry = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { id } = req.params;

    if (!foundationId || !id) {
      res.status(400).json(createError('Foundation ID and Entry ID are required'));
      return;
    }

    try {
      const { error } = await supabase
        .from('vat_entries')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundationId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'VAT entry deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting VAT entry:', error);
      res.status(500).json(createError(`Failed to delete VAT entry: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

