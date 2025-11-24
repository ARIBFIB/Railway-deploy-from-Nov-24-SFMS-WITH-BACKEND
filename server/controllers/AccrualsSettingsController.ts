import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class AccrualsSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('accruals_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        data: data || {
          enable_support_for_accruals: false,
          minimum_accrual_amount: null,
          accounting_date: null,
          specific_day: null,
          accrual_customer_invoices: null,
          accrual_supplier_invoices: null,
          supplier_invoices_vat_included: false,
          customer_invoices_vat_included: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching accruals settings:', error);
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
        enable_support_for_accruals,
        minimum_accrual_amount,
        accounting_date,
        specific_day,
        accrual_customer_invoices,
        accrual_supplier_invoices,
        supplier_invoices_vat_included,
        customer_invoices_vat_included,
        accrual_account_customer_invoices,
        revenue_account_accrual,
        accrual_account_supplier_invoices,
        cost_account_accrual
      } = req.body;

      const updateData: any = {
        foundation_id: foundationId,
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      // Map all fields with proper handling
      if (enable_support_for_accruals !== undefined) updateData.enable_support_for_accruals = enable_support_for_accruals;
      if (minimum_accrual_amount !== undefined) updateData.minimum_accrual_amount = minimum_accrual_amount;
      if (accounting_date !== undefined) updateData.accounting_date = accounting_date;
      if (specific_day !== undefined) updateData.specific_day = specific_day;
      if (accrual_customer_invoices !== undefined) updateData.accrual_customer_invoices = accrual_customer_invoices;
      if (accrual_supplier_invoices !== undefined) updateData.accrual_supplier_invoices = accrual_supplier_invoices;
      if (supplier_invoices_vat_included !== undefined) updateData.supplier_invoices_vat_included = supplier_invoices_vat_included;
      if (customer_invoices_vat_included !== undefined) updateData.customer_invoices_vat_included = customer_invoices_vat_included;
      if (accrual_account_customer_invoices !== undefined) updateData.accrual_account_customer_invoices = accrual_account_customer_invoices;
      if (revenue_account_accrual !== undefined) updateData.revenue_account_accrual = revenue_account_accrual;
      if (accrual_account_supplier_invoices !== undefined) updateData.accrual_account_supplier_invoices = accrual_account_supplier_invoices;
      if (cost_account_accrual !== undefined) updateData.cost_account_accrual = cost_account_accrual;

      const { data, error } = await supabase
        .from('accruals_settings')
        .upsert(updateData, { onConflict: 'foundation_id' })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        data,
        message: 'Accruals settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving accruals settings:', error);
      res.status(500).json(createError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

