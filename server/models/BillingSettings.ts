import { supabase } from '../config/database';

export type BillingSection = 
  | 'billing-deviations-writeoffs'
  | 'billing-payment-methods-terms'
  | 'billing-trusted-senders-storage'
  | 'billing-coverage'
  | 'billing-digital-flow-einvoice'
  | 'billing-email-document'
  | 'billing-labels'
  | 'billing-delivery-method-terms'
  | 'billing-cost-centers'
  | 'billing-invoice-texts'
  | 'billing-housework'
  | 'billing-credit-warning'
  | 'billing-price-list-units'
  | 'billing-number-sequences-ocr'
  | 'billing-vat'
  | 'billing-accruals'
  | 'billing-project'
  | 'billing-reminders'
  | 'billing-reports'
  | 'billing-registration-view'
  | 'billing-interest-invoicing'
  | 'billing-printouts'
  | 'billing-printing-service'
  | 'billing-currency'
  | 'billing-verification-series';

export interface BillingSettingsRow {
  id?: string;
  foundation_id: string;
  section: string;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

type SectionDataMap = Record<BillingSection, Record<string, unknown>>;

const DEFAULT_SECTION_DATA: SectionDataMap = {
  'billing-deviations-writeoffs': {
    deviations: [
      { id: '1', code: 'imoms', name: 'Ingående moms', application: 'Payments', account: '2641' },
      { id: '2', code: 'avr', name: 'Avrundning', application: 'Payments/payments', account: '3740' },
      { id: '3', code: 'ink', name: 'Inköp', application: 'Payments', account: '4011' },
      { id: '4', code: 'fakt', name: 'Faktureringsavgift', application: 'Payments', account: '3540' },
      { id: '5', code: 'kforl', name: 'Kundförlust', application: 'Payments', account: '6350' },
      { id: '6', code: 'ranta', name: 'Dröjsmålsränta', application: 'Payments', account: '8313' }
    ]
  },
  'billing-payment-methods-terms': {
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
  'billing-trusted-senders-storage': {
    email_function_enabled: true,
    storage_used_mb: 0,
    storage_total_mb: 10240,
    trusted_domains: [],
    trusted_email_addresses: [],
    rejected_email_addresses: []
  },
  'billing-coverage': {
    coverageEnabled: true
  },
  'billing-digital-flow-einvoice': {
    einvoiceEnabled: false,
    einvoiceProvider: '',
    einvoiceSettings: {}
  },
  'billing-email-document': {
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
  'billing-labels': {
    enableSupportForLabels: true,
    labels: []
  },
  'billing-delivery-method-terms': {
    deliveryMethods: [],
    deliveryTerms: []
  },
  'billing-cost-centers': {
    enableCostCenterSupport: false,
    includeCostCenterWhenTabEntering: false
  },
  'billing-invoice-texts': {
    code: '',
    text: '',
    useAsDefault: false
  },
  'billing-housework': {
    houseworkEnabled: false,
    suggestType: 'Nothing'
  },
  'billing-credit-warning': {
    creditWarningEnabled: true,
    warningLimit: '0,00'
  },
  'billing-price-list-units': {
    priceLists: [],
    units: []
  },
  'billing-number-sequences-ocr': {
    customerInvoice: '',
    offer: '',
    order: '',
    supplierInvoice: '',
    ocrOnCustomerInvoices: false,
    externalInvoiceReference: false
  },
  'billing-vat': {
    settings: {
      vatType: 'Annual VAT',
      about: '',
      proposeVatOnSupplierInvoices: '',
      incomingInvoicesAction: 'proposed',
      outputVATEntries: []
    }
  },
  'billing-accruals': {
    enableSupportForAccruals: false,
    minimumAccrualAmount: '',
    accountingDate: 'last-every-month',
    everyMonthThe: '',
    everyMonthThePeriod: 'day',
    supplierInvoicesVAT: '',
    supplierInvoicesVATEnabled: false,
    customerInvoicesVAT: '',
    customerInvoicesVATEnabled: false,
    accrualCustomerInvoices: '',
    accrualSupplierInvoices: '',
    accrualAccountCustomerInvoices: '',
    revenueAccountAccrual: '',
    accrualAccountSupplierInvoices: '',
    costAccountAccrual: ''
  },
  'billing-project': {
    projectSettings: {}
  },
  'billing-reminders': {
    reminderSettings: {}
  },
  'billing-reports': {
    reportSettings: {}
  },
  'billing-registration-view': {
    registrationViewSettings: {}
  },
  'billing-interest-invoicing': {
    interestInvoicing: {
      enabled: false
    },
    interestCalculation: {
      calculateBasedOn: 'invoice-date',
      latePaymentInterest: '8,00',
      interestFreeDays: 30
    },
    interestInvoice: {
      chargeAfterDays: 2,
      minimumInvoiceAmount: '50,00',
      filterAmount: '25,00'
    },
    interestInvoiceDetails: {
      paymentTerms: '0 days',
      invoiceFee: '25,00',
      ourReference: 'First name, Last name'
    }
  },
  'billing-printouts': {
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
  'billing-printing-service': {
    printingService: {
      enabled: false
    },
    defaultDeliveryMethod: 'Nothing selected',
    postage: 'B-mail',
    sendWithAttachment: {
      enabled: false
    },
    invoiceAttachment: ''
  },
  'billing-currency': {
    showTotalsInLists: 'Converted into SEK',
    automaticExchangeRates: false,
    currencyDeduction: '0',
    currencySurcharge: '0',
    automaticRates: [],
    manualRates: []
  },
  'billing-verification-series': {
    series: []
  }
};

function cloneDefault<T extends Record<string, unknown>>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export class BillingSettingsModel {
  static async getAllSections(foundationId: string): Promise<SectionDataMap> {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('section, data')
      .eq('foundation_id', foundationId);

    if (error) {
      throw new Error(`Failed to fetch billing settings: ${error.message}`);
    }

    const result: SectionDataMap = {
      'billing-deviations-writeoffs': cloneDefault(DEFAULT_SECTION_DATA['billing-deviations-writeoffs']),
      'billing-payment-methods-terms': cloneDefault(DEFAULT_SECTION_DATA['billing-payment-methods-terms']),
      'billing-trusted-senders-storage': cloneDefault(DEFAULT_SECTION_DATA['billing-trusted-senders-storage']),
      'billing-coverage': cloneDefault(DEFAULT_SECTION_DATA['billing-coverage']),
      'billing-digital-flow-einvoice': cloneDefault(DEFAULT_SECTION_DATA['billing-digital-flow-einvoice']),
      'billing-email-document': cloneDefault(DEFAULT_SECTION_DATA['billing-email-document']),
      'billing-labels': cloneDefault(DEFAULT_SECTION_DATA['billing-labels']),
      'billing-delivery-method-terms': cloneDefault(DEFAULT_SECTION_DATA['billing-delivery-method-terms']),
      'billing-cost-centers': cloneDefault(DEFAULT_SECTION_DATA['billing-cost-centers']),
      'billing-invoice-texts': cloneDefault(DEFAULT_SECTION_DATA['billing-invoice-texts']),
      'billing-housework': cloneDefault(DEFAULT_SECTION_DATA['billing-housework']),
      'billing-credit-warning': cloneDefault(DEFAULT_SECTION_DATA['billing-credit-warning']),
      'billing-price-list-units': cloneDefault(DEFAULT_SECTION_DATA['billing-price-list-units']),
      'billing-number-sequences-ocr': cloneDefault(DEFAULT_SECTION_DATA['billing-number-sequences-ocr']),
      'billing-vat': cloneDefault(DEFAULT_SECTION_DATA['billing-vat']),
      'billing-accruals': cloneDefault(DEFAULT_SECTION_DATA['billing-accruals']),
      'billing-project': cloneDefault(DEFAULT_SECTION_DATA['billing-project']),
      'billing-reminders': cloneDefault(DEFAULT_SECTION_DATA['billing-reminders']),
      'billing-reports': cloneDefault(DEFAULT_SECTION_DATA['billing-reports']),
      'billing-registration-view': cloneDefault(DEFAULT_SECTION_DATA['billing-registration-view']),
      'billing-interest-invoicing': cloneDefault(DEFAULT_SECTION_DATA['billing-interest-invoicing']),
      'billing-printouts': cloneDefault(DEFAULT_SECTION_DATA['billing-printouts']),
      'billing-printing-service': cloneDefault(DEFAULT_SECTION_DATA['billing-printing-service']),
      'billing-currency': cloneDefault(DEFAULT_SECTION_DATA['billing-currency']),
      'billing-verification-series': cloneDefault(DEFAULT_SECTION_DATA['billing-verification-series'])
    };

    (data as BillingSettingsRow[] | null | undefined)?.forEach((row) => {
      const sectionKey = row.section as BillingSection;
      if (sectionKey in result && row.data) {
        result[sectionKey] = { ...cloneDefault(DEFAULT_SECTION_DATA[sectionKey]), ...row.data };
      }
    });

    return result;
  }

  static async getSection(
    foundationId: string,
    section: BillingSection
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('data')
      .eq('foundation_id', foundationId)
      .eq('section', section)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch billing settings section: ${error.message}`);
    }

    const row = data as BillingSettingsRow | null;

    if (!row) {
      return cloneDefault(DEFAULT_SECTION_DATA[section]);
    }

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row.data ?? {}) };
  }

  static async upsertSection(
    foundationId: string,
    section: BillingSection,
    payload: Record<string, unknown>,
    userId: string
  ): Promise<Record<string, unknown>> {
    console.log('💾 BillingSettingsModel.upsertSection - Starting', {
      foundationId,
      section,
      payloadKeys: Object.keys(payload),
      userId
    });

    const upsertData = {
      foundation_id: foundationId,
      section,
      data: payload,
      created_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString()
    };

    console.log('💾 Upsert data:', {
      ...upsertData,
      data: JSON.stringify(payload).substring(0, 200) + '...'
    });

    const { data, error } = await supabase
      .from('billing_settings')
      .upsert(
        upsertData,
        {
          onConflict: 'foundation_id,section'
        }
      )
      .select('data')
      .single();

    if (error) {
      console.error('❌ Supabase upsert error:', error);
      throw new Error(`Failed to save billing settings: ${error.message}`);
    }

    console.log('✅ BillingSettingsModel.upsertSection - Success', {
      section,
      hasData: !!data,
      dataKeys: data ? Object.keys(data as Record<string, unknown>) : []
    });

    const row = data as BillingSettingsRow | null;

    const result = { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row?.data ?? {}) };
    console.log('📤 Returning merged data:', {
      section,
      resultKeys: Object.keys(result)
    });

    return result;
  }
}

export const BILLING_SECTIONS: BillingSection[] = [
  'billing-deviations-writeoffs',
  'billing-payment-methods-terms',
  'billing-trusted-senders-storage',
  'billing-coverage',
  'billing-digital-flow-einvoice',
  'billing-email-document',
  'billing-labels',
  'billing-delivery-method-terms',
  'billing-cost-centers',
  'billing-invoice-texts',
  'billing-housework',
  'billing-credit-warning',
  'billing-price-list-units',
  'billing-number-sequences-ocr',
  'billing-vat',
  'billing-accruals',
  'billing-project',
  'billing-reminders',
  'billing-reports',
  'billing-registration-view',
  'billing-interest-invoicing',
  'billing-printouts',
  'billing-printing-service',
  'billing-currency',
  'billing-verification-series'
];

