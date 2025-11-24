import { supabase } from '../config/database';
import type { SettingsScope, SupplierInvoiceSection } from '../types';

export interface SupplierInvoiceSettingsRow {
  id?: string;
  foundation_id: string;
  scope: SettingsScope;
  section: string;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

type SectionDataMap = Record<SupplierInvoiceSection, Record<string, unknown>>;

const DEFAULT_SECTION_DATA: SectionDataMap = {
  deviations_writeoffs: {
    entries: [
      { id: '1', code: 'imoms', name: 'Ingående moms', application: 'Payments', account: '2641' },
      { id: '2', code: 'avr', name: 'Avrundning', application: 'Payments/payments', account: '3740' },
      { id: '3', code: 'ink', name: 'Inköp', application: 'Payments', account: '4011' },
      { id: '4', code: 'fakt', name: 'Faktureringsavgift', application: 'Payments', account: '3540' },
      { id: '5', code: 'kforl', name: 'Kundförlust', application: 'Payments', account: '6350' },
      { id: '6', code: 'ranta', name: 'Dröjsmålsränta', application: 'Payments', account: '8313' }
    ]
  },
  payment_methods_terms: {
    paymentMethods: [
      { id: '1', code: 'BG', text: 'Bankgiro', account: '1930' },
      { id: '2', code: 'PG', text: 'Plusgiro', account: '1920' }
    ],
    paymentTerms: [
      { id: '1', code: '0', text: '0 dagar', preselected: false, reminderSent: true },
      { id: '2', code: '10', text: '10 dagar', preselected: false, reminderSent: true },
      { id: '3', code: '15', text: '15 dagar', preselected: false, reminderSent: true },
      { id: '4', code: '20', text: '20 dagar', preselected: false, reminderSent: true },
      { id: '5', code: '30', text: '30 dagar', preselected: true, reminderSent: true },
      { id: '6', code: 'AG', text: 'Autogiro', preselected: false, reminderSent: true },
      { id: '7', code: 'K', text: 'Kontant', preselected: false, reminderSent: true },
      { id: '8', code: 'PF', text: 'Postförsko', preselected: false, reminderSent: true }
    ]
  },
  coverage: {
    coverageEnabled: true
  },
  digital_flow_e_invoice: {
    enableEInvoiceSupport: true,
    sendEInvoice: true,
    receiveEInvoice: true,
    receiveEmailConfirmationInvitation: true,
    receiveEmailConfirmationInvoice: true,
    organizationNumber: '',
    vatNumber: '',
    glnNumber: '',
    email: '',
    phone: '',
    contactPerson: '',
    invitationMessageCustomers: '',
    invitationMessageSuppliers: '',
    contractBankGiro: ''
  },
  digital_flow_invoice_interpretation: {
    invoiceInterpretationWithAccounting: false,
    simplifiedViews: false,
    activateBillingAddress: false,
    contactPerson: '',
    phoneNumber: '',
    email: '',
    companyName: 'Testföretag',
    postalAddress: '',
    postalAddress2: '',
    postalCode1: '',
    postalCode2: '',
    customerId: ''
  },
  cost_centers: {
    enableCostCenterSupport: false,
    includeCostCenterWhenTabEntering: false
  },
  supplier_invoice_certificate_general: {
    certificateManagement: 'No',
    paidTest: false,
    prioritizePayment: false
  },
  supplier_invoice_test_notifications: {
    nonReceiptNotice: '',
    nonReceiptUnit: 'OF',
    invoiceDueSoonNotice: '',
    invoiceDueSoonUnit: 'OF',
    sendNotifications: 'Immediately',
    reminderNote: 'Yes',
    timeForSendingNotices: '09:00'
  },
  supplier_vat: {
    vatType: 'VAT',
    about: '',
    proposeVatOnSupplierInvoices: 'Always',
    incomingInvoicesAction: 'proposed',
    outputVATEntries: []
  },
  number_sequences_ocr: {
    customerInvoice: '1',
    offer: '1',
    order: '1',
    supplierInvoice: '1',
    ocrOnCustomerInvoices: true,
    externalInvoiceReference: false
  },
  supplier_accruals: {
    enableSupportForAccruals: false,
    minimumAccrualAmount: '',
    accountingDate: 'last-every-month',
    everyMonthThe: '',
    everyMonthThePeriod: 'day',
    supplierInvoicesVAT: '',
    supplierInvoicesVATEnabled: false,
    customerInvoicesVAT: '',
    customerInvoicesVATEnabled: false,
    accrualCustomerInvoices: 'H - Accrual',
    accrualSupplierInvoices: 'H - Accrual',
    accrualAccountCustomerInvoices: '2990',
    revenueAccountAccrual: '3990',
    accrualAccountSupplierInvoices: '1790',
    costAccountAccrual: ''
  },
  price_list_units: {
    priceLists: [
      { id: '1', code: 'A', name: 'Prislista A', comment: '', preselected: true }
    ],
    units: [
      { id: '1', code: 'förp', codeEng: 'pack', text: 'förpackning' },
      { id: '2', code: 'h', codeEng: 'h', text: 'timmar' },
      { id: '3', code: 'km', codeEng: 'km', text: 'Kilometer' },
      { id: '4', code: 'st', codeEng: 'pcs', text: 'styck' },
      { id: '5', code: 'utl', codeEng: 'exp', text: 'Utlägg' }
    ]
  },
  supplier_currency: {
    showTotalsInLists: 'Converted into SEK',
    automaticExchangeRates: true,
    currencyDeduction: '0',
    currencySurcharge: '0',
    automaticRates: [],
    manualRates: [
      {
        id: 'SEK',
        code: 'SEK',
        name: 'Swedish krona',
        unit: '1',
        date: '',
        sellingPrice: '1,000000',
        purchasePrice: '1,000000'
      }
    ]
  },
  supplier_verification_series: {
    series: [
      { id: 'A', code: 'A', name: 'Redovisning (Accounting)', manualAccounting: true },
      { id: 'B', code: 'B', name: 'Kundfakturor (Customer invoices)', manualAccounting: true },
      { id: 'C', code: 'C', name: 'Inbetalningar från kunder (Payments from customers)', manualAccounting: true },
      { id: 'D', code: 'D', name: 'Leverantörsfakturor (Supplier invoices)', manualAccounting: true },
      { id: 'E', code: 'E', name: 'Utbetalningar till leverantörer (Payments to suppliers)', manualAccounting: true },
      { id: 'F', code: 'F', name: 'Kassa (Cash)', manualAccounting: true },
      { id: 'G', code: 'G', name: 'Avskrivning (Depreciation)', manualAccounting: false },
      { id: 'H', code: 'H', name: 'Periodisering (Accrual)', manualAccounting: false },
      { id: 'I', code: 'I', name: 'Bokslut (Year-end closing)', manualAccounting: false },
      { id: 'J', code: 'J', name: 'Kontantfaktura (Cash invoice)', manualAccounting: false },
      { id: 'K', code: 'K', name: 'Kvitto (Receipt)', manualAccounting: false },
      { id: 'L', code: 'L', name: 'Lön (Salary)', manualAccounting: false },
      { id: 'M', code: 'M', name: 'Momsrapport (VAT report)', manualAccounting: false },
      { id: 'N', code: 'N', name: 'Lager (Stock)', manualAccounting: false },
      { id: 'O', code: 'O', name: 'Ovrigt', manualAccounting: false },
      { id: 'X', code: 'X', name: 'Test', manualAccounting: false },
      { id: 'Y', code: 'Y', name: 'Test123', manualAccounting: true },
      { id: 'Z', code: 'Z', name: 'abc122', manualAccounting: false }
    ],
    selections: {
      'customer-invoices': 'Z - abc122',
      'payments-from-customers': 'C - Payments from customers',
      'supplier-invoices': 'D - Supplier invoices',
      'payments-to-suppliers': 'E - Payments to suppliers',
      'cash-invoices': 'J - Cash invoice',
      'vat-report': 'M - VAT report',
      'facility-register': 'G - Depreciation',
      salary: 'L - Salary',
      'accrual-customer-invoices': 'H - Accrual',
      'accrual-supplier-invoices': 'H - Accrual',
      'financial-statements-non-lockable': 'I - Financial statements',
      stock: 'N - Stock',
      receipts: 'K - Receipt'
    }
  },
  supplier_registration_view: {
    inventoryControl: false,
    ocr: false,
    showAccountBalance: false,
    earSmoothing: 'No penny equalization',
    lockRowsLinkedToOrders: false,
    defaultValidityPeriod: '',
    stockBalanceIndicator: false,
    showPricesInclVat: false,
    invoiceFee: '',
    shippingFee: '',
    decimalsInNumberField: '2',
    defaultDeliveryTime: '',
    defaultPaymentMethod: '',
    customerNumber: '',
    addNewCashCustomers: false
  },
  supplier_financial_year: {
    createFiscalYearsAutomatically: false,
    years: []
  },
  supplier_quick_texts: {
    verificationDescriptions: [],
    transactionInformation: []
  },
  supplier_project: {
    enableSupportForProjectAccounting: true,
    includeProjectsOnTabEnterInput: false
  },
  supplier_reports: {
    leaveReportSelectionWindowOpenAfterPrinting: false
  },
  accounting_project: {
    enableSupportForProjectAccounting: false,
    includeProjectsOnTabEnterInput: false
  },
  accounting_reports: {
    leaveReportSelectionWindowOpenAfterPrinting: false
  },
  default_accounts: {
    bankTransfer: '1930',
    plusgiro: '1920',
    cashPayment: '1910',
    cashPaymentCreditCard: '1913',
    directDebit: '1931',
    purchase: '4010',
    billingFeeLevfakt: '6570',
    accountsPayable: '2440',
    shippingLifeFacts: '5710',
    cashDiscountReceived: '3740',
    sales25Be: '3010',
    sales25Service: '3040',
    sales12Be: '3050',
    sales12Service: '3055',
    sales6Be: '3060',
    sales6Service: '3065',
    sales0Be: '3100',
    sales0Service: '3110',
    salesSeReverseChargeBe: '3230',
    salesSeReverseChargeService: '3240',
    salesEuReverseChargeBe: '3305',
    salesEuReverseChargeService: '3315',
    salesEuVatCompliantBe: '3320',
    salesEuVatCompliantService: '3321',
    salesExportBe: '3300',
    salesExportService: '3310',
    defaultVatRateBe: '2610',
    defaultVatRateService: '2620',
    accountsReceivable: '1510',
    shipping: '5710',
    latePaymentInterest: '3960',
    billingFee: '3540',
    cashDiscountLeft: '3745',
    rounding: '3741',
    reminderFee: '3590',
    outputVatMp1_25: '2610',
    outputVatMp2_12: '2621',
    outgoingVatMp3_6: '2622',
    outputVatMp4Customer_12: '2623',
    outputVatMp5Customer_7: '2624',
    outgoingVatMp6Customer_50: '2625',
    inputVat: '2640',
    beIntraUnionAcquisitionDebit: '4056',
    beIntraUnionAcquisitionCredit: '2615',
    intraUnionAcquisitionServiceDebit: '4535',
    intraUnionAcquisitionServiceCredit: '2614',
    purchaseSeReverseChargeDebit: '4531',
    purchaseSeReverseChargeCredit: '2617',
    accrualAccountLevfakt: '2990',
    revenueAccountAccrual: '3970',
    accrualAccountCustomerFacts: '1790',
    costAccountAccrual: '2999',
    exchangeRateGains: '3968',
    exchangeRateLosses: '7968'
  }
};

const DB_SECTION_MAP: Record<SupplierInvoiceSection, string> = {
  deviations_writeoffs: 'deviations-writeoffs',
  payment_methods_terms: 'payment-methods-terms',
  coverage: 'coverage',
  digital_flow_e_invoice: 'digital-flow-einvoice',
  digital_flow_invoice_interpretation: 'digital-flow-interpretation',
  cost_centers: 'cost-centers',
  supplier_invoice_certificate_general: 'supplier-invoice-certificate-general',
  supplier_invoice_test_notifications: 'supplier-invoice-test-notifications',
  supplier_vat: 'supplier-vat',
  number_sequences_ocr: 'number-sequences-ocr',
  supplier_accruals: 'supplier-accruals',
  price_list_units: 'price-list-units',
  supplier_currency: 'supplier-currency',
  supplier_verification_series: 'supplier-verification-series',
  supplier_registration_view: 'supplier-registration-view',
  supplier_financial_year: 'supplier-financial-year',
  supplier_quick_texts: 'supplier-quick-texts',
  supplier_project: 'supplier-project',
  supplier_reports: 'supplier-reports',
  accounting_project: 'accounting-project',
  accounting_reports: 'accounting-reports',
  default_accounts: 'default-accounts'
};

const REVERSE_DB_SECTION_MAP = Object.entries(DB_SECTION_MAP).reduce<
  Record<string, SupplierInvoiceSection>
>((acc, [key, value]) => {
  acc[value] = key as SupplierInvoiceSection;
  return acc;
}, {});

function cloneDefault<T extends Record<string, unknown>>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export class SupplierInvoiceSettingsModel {
  static async getAllSections(
    foundationId: string,
    scope: SettingsScope
  ): Promise<SectionDataMap> {
    const { data, error } = await supabase
      .from('supplier_invoice_settings')
      .select('section, data')
      .eq('foundation_id', foundationId)
      .eq('scope', scope);

    if (error) {
      throw new Error(`Failed to fetch supplier invoice settings: ${error.message}`);
    }

    const result: SectionDataMap = {
      deviations_writeoffs: cloneDefault(DEFAULT_SECTION_DATA.deviations_writeoffs),
      payment_methods_terms: cloneDefault(DEFAULT_SECTION_DATA.payment_methods_terms),
      coverage: cloneDefault(DEFAULT_SECTION_DATA.coverage),
      digital_flow_e_invoice: cloneDefault(DEFAULT_SECTION_DATA.digital_flow_e_invoice),
      digital_flow_invoice_interpretation: cloneDefault(
        DEFAULT_SECTION_DATA.digital_flow_invoice_interpretation
      ),
      cost_centers: cloneDefault(DEFAULT_SECTION_DATA.cost_centers),
      supplier_invoice_certificate_general: cloneDefault(
        DEFAULT_SECTION_DATA.supplier_invoice_certificate_general
      ),
      supplier_invoice_test_notifications: cloneDefault(
        DEFAULT_SECTION_DATA.supplier_invoice_test_notifications
      ),
      supplier_vat: cloneDefault(DEFAULT_SECTION_DATA.supplier_vat),
      number_sequences_ocr: cloneDefault(DEFAULT_SECTION_DATA.number_sequences_ocr),
      supplier_accruals: cloneDefault(DEFAULT_SECTION_DATA.supplier_accruals),
      price_list_units: cloneDefault(DEFAULT_SECTION_DATA.price_list_units),
      supplier_currency: cloneDefault(DEFAULT_SECTION_DATA.supplier_currency),
      supplier_verification_series: cloneDefault(
        DEFAULT_SECTION_DATA.supplier_verification_series
      ),
      supplier_registration_view: cloneDefault(DEFAULT_SECTION_DATA.supplier_registration_view),
      supplier_financial_year: cloneDefault(DEFAULT_SECTION_DATA.supplier_financial_year),
      supplier_quick_texts: cloneDefault(DEFAULT_SECTION_DATA.supplier_quick_texts),
      supplier_project: cloneDefault(DEFAULT_SECTION_DATA.supplier_project),
      supplier_reports: cloneDefault(DEFAULT_SECTION_DATA.supplier_reports),
      accounting_project: cloneDefault(DEFAULT_SECTION_DATA.accounting_project),
      accounting_reports: cloneDefault(DEFAULT_SECTION_DATA.accounting_reports),
      default_accounts: cloneDefault(DEFAULT_SECTION_DATA.default_accounts)
    };

    (data as SupplierInvoiceSettingsRow[] | null | undefined)?.forEach((row) => {
      const sectionKey = REVERSE_DB_SECTION_MAP[row.section];
      if (sectionKey && sectionKey in result && row.data) {
        result[sectionKey] = { ...cloneDefault(DEFAULT_SECTION_DATA[sectionKey]), ...row.data };
      }
    });

    return result;
  }

  static async getSection(
    foundationId: string,
    scope: SettingsScope,
    section: SupplierInvoiceSection
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('supplier_invoice_settings')
      .select('data')
      .eq('foundation_id', foundationId)
      .eq('scope', scope)
      .eq('section', DB_SECTION_MAP[section])
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch supplier invoice settings section: ${error.message}`);
    }

    const row = data as SupplierInvoiceSettingsRow | null;

    if (!row) {
      return cloneDefault(DEFAULT_SECTION_DATA[section]);
    }

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row.data ?? {}) };
  }

  static async upsertSection(
    foundationId: string,
    scope: SettingsScope,
    section: SupplierInvoiceSection,
    payload: Record<string, unknown>,
    userId: string
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('supplier_invoice_settings')
      .upsert(
        {
          foundation_id: foundationId,
          scope,
          section: DB_SECTION_MAP[section],
          data: payload,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'foundation_id,scope,section'
        }
      )
      .select('data')
      .single();

    if (error) {
      throw new Error(`Failed to save supplier invoice settings: ${error.message}`);
    }

    const row = data as SupplierInvoiceSettingsRow | null;

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row?.data ?? {}) };
  }
}

export const SUPPLIER_INVOICE_SECTIONS: SupplierInvoiceSection[] = [
  'deviations_writeoffs',
  'payment_methods_terms',
  'coverage',
  'digital_flow_e_invoice',
  'digital_flow_invoice_interpretation',
  'cost_centers',
  'supplier_invoice_certificate_general',
  'supplier_invoice_test_notifications',
  'supplier_vat',
  'number_sequences_ocr',
  'supplier_accruals',
  'price_list_units',
  'supplier_currency',
  'supplier_verification_series',
  'supplier_registration_view',
  'supplier_financial_year',
  'supplier_quick_texts',
  'supplier_project',
  'supplier_reports',
  'accounting_project',
  'accounting_reports',
  'default_accounts'
];

