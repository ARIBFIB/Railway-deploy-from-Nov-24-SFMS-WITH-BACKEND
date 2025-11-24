import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import type { SettingsScope, SupplierInvoiceSection } from '../types';
import {
  SupplierInvoiceSettingsModel,
  SUPPLIER_INVOICE_SECTIONS
} from '../models/SupplierInvoiceSettings';

const SECTION_SLUG_MAP: Record<string, SupplierInvoiceSection> = {
  'deviations-writeoffs': 'deviations_writeoffs',
  'deviations_writeoffs': 'deviations_writeoffs',
  'payment-methods-terms': 'payment_methods_terms',
  'payment_methods_terms': 'payment_methods_terms',
  coverage: 'coverage',
  'digital-flow-e-invoice': 'digital_flow_e_invoice',
  'digital_flow_e_invoice': 'digital_flow_e_invoice',
  'digital-flow-invoice-interpretation': 'digital_flow_invoice_interpretation',
  'digital_flow_invoice_interpretation': 'digital_flow_invoice_interpretation',
  'cost-centers': 'cost_centers',
  'cost_centers': 'cost_centers',
  'supplier-cost-centers': 'cost_centers',
  'supplier-invoice-certificate': 'supplier_invoice_certificate_general',
  'supplier-invoice-certificate-general': 'supplier_invoice_certificate_general',
  'supplier_invoice_certificate_general': 'supplier_invoice_certificate_general',
  'supplier-invoice-test': 'supplier_invoice_test_notifications',
  'supplier-invoice-test-notifications': 'supplier_invoice_test_notifications',
  'supplier_invoice_test_notifications': 'supplier_invoice_test_notifications',
  'supplier-vat': 'supplier_vat',
  'supplier_vat': 'supplier_vat',
  'number-sequences-ocr': 'number_sequences_ocr',
  'number_sequences_ocr': 'number_sequences_ocr',
  'supplier-number-sequences-ocr': 'number_sequences_ocr',
  'supplier-accruals': 'supplier_accruals',
  'supplier_accruals': 'supplier_accruals',
  accruals: 'supplier_accruals',
  'price-list-units': 'price_list_units',
  'price_list_units': 'price_list_units',
  'supplier-price-lists-units': 'price_list_units',
  'supplier-currency': 'supplier_currency',
  'supplier_currency': 'supplier_currency',
  'supplier-verification-series': 'supplier_verification_series',
  'supplier_verification_series': 'supplier_verification_series',
  'registration-view': 'supplier_registration_view',
  'registration_view': 'supplier_registration_view',
  'supplier-registration-view': 'supplier_registration_view',
  'financial-year': 'supplier_financial_year',
  'financial_year': 'supplier_financial_year',
  'supplier-financial-year': 'supplier_financial_year',
  'quick-texts': 'supplier_quick_texts',
  'quick_texts': 'supplier_quick_texts',
  'supplier-quick-texts': 'supplier_quick_texts',
  'supplier_project': 'supplier_project',
  'supplier-project': 'supplier_project',
  project: 'supplier_project',
  'supplier_reports': 'supplier_reports',
  'supplier-reports': 'supplier_reports',
  'accounting-project': 'accounting_project',
  'accounting_project': 'accounting_project',
  'accounting-reports': 'accounting_reports',
  'accounting_reports': 'accounting_reports',
  reports: 'accounting_reports',
  'default-accounts': 'default_accounts',
  'default_accounts': 'default_accounts',
  'supplier-default-accounts': 'default_accounts'
};

const RESERVED_BODY_KEYS = new Set([
  'foundationId',
  'foundation_id',
  'userId',
  'user_id',
  'roleId',
  'scope',
  'section'
]);

export class SupplierInvoiceSettingsController {
  private static resolveScope(scope?: SettingsScope): SettingsScope {
    return scope ?? 'supplier';
  }

  private static normalizeSection(sectionParam?: string): SupplierInvoiceSection {
    if (!sectionParam) {
      throw createError('Supplier invoice section is required', 400);
    }

    const normalized = sectionParam.trim().toLowerCase();

    if (SECTION_SLUG_MAP[normalized]) {
      return SECTION_SLUG_MAP[normalized];
    }

    const underscored = normalized.replace(/-/g, '_') as SupplierInvoiceSection;

    if ((SUPPLIER_INVOICE_SECTIONS as readonly string[]).includes(underscored)) {
      return underscored;
    }

    throw createError(`Unknown supplier invoice section: ${sectionParam}`, 400);
  }

  private static extractPayload(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {};
    }

    const sanitized: Record<string, unknown> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (!RESERVED_BODY_KEYS.has(key)) {
        sanitized[key] = value;
      }
    });

    const candidate = sanitized.data;
    if (
      candidate &&
      typeof candidate === 'object' &&
      !Array.isArray(candidate) &&
      Object.keys(sanitized).length === 1
    ) {
      return candidate as Record<string, unknown>;
    }

    return sanitized;
  }

  static getAllSections(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = req.user?.foundation_id;

      if (!foundationId) {
        res.status(400).json(createError('Foundation ID is required'));
        return;
      }

      try {
        const data = await SupplierInvoiceSettingsModel.getAllSections(foundationId, resolvedScope);

        res.status(200).json({
          success: true,
          data
        });
      } catch (error) {
        console.error('❌ Error fetching supplier invoice settings:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to fetch supplier invoice settings: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
              500
            )
          );
      }
    });
  }

  static getSection(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = req.user?.foundation_id;
      const section = this.normalizeSection(req.params.section);

      if (!foundationId) {
        res.status(400).json(createError('Foundation ID is required'));
        return;
      }

      try {
        const data = await SupplierInvoiceSettingsModel.getSection(
          foundationId,
          resolvedScope,
          section
        );

        res.status(200).json({
          success: true,
          data,
          section
        });
      } catch (error) {
        console.error('❌ Error fetching supplier invoice section:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to fetch supplier invoice section: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
              500
            )
          );
      }
    });
  }

  static upsertSection(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = req.user?.foundation_id;
      const userId = req.user?.user_id;
      const section = this.normalizeSection(req.params.section);

      if (!foundationId || !userId) {
        res.status(400).json(createError('Foundation ID and User ID are required'));
        return;
      }

      const payload = this.extractPayload(req.body);

      if (Object.keys(payload).length === 0) {
        res.status(400).json(createError('No settings data provided', 400));
        return;
      }

      try {
        const data = await SupplierInvoiceSettingsModel.upsertSection(
          foundationId,
          resolvedScope,
          section,
          payload,
          userId
        );

        res.status(200).json({
          success: true,
          data,
          section,
          message: 'Supplier invoice settings saved successfully'
        });
      } catch (error) {
        console.error('❌ Error saving supplier invoice settings:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to save supplier invoice settings: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
              500
            )
          );
      }
    });
  }
}


