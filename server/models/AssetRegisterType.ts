import { supabase } from '../config/database';

export interface AssetRegisterType {
  id?: string;
  foundation_id: string;
  number: string;
  description: string;
  depreciation_type: string;
  note?: string;
  asset_account?: string;
  depreciation_account?: string;
  revaluation_account?: string;
  impairment_account?: string;
  offsetting_account_for_sales?: string;
  accumulated_depreciation?: string;
  accumulated_impairment_losses?: string;
  capital_gain_on_sale?: string;
  capital_loss_sale?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateAssetRegisterTypeData {
  number: string;
  description: string;
  depreciation_type: string;
  note?: string;
  asset_account?: string;
  depreciation_account?: string;
  revaluation_account?: string;
  impairment_account?: string;
  offsetting_account_for_sales?: string;
  accumulated_depreciation?: string;
  accumulated_impairment_losses?: string;
  capital_gain_on_sale?: string;
  capital_loss_sale?: string;
}

export interface UpdateAssetRegisterTypeData extends Partial<CreateAssetRegisterTypeData> {
  id?: string;
}

export class AssetRegisterTypeModel {
  /**
   * Get all asset register types for a foundation
   */
  static async getByFoundation(foundationId: string): Promise<AssetRegisterType[]> {
    try {
      const { data, error } = await supabase
        .from('asset_register_types')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('number', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch asset register types: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching asset register types:', error);
      throw error;
    }
  }

  /**
   * Get a specific asset register type by ID
   */
  static async getById(id: string): Promise<AssetRegisterType> {
    try {
      const { data, error } = await supabase
        .from('asset_register_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch asset register type: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching asset register type:', error);
      throw error;
    }
  }

  /**
   * Create a new asset register type
   */
  static async create(
    foundationId: string,
    typeData: CreateAssetRegisterTypeData,
    userId: string
  ): Promise<AssetRegisterType> {
    try {
      const { data, error } = await supabase
        .from('asset_register_types')
        .insert({
          foundation_id: foundationId,
          number: typeData.number,
          description: typeData.description,
          depreciation_type: typeData.depreciation_type,
          note: typeData.note,
          asset_account: typeData.asset_account,
          depreciation_account: typeData.depreciation_account,
          revaluation_account: typeData.revaluation_account,
          impairment_account: typeData.impairment_account,
          offsetting_account_for_sales: typeData.offsetting_account_for_sales,
          accumulated_depreciation: typeData.accumulated_depreciation,
          accumulated_impairment_losses: typeData.accumulated_impairment_losses,
          capital_gain_on_sale: typeData.capital_gain_on_sale,
          capital_loss_sale: typeData.capital_loss_sale,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create asset register type: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating asset register type:', error);
      throw error;
    }
  }

  /**
   * Update an asset register type
   */
  static async update(
    id: string,
    typeData: UpdateAssetRegisterTypeData,
    userId: string
  ): Promise<AssetRegisterType> {
    try {
      const updateFields: Partial<AssetRegisterType> = {
        updated_by: userId
      };

      if (typeData.number !== undefined) updateFields.number = typeData.number;
      if (typeData.description !== undefined) updateFields.description = typeData.description;
      if (typeData.depreciation_type !== undefined) updateFields.depreciation_type = typeData.depreciation_type;
      if (typeData.note !== undefined) updateFields.note = typeData.note;
      if (typeData.asset_account !== undefined) updateFields.asset_account = typeData.asset_account;
      if (typeData.depreciation_account !== undefined) updateFields.depreciation_account = typeData.depreciation_account;
      if (typeData.revaluation_account !== undefined) updateFields.revaluation_account = typeData.revaluation_account;
      if (typeData.impairment_account !== undefined) updateFields.impairment_account = typeData.impairment_account;
      if (typeData.offsetting_account_for_sales !== undefined) updateFields.offsetting_account_for_sales = typeData.offsetting_account_for_sales;
      if (typeData.accumulated_depreciation !== undefined) updateFields.accumulated_depreciation = typeData.accumulated_depreciation;
      if (typeData.accumulated_impairment_losses !== undefined) updateFields.accumulated_impairment_losses = typeData.accumulated_impairment_losses;
      if (typeData.capital_gain_on_sale !== undefined) updateFields.capital_gain_on_sale = typeData.capital_gain_on_sale;
      if (typeData.capital_loss_sale !== undefined) updateFields.capital_loss_sale = typeData.capital_loss_sale;

      const { data, error } = await supabase
        .from('asset_register_types')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update asset register type: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating asset register type:', error);
      throw error;
    }
  }

  /**
   * Delete an asset register type
   */
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('asset_register_types')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete asset register type: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting asset register type:', error);
      throw error;
    }
  }
}

