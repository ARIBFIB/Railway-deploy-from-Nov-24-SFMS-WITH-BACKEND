import { apiFetch } from '../utils/api';

export type SupplierInvoiceSectionSlug =
  | 'deviations-writeoffs'
  | 'payment-methods-terms'
  | 'coverage'
  | 'digital-flow-e-invoice'
  | 'digital-flow-invoice-interpretation'
  | 'cost-centers'
  | 'supplier-invoice-certificate-general'
  | 'supplier-invoice-test-notifications'
  | 'supplier-vat'
  | 'number-sequences-ocr'
  | 'supplier-accruals'
  | 'price-list-units'
  | 'supplier-registration-view'
  | 'supplier-financial-year'
  | 'supplier-quick-texts'
  | 'supplier-currency'
  | 'supplier-verification-series'
  | 'supplier-project'
  | 'supplier-reports'
  | 'default-accounts';

export type AccountingInvoiceSectionSlug = 'accounting-project' | 'accounting-reports';

export type QuoteOrderSectionSlug =
  | 'payment-methods-terms'
  | 'coverage'
  | 'email-document'
  | 'labels'
  | 'housework'
  | 'cost-centers'
  | 'credit-warning'
  | 'delivery-method-terms'
  | 'vat'
  | 'number-sequences-ocr'
  | 'quote-order-texts'
  | 'price-list-units'
  | 'reports'
  | 'project'
  | 'registration-view'
  | 'financial-year'
  | 'printouts'
  | 'currency';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  section?: string;
}

const SUPPLIER_BASE_URL = '/api/settings/supplier/invoice';
const ACCOUNTING_BASE_URL = '/api/settings/accounting/invoice';
const QUOTE_ORDER_BASE_URL = '/api/settings/quote-order/invoice';

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  if (!text) {
    return { success: response.ok } as ApiResponse<T>;
  }

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch (error) {
    console.error('❌ Failed to parse invoice settings response', error);
    throw new Error('Unexpected response from server');
  }
}

function handleApiError<T>(response: Response, body?: ApiResponse<T>): never {
  const message =
    body?.message ||
    body?.error ||
    `Invoice settings request failed with status ${response.status}`;
  throw new Error(message);
}

export async function fetchSupplierInvoiceSettings<T = Record<string, unknown>>(): Promise<T> {
  const response = await apiFetch(`${SUPPLIER_BASE_URL}`);
  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function fetchSupplierInvoiceSection<T = Record<string, unknown>>(
  section: SupplierInvoiceSectionSlug
): Promise<T> {
  const response = await apiFetch(`${SUPPLIER_BASE_URL}/${section}`);
  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function updateSupplierInvoiceSection<T>(
  section: SupplierInvoiceSectionSlug,
  payload: T
): Promise<T> {
  const response = await apiFetch(`${SUPPLIER_BASE_URL}/${section}`, {
    method: 'PUT',
    json: payload
  });

  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function fetchAccountingInvoiceSection<T = Record<string, unknown>>(
  section: AccountingInvoiceSectionSlug
): Promise<T> {
  const response = await apiFetch(`${ACCOUNTING_BASE_URL}/${section}`);
  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function updateAccountingInvoiceSection<T>(
  section: AccountingInvoiceSectionSlug,
  payload: T
): Promise<T> {
  const response = await apiFetch(`${ACCOUNTING_BASE_URL}/${section}`, {
    method: 'PUT',
    json: payload
  });

  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function fetchQuoteOrderInvoiceSection<T = Record<string, unknown>>(
  section: QuoteOrderSectionSlug
): Promise<T> {
  const response = await apiFetch(`${QUOTE_ORDER_BASE_URL}/${section}`);
  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

export async function updateQuoteOrderInvoiceSection<T>(
  section: QuoteOrderSectionSlug,
  payload: T
): Promise<T> {
  const response = await apiFetch(`${QUOTE_ORDER_BASE_URL}/${section}`, {
    method: 'PUT',
    json: payload
  });

  const body = await parseResponse<T>(response);

  if (!response.ok || !body?.data) {
    handleApiError(response, body);
  }

  return body.data;
}

