import { supabase } from '../config/database';

export interface FacilityRegisterSettings {
  id?: string;
  foundation_id: string;
  proposed_depreciation_start_date: string;
  create_asset_from_supplier_invoice: boolean;
  enable_component_depreciation_support: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateFacilityRegisterSettingsData {
  proposed_depreciation_start_date?: string;
  create_asset_from_supplier_invoice?: boolean;
  enable_component_depreciation_support?: boolean;
}

export interface UpdateFacilityRegisterSettingsData extends Partial<CreateFacilityRegisterSettingsData> {
  id?: string;
}

export class FacilityRegisterSettingsModel {
  /**
   * Get facility register settings for a foundation
   * Creates default settings if none exist
   */
  static async getByFoundation(foundationId: string): Promise<FacilityRegisterSettings> {
    try {
      const { data, error } = await supabase
        .from('facility_register_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error) {
        // If no settings exist, return default settings
        if (error.code === 'PGRST116') {
          return {
            foundation_id: foundationId,
            proposed_depreciation_start_date: 'Acquisition month',
            create_asset_from_supplier_invoice: false,
            enable_component_depreciation_support: false
          };
        }
        throw new Error(`Failed to fetch facility register settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching facility register settings:', error);
      throw error;
    }
  }

  /**
   * Create or update facility register settings for a foundation
   * Uses RPC function to bypass RLS issues
   */
  static async upsert(
    foundationId: string,
    settingsData: CreateFacilityRegisterSettingsData,
    userId: string
  ): Promise<FacilityRegisterSettings> {
    try {
      // Check if settings already exist to get defaults
      const existing = await this.getByFoundation(foundationId);

      // Prepare data with defaults
      const proposedDepreciationStartDate = settingsData.proposed_depreciation_start_date ?? existing.proposed_depreciation_start_date ?? 'Acquisition month';
      const createAssetFromSupplierInvoice = settingsData.create_asset_from_supplier_invoice ?? existing.create_asset_from_supplier_invoice ?? false;
      const enableComponentDepreciationSupport = settingsData.enable_component_depreciation_support ?? existing.enable_component_depreciation_support ?? false;

      // Use RPC function to bypass RLS
      const { data, error } = await supabase.rpc('upsert_facility_register_settings', {
        p_foundation_id: foundationId,
        p_proposed_depreciation_start_date: proposedDepreciationStartDate,
        p_create_asset_from_supplier_invoice: createAssetFromSupplierInvoice,
        p_enable_component_depreciation_support: enableComponentDepreciationSupport,
        p_user_id: userId
      });

      if (error) {
        // Fallback to direct insert/update if RPC fails
        console.warn('RPC function failed, trying direct insert/update:', error.message);
        
        if (existing.id) {
          // Update existing settings
          const { data: updateData, error: updateError } = await supabase
            .from('facility_register_settings')
            .update({
              proposed_depreciation_start_date: proposedDepreciationStartDate,
              create_asset_from_supplier_invoice: createAssetFromSupplierInvoice,
              enable_component_depreciation_support: enableComponentDepreciationSupport,
              updated_by: userId
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (updateError) {
            throw new Error(`Failed to update facility register settings: ${updateError.message}`);
          }

          return updateData;
        } else {
          // Create new settings
          const { data: insertData, error: insertError } = await supabase
            .from('facility_register_settings')
            .insert({
              foundation_id: foundationId,
              proposed_depreciation_start_date: proposedDepreciationStartDate,
              create_asset_from_supplier_invoice: createAssetFromSupplierInvoice,
              enable_component_depreciation_support: enableComponentDepreciationSupport,
              created_by: userId,
              updated_by: userId
            })
            .select()
            .single();

          if (insertError) {
            throw new Error(`Failed to create facility register settings: ${insertError.message}`);
          }

          return insertData;
        }
      }

      // RPC returns an array, get first element
      if (data && data.length > 0) {
        return data[0];
      }

      throw new Error('RPC function returned no data');
    } catch (error) {
      console.error('Error upserting facility register settings:', error);
      throw error;
    }
  }

  /**
   * Update facility register settings
   */
  static async update(
    foundationId: string,
    settingsData: UpdateFacilityRegisterSettingsData,
    userId: string
  ): Promise<FacilityRegisterSettings> {
    try {
      const existing = await this.getByFoundation(foundationId);

      if (!existing.id) {
        // If no settings exist, create them
        return await this.upsert(foundationId, settingsData, userId);
      }

      const updateData: Partial<FacilityRegisterSettings> = {
        updated_by: userId
      };

      if (settingsData.proposed_depreciation_start_date !== undefined) {
        updateData.proposed_depreciation_start_date = settingsData.proposed_depreciation_start_date;
      }
      if (settingsData.create_asset_from_supplier_invoice !== undefined) {
        updateData.create_asset_from_supplier_invoice = settingsData.create_asset_from_supplier_invoice;
      }
      if (settingsData.enable_component_depreciation_support !== undefined) {
        updateData.enable_component_depreciation_support = settingsData.enable_component_depreciation_support;
      }

      const { data, error } = await supabase
        .from('facility_register_settings')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update facility register settings: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating facility register settings:', error);
      throw error;
    }
  }

  /**
   * Delete facility register settings
   */
  static async delete(foundationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('facility_register_settings')
        .delete()
        .eq('foundation_id', foundationId);

      if (error) {
        throw new Error(`Failed to delete facility register settings: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting facility register settings:', error);
      throw error;
    }
  }
}

