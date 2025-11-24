import { supabase } from '../config/database';

export type QuoteOrderSection = 
  | 'email-document' 
  | 'labels' 
  | 'housework' 
  | 'payment-methods-terms' 
  | 'coverage'
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

export interface QuoteOrderSettingsRow {
  id?: string;
  foundation_id: string;
  section: string;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

type SectionDataMap = Record<QuoteOrderSection, Record<string, unknown>>;

const DEFAULT_SECTION_DATA: SectionDataMap = {
  'email-document': {
    invoice: {
      sender: 'invoice-no-reply@company.com',
      replyAddress: 'faktura-no-reply@company.com',
      subject: 'Faktura {no} bifogas',
      text: ''
    },
    reminder: {
      sender: 'reminder-no-reply@company.com',
      replyAddress: 'paminnelse-no-reply@company.com',
      subject: '',
      text: ''
    }
  },
  labels: {
    enableSupportForLabels: true,
    labels: [
      { id: '1', label: 'Tests' }
    ]
  },
  housework: {
    houseworkEnabled: false,
    suggestType: 'Nothing'
  },
  'payment-methods-terms': {
    paymentMethods: [
      { id: '1', code: 'CASH', text: 'Cash', account: '1930' },
      { id: '2', code: 'CARD', text: 'Card payment', account: '1931' },
      { id: '3', code: 'BANK', text: 'Bank transfer', account: '1932' }
    ],
    paymentTerms: [
      { id: '1', code: 'NET30', text: 'Net 30 days', preselected: true, reminder: false },
      { id: '2', code: 'NET14', text: 'Net 14 days', preselected: false, reminder: true },
      { id: '3', code: 'IMM', text: 'Immediate', preselected: false, reminder: false }
    ]
  },
  coverage: {
    coverageEnabled: true
  },
  'cost-centers': {
    enableCostCenterSupport: false,
    includeCostCenterWhenTabEntering: false
  },
  'credit-warning': {
    creditWarningEnabled: true,
    warningLimit: '0,00'
  },
  'delivery-method-terms': {
    deliveryMethods: [
      { id: '1', code: 'PICKUP', text: 'Hämta', textEnglish: 'Pick up' },
      { id: '2', code: 'DELIVERY', text: 'Leverans', textEnglish: 'Delivery' }
    ],
    deliveryTerms: [
      { id: '1', code: 'EXW', text: 'Ex works', textEnglish: 'Ex works' },
      { id: '2', code: 'FOB', text: 'Free on board', textEnglish: 'Free on board' }
    ]
  },
  vat: {
    vatType: 'Annual VAT',
    about: '',
    proposeVatOnSupplierInvoices: 'Always',
    incomingInvoicesAction: 'proposed',
    outputVATEntries: []
  },
  'number-sequences-ocr': {
    customerInvoice: '1',
    offer: '1',
    order: '1',
    supplierInvoice: '1',
    ocrOnCustomerInvoices: true,
    externalInvoiceReference: false
  },
  'quote-order-texts': {
    transferQuoteText: false,
    transferOrderText: false,
    quoteCode: '',
    quoteText: '',
    useAsDefaultQuote: false,
    orderCode: '',
    orderText: '',
    useAsDefaultOrder: false
  },
  'price-list-units': {
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
  reports: {
    leaveReportSelectionWindowOpenAfterPrinting: false
  },
  project: {
    enableSupportForProjectAccounting: true,
    includeProjectsOnTabEnterInput: false
  },
  'registration-view': {
    inventoryControl: true,
    ocr: true,
    showAccountBalance: false,
    earSmoothing: 'No penny equalization',
    lockRowsLinkedToOrders: false,
    defaultValidityPeriod: '',
    stockBalanceIndicator: false,
    showPricesInclVat: false,
    invoiceFee: '0,00',
    shippingFee: '0,00',
    decimalsInNumberField: '2',
    defaultDeliveryTime: '',
    defaultPaymentMethod: 'Cash',
    customerNumber: '',
    addNewCashCustomers: false
  },
  'financial-year': {
    createFiscalYearsAutomatically: false,
    years: []
  },
  printouts: {
    numberOfInvoiceCopies: '0',
    printCompanyName: false,
    numberOfDeliveryNotes: '0',
    defaultInvoiceTemplate: 'Nothing selected',
    invoiceLanguage: 'Nothing selected',
    preselectedQuoteTemplate: 'Nothing selected',
    quoteLanguage: 'Nothing selected',
    defaultCashInvoiceTemplate: 'Nothing selected',
    cashInvoiceLanguage: 'Nothing selected',
    defaultOrderTemplate: 'Nothing selected',
    orderLanguage: 'Nothing selected',
    defaultReminderTemplate: 'Nothing selected',
    reminderLanguage: 'Nothing selected'
  },
  currency: {
    showTotalsInLists: 'Converted into SEK',
    automaticExchangeRates: true,
    currencyDeduction: '0',
    currencySurcharge: '0',
    automaticRates: [],
    manualRates: [
      {
        id: 'SEK',
        code: 'SEK',
        name: 'Swedish Krona',
        unit: '1',
        date: '',
        sellingPrice: '1,00',
        purchasePrice: '1,00'
      }
    ]
  }
};

function cloneDefault<T extends Record<string, unknown>>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export class QuoteOrderSettingsModel {
  static async getAllSections(foundationId: string): Promise<SectionDataMap> {
    const { data, error } = await supabase
      .from('quote_order_settings')
      .select('section, data')
      .eq('foundation_id', foundationId);

    if (error) {
      throw new Error(`Failed to fetch quote order settings: ${error.message}`);
    }

    const result: SectionDataMap = {
      'email-document': cloneDefault(DEFAULT_SECTION_DATA['email-document']),
      labels: cloneDefault(DEFAULT_SECTION_DATA.labels),
      housework: cloneDefault(DEFAULT_SECTION_DATA.housework),
      'payment-methods-terms': cloneDefault(DEFAULT_SECTION_DATA['payment-methods-terms']),
      coverage: cloneDefault(DEFAULT_SECTION_DATA.coverage),
      'cost-centers': cloneDefault(DEFAULT_SECTION_DATA['cost-centers']),
      'credit-warning': cloneDefault(DEFAULT_SECTION_DATA['credit-warning']),
      'delivery-method-terms': cloneDefault(DEFAULT_SECTION_DATA['delivery-method-terms']),
      vat: cloneDefault(DEFAULT_SECTION_DATA.vat),
      'number-sequences-ocr': cloneDefault(DEFAULT_SECTION_DATA['number-sequences-ocr']),
      'quote-order-texts': cloneDefault(DEFAULT_SECTION_DATA['quote-order-texts']),
      'price-list-units': cloneDefault(DEFAULT_SECTION_DATA['price-list-units']),
      reports: cloneDefault(DEFAULT_SECTION_DATA.reports),
      project: cloneDefault(DEFAULT_SECTION_DATA.project),
      'registration-view': cloneDefault(DEFAULT_SECTION_DATA['registration-view']),
      'financial-year': cloneDefault(DEFAULT_SECTION_DATA['financial-year']),
      printouts: cloneDefault(DEFAULT_SECTION_DATA.printouts),
      currency: cloneDefault(DEFAULT_SECTION_DATA.currency)
    };

    (data as QuoteOrderSettingsRow[] | null | undefined)?.forEach((row) => {
      const sectionKey = row.section as QuoteOrderSection;
      if (sectionKey in result && row.data) {
        result[sectionKey] = { ...cloneDefault(DEFAULT_SECTION_DATA[sectionKey]), ...row.data };
      }
    });

    return result;
  }

  static async getSection(
    foundationId: string,
    section: QuoteOrderSection
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('quote_order_settings')
      .select('data')
      .eq('foundation_id', foundationId)
      .eq('section', section)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch quote order settings section: ${error.message}`);
    }

    const row = data as QuoteOrderSettingsRow | null;

    if (!row) {
      return cloneDefault(DEFAULT_SECTION_DATA[section]);
    }

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row.data ?? {}) };
  }

  static async upsertSection(
    foundationId: string,
    section: QuoteOrderSection,
    payload: Record<string, unknown>,
    userId: string
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('quote_order_settings')
      .upsert(
        {
          foundation_id: foundationId,
          section,
          data: payload,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'foundation_id,section'
        }
      )
      .select('data')
      .single();

    if (error) {
      throw new Error(`Failed to save quote order settings: ${error.message}`);
    }

    const row = data as QuoteOrderSettingsRow | null;

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row?.data ?? {}) };
  }
}

export const QUOTE_ORDER_SECTIONS: QuoteOrderSection[] = [
  'email-document',
  'labels',
  'housework',
  'payment-methods-terms',
  'coverage',
  'cost-centers',
  'credit-warning',
  'delivery-method-terms',
  'vat',
  'number-sequences-ocr',
  'quote-order-texts',
  'price-list-units',
  'reports',
  'project',
  'registration-view',
  'financial-year',
  'printouts',
  'currency'
];

