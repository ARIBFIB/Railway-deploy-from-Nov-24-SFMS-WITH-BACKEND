import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';
import type { SettingsScope } from '../types';

// Helper function to convert camelCase to snake_case
function camelToSnake(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, ''); // Remove leading underscore
}

// Helper function to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  // Handle special cases with numbers and underscores (e.g., mp1_25)
  return str.replace(/_([a-z0-9])/g, (match, letter, offset) => {
    // If the previous character is a number, keep underscore, otherwise capitalize
    const prevChar = offset > 0 ? str[offset - 1] : undefined;
    if (prevChar && /[0-9]/.test(prevChar)) {
      return match.toLowerCase();
    }
    return letter.toUpperCase();
  });
}

// Map camelCase field names to snake_case database columns
const fieldMapping: Record<string, string> = {
  bankTransfer: 'bank_transfer',
  plusgiro: 'plusgiro',
  cashPayment: 'cash_payment',
  cashPaymentCreditCard: 'cash_payment_credit_card',
  directDebit: 'direct_debit',
  purchase: 'purchase',
  billingFeeLevfakt: 'billing_fee_levfakt',
  accountsPayable: 'accounts_payable',
  shippingLifeFacts: 'shipping_life_facts',
  cashDiscountReceived: 'cash_discount_received',
  sales25Be: 'sales_25_be',
  sales25Service: 'sales_25_service',
  sales12Be: 'sales_12_be',
  sales12Service: 'sales_12_service',
  sales6Be: 'sales_6_be',
  sales6Service: 'sales_6_service',
  sales0Be: 'sales_0_be',
  sales0Service: 'sales_0_service',
  salesSeReverseChargeBe: 'sales_se_reverse_charge_be',
  salesSeReverseChargeService: 'sales_se_reverse_charge_service',
  salesEuReverseChargeBe: 'sales_eu_reverse_charge_be',
  salesEuReverseChargeService: 'sales_eu_reverse_charge_service',
  salesEuVatCompliantBe: 'sales_eu_vat_compliant_be',
  salesEuVatCompliantService: 'sales_eu_vat_compliant_service',
  salesExportBe: 'sales_export_be',
  salesExportService: 'sales_export_service',
  defaultVatRateBe: 'default_vat_rate_be',
  defaultVatRateService: 'default_vat_rate_service',
  accountsReceivable: 'accounts_receivable',
  shipping: 'shipping',
  latePaymentInterest: 'late_payment_interest',
  billingFee: 'billing_fee',
  cashDiscountLeft: 'cash_discount_left',
  rounding: 'rounding',
  reminderFee: 'reminder_fee',
  outputVatMp1_25: 'output_vat_mp1_25',
  outputVatMp2_12: 'output_vat_mp2_12',
  outgoingVatMp3_6: 'outgoing_vat_mp3_6',
  outputVatMp4Customer_12: 'output_vat_mp4_customer_12',
  outputVatMp5Customer_7: 'output_vat_mp5_customer_7',
  outgoingVatMp6Customer_50: 'outgoing_vat_mp6_customer_50',
  inputVat: 'input_vat',
  beIntraUnionAcquisitionDebit: 'be_intra_union_acquisition_debit',
  beIntraUnionAcquisitionCredit: 'be_intra_union_acquisition_credit',
  intraUnionAcquisitionServiceDebit: 'intra_union_acquisition_service_debit',
  intraUnionAcquisitionServiceCredit: 'intra_union_acquisition_service_credit',
  purchaseSeReverseChargeDebit: 'purchase_se_reverse_charge_debit',
  purchaseSeReverseChargeCredit: 'purchase_se_reverse_charge_credit',
  accrualAccountLevfakt: 'accrual_account_levfakt',
  revenueAccountAccrual: 'revenue_account_accrual',
  accrualAccountCustomerFacts: 'accrual_account_customer_facts',
  costAccountAccrual: 'cost_account_accrual',
  exchangeRateGains: 'exchange_rate_gains',
  exchangeRateLosses: 'exchange_rate_losses'
};

// Reverse mapping: snake_case to camelCase
const reverseMapping: Record<string, string> = {};
Object.keys(fieldMapping).forEach(key => {
  const dbColumn = fieldMapping[key];
  if (dbColumn) {
    reverseMapping[dbColumn] = key;
  }
});

export class DefaultAccountsController {
  private static readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private static resolveScope(scope?: SettingsScope): SettingsScope {
    return scope ?? 'accounting';
  }

  static getSettings(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = req.user?.foundation_id;

      if (!foundationId) {
        res.status(400).json(createError('Foundation ID is required'));
        return;
      }

      if (!this.uuidRegex.test(foundationId)) {
        res.status(400).json(createError('Invalid foundation ID format. Please contact support.'));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('default_accounts')
          .select('*')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        const convertedData: any = {};
        const systemFields = [
          'id',
          'foundation_id',
          'scope',
          'created_at',
          'updated_at',
          'created_by',
          'updated_by'
        ];
        if (data) {
          Object.keys(data).forEach(key => {
            if (systemFields.includes(key)) {
              convertedData[key] = data[key];
            } else {
              const camelKey = reverseMapping[key] || snakeToCamel(key);
              convertedData[camelKey] = data[key];
            }
          });
        }

        res.status(200).json({
          success: true,
          data: convertedData || {}
        });
      } catch (error) {
        console.error('❌ Error fetching default accounts:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to fetch default accounts: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  static upsertSettings(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = req.user?.foundation_id;
      const userId = req.user?.user_id;

      if (!foundationId || !userId) {
        res.status(400).json(createError('Foundation ID and User ID are required'));
        return;
      }

      if (!this.uuidRegex.test(foundationId)) {
        res.status(400).json(createError('Invalid foundation ID format. Please contact support.'));
        return;
      }

      try {
        const updateData: any = {
          foundation_id: foundationId,
          scope: resolvedScope,
          updated_by: userId,
          updated_at: new Date().toISOString()
        };

        Object.keys(req.body).forEach(key => {
          if (req.body[key] !== undefined) {
            if (fieldMapping[key]) {
              const dbColumn = fieldMapping[key];
              updateData[dbColumn] = req.body[key];
            } else if (
              ['foundation_id', 'scope', 'id', 'created_at', 'updated_at', 'created_by', 'updated_by'].includes(key)
            ) {
              updateData[key] = req.body[key];
            }
          }
        });

        const { data, error } = await supabase
          .from('default_accounts')
          .upsert(updateData, { onConflict: 'foundation_id,scope' })
          .select()
          .single();

        if (error) throw error;

        const convertedData: any = {};
        const systemFields = [
          'id',
          'foundation_id',
          'scope',
          'created_at',
          'updated_at',
          'created_by',
          'updated_by'
        ];
        if (data) {
          Object.keys(data).forEach(key => {
            if (systemFields.includes(key)) {
              convertedData[key] = data[key];
            } else {
              const camelKey = reverseMapping[key] || snakeToCamel(key);
              convertedData[camelKey] = data[key];
            }
          });
        }

        res.status(200).json({
          success: true,
          data: convertedData,
          message: 'Default accounts saved successfully'
        });
      } catch (error) {
        console.error('❌ Error saving default accounts:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to save default accounts: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }
}

