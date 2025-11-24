import { apiFetch } from '../utils/api';

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

export interface DeviationsWriteoffItem {
  id: string;
  code: string;
  name: string;
  application: string;
  account: string;
}

export interface PaymentMethod {
  id: string;
  code: string;
  text: string;
  account: string;
}

export interface PaymentTerm {
  id: string;
  code: string;
  text: string;
  preselected: boolean;
  reminder: boolean;
}

export interface TrustedSendersStorageData {
  email_function_enabled: boolean;
  storage_used_mb: number;
  storage_total_mb: number;
  trusted_domains: string[];
  trusted_email_addresses: string[];
  rejected_email_addresses: string[];
}

export interface CoverageData {
  coverageEnabled: boolean;
}

export interface DigitalFlowEInvoiceData {
  einvoiceEnabled: boolean;
  einvoiceProvider: string;
  einvoiceSettings: Record<string, unknown>;
}

export interface EmailDocumentData {
  invoice: {
    sender: string;
    replyAddress: string;
    subject: string;
    text: string;
  };
  reminder: {
    sender: string;
    replyAddress: string;
    subject: string;
    text: string;
  };
}

export interface LabelsData {
  enableSupportForLabels: boolean;
  labels: Array<{ id: string; label: string }>;
}

export interface DeliveryMethodTermsData {
  deliveryMethods: Array<{ id: string; code: string; text: string; textEnglish: string }>;
  deliveryTerms: Array<{ id: string; code: string; text: string; textEnglish: string }>;
}

export interface CostCentersData {
  enableCostCenterSupport: boolean;
  includeCostCenterWhenTabEntering: boolean;
}

export interface InvoiceTextsData {
  code: string;
  text: string;
  useAsDefault: boolean;
}

export interface HouseworkData {
  houseworkEnabled: boolean;
  suggestType: string;
}

export interface CreditWarningData {
  creditWarningEnabled: boolean;
  warningLimit: string;
}

export interface PriceList {
  id: string;
  code: string;
  name: string;
  comment: string;
  preselected: boolean;
}

export interface Unit {
  id: string;
  code: string;
  codeEng: string;
  text: string;
}

export interface PriceListUnitsData {
  priceLists: PriceList[];
  units: Unit[];
}

export interface NumberSequencesOCRData {
  customerInvoice: string;
  offer: string;
  order: string;
  supplierInvoice: string;
  ocrOnCustomerInvoices: boolean;
  externalInvoiceReference: boolean;
}

export interface VATEntry {
  id: string;
  vatCode: string;
  description: string;
  vatRate: string;
  validFrom: string;
  validTo: string;
  isDeletable: boolean;
}

export interface VATSettings {
  vatType: string;
  about: string;
  proposeVatOnSupplierInvoices: string;
  incomingInvoicesAction: 'proposed' | 'interpret' | 'ignore';
  outputVATEntries: VATEntry[];
}

export interface VATData {
  settings: VATSettings;
}

export interface AccrualsData {
  enableSupportForAccruals: boolean;
  minimumAccrualAmount: string;
  accountingDate: string;
  everyMonthThe: string;
  everyMonthThePeriod: string;
  supplierInvoicesVAT: string;
  supplierInvoicesVATEnabled: boolean;
  customerInvoicesVAT: string;
  customerInvoicesVATEnabled: boolean;
  accrualCustomerInvoices: string;
  accrualSupplierInvoices: string;
  accrualAccountCustomerInvoices: string;
  revenueAccountAccrual: string;
  accrualAccountSupplierInvoices: string;
  costAccountAccrual: string;
}

export interface ProjectData {
  projectSettings: Record<string, unknown>;
}

export interface RemindersData {
  reminderSettings: Record<string, unknown>;
}

export interface ReportsData {
  reportSettings: Record<string, unknown>;
}

export interface RegistrationViewData {
  registrationViewSettings: Record<string, unknown>;
}

export interface BillingSettingsData {
  'billing-deviations-writeoffs': {
    deviations: DeviationsWriteoffItem[];
  };
  'billing-payment-methods-terms': {
    paymentMethods: PaymentMethod[];
    paymentTerms: PaymentTerm[];
  };
  'billing-trusted-senders-storage': TrustedSendersStorageData;
  'billing-coverage': CoverageData;
  'billing-digital-flow-einvoice': DigitalFlowEInvoiceData;
  'billing-email-document': EmailDocumentData;
  'billing-labels': LabelsData;
  'billing-delivery-method-terms': DeliveryMethodTermsData;
  'billing-cost-centers': CostCentersData;
  'billing-invoice-texts': InvoiceTextsData;
  'billing-housework': HouseworkData;
  'billing-credit-warning': CreditWarningData;
  'billing-price-list-units': PriceListUnitsData;
  'billing-number-sequences-ocr': NumberSequencesOCRData;
  'billing-vat': VATData;
  'billing-accruals': AccrualsData;
  'billing-project': ProjectData;
  'billing-reminders': RemindersData;
  'billing-reports': ReportsData;
  'billing-registration-view': RegistrationViewData;
}

export const billingSettingsService = {
  /**
   * Get all billing settings sections
   */
  async getAllSections(): Promise<BillingSettingsData> {
    try {
      const res = await apiFetch('/api/settings/billing');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch billing settings' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to fetch billing settings`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to fetch billing settings');
      }
      return json.data as BillingSettingsData;
    } catch (error) {
      console.error('Error in getAllSections:', error);
      throw error;
    }
  },

  /**
   * Get a specific billing settings section
   */
  async getSection(section: BillingSection): Promise<any> {
    try {
      const res = await apiFetch(`/api/settings/billing/${section}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch billing section' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to fetch billing section`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to fetch billing section');
      }
      return json.data;
    } catch (error) {
      console.error('Error in getSection:', error);
      throw error;
    }
  },

  /**
   * Save a billing settings section
   */
  async saveSection(section: BillingSection, data: any): Promise<any> {
    try {
      const res = await apiFetch(`/api/settings/billing/${section}`, {
        method: 'PUT',
        json: data
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to save billing settings' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to save billing settings`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to save billing settings');
      }
      return json.data;
    } catch (error) {
      console.error('Error in saveSection:', error);
      throw error;
    }
  },

  /**
   * Get deviations/writeoffs settings
   */
  async getDeviationsWriteoffs(): Promise<{ deviations: DeviationsWriteoffItem[] }> {
    const data = await this.getSection('billing-deviations-writeoffs');
    return data as { deviations: DeviationsWriteoffItem[] };
  },

  /**
   * Save deviations/writeoffs settings
   */
  async saveDeviationsWriteoffs(deviations: DeviationsWriteoffItem[]): Promise<{ deviations: DeviationsWriteoffItem[] }> {
    const data = await this.saveSection('billing-deviations-writeoffs', { deviations });
    return data as { deviations: DeviationsWriteoffItem[] };
  },

  /**
   * Get payment methods and terms settings
   */
  async getPaymentMethodsTerms(): Promise<{ paymentMethods: PaymentMethod[]; paymentTerms: PaymentTerm[] }> {
    const data = await this.getSection('billing-payment-methods-terms');
    return data as { paymentMethods: PaymentMethod[]; paymentTerms: PaymentTerm[] };
  },

  /**
   * Save payment methods and terms settings
   */
  async savePaymentMethodsTerms(paymentMethods: PaymentMethod[], paymentTerms: PaymentTerm[]): Promise<{ paymentMethods: PaymentMethod[]; paymentTerms: PaymentTerm[] }> {
    const data = await this.saveSection('billing-payment-methods-terms', { paymentMethods, paymentTerms });
    return data as { paymentMethods: PaymentMethod[]; paymentTerms: PaymentTerm[] };
  },

  /**
   * Get trusted senders & storage settings
   */
  async getTrustedSendersStorage(): Promise<TrustedSendersStorageData> {
    const data = await this.getSection('billing-trusted-senders-storage');
    return data as TrustedSendersStorageData;
  },

  /**
   * Save trusted senders & storage settings
   */
  async saveTrustedSendersStorage(settings: TrustedSendersStorageData): Promise<TrustedSendersStorageData> {
    const data = await this.saveSection('billing-trusted-senders-storage', settings);
    return data as TrustedSendersStorageData;
  },

  /**
   * Get coverage settings
   */
  async getCoverage(): Promise<CoverageData> {
    const data = await this.getSection('billing-coverage');
    return data as CoverageData;
  },

  /**
   * Save coverage settings
   */
  async saveCoverage(settings: CoverageData): Promise<CoverageData> {
    const data = await this.saveSection('billing-coverage', settings);
    return data as CoverageData;
  },

  /**
   * Get digital flow e-invoice settings
   */
  async getDigitalFlowEInvoice(): Promise<DigitalFlowEInvoiceData> {
    const data = await this.getSection('billing-digital-flow-einvoice');
    return data as DigitalFlowEInvoiceData;
  },

  /**
   * Save digital flow e-invoice settings
   */
  async saveDigitalFlowEInvoice(settings: DigitalFlowEInvoiceData): Promise<DigitalFlowEInvoiceData> {
    const data = await this.saveSection('billing-digital-flow-einvoice', settings);
    return data as DigitalFlowEInvoiceData;
  },

  /**
   * Get email document settings
   */
  async getEmailDocument(): Promise<EmailDocumentData> {
    const data = await this.getSection('billing-email-document');
    return data as EmailDocumentData;
  },

  /**
   * Save email document settings
   */
  async saveEmailDocument(settings: EmailDocumentData): Promise<EmailDocumentData> {
    const data = await this.saveSection('billing-email-document', settings);
    return data as EmailDocumentData;
  },

  /**
   * Get labels settings
   */
  async getLabels(): Promise<LabelsData> {
    const data = await this.getSection('billing-labels');
    return data as LabelsData;
  },

  /**
   * Save labels settings
   */
  async saveLabels(settings: LabelsData): Promise<LabelsData> {
    const data = await this.saveSection('billing-labels', settings);
    return data as LabelsData;
  },

  /**
   * Get delivery method and terms settings
   */
  async getDeliveryMethodTerms(): Promise<DeliveryMethodTermsData> {
    const data = await this.getSection('billing-delivery-method-terms');
    return data as DeliveryMethodTermsData;
  },

  /**
   * Save delivery method and terms settings
   */
  async saveDeliveryMethodTerms(settings: DeliveryMethodTermsData): Promise<DeliveryMethodTermsData> {
    const data = await this.saveSection('billing-delivery-method-terms', settings);
    return data as DeliveryMethodTermsData;
  },

  /**
   * Get cost centers settings
   */
  async getCostCenters(): Promise<CostCentersData> {
    const data = await this.getSection('billing-cost-centers');
    return data as CostCentersData;
  },

  /**
   * Save cost centers settings
   */
  async saveCostCenters(settings: CostCentersData): Promise<CostCentersData> {
    const data = await this.saveSection('billing-cost-centers', settings);
    return data as CostCentersData;
  },

  /**
   * Get invoice texts settings
   */
  async getInvoiceTexts(): Promise<InvoiceTextsData> {
    const data = await this.getSection('billing-invoice-texts');
    return data as InvoiceTextsData;
  },

  /**
   * Save invoice texts settings
   */
  async saveInvoiceTexts(settings: InvoiceTextsData): Promise<InvoiceTextsData> {
    const data = await this.saveSection('billing-invoice-texts', settings);
    return data as InvoiceTextsData;
  },

  /**
   * Get housework settings
   */
  async getHousework(): Promise<HouseworkData> {
    const data = await this.getSection('billing-housework');
    return data as HouseworkData;
  },

  /**
   * Save housework settings
   */
  async saveHousework(settings: HouseworkData): Promise<HouseworkData> {
    const data = await this.saveSection('billing-housework', settings);
    return data as HouseworkData;
  },

  /**
   * Get credit warning settings
   */
  async getCreditWarning(): Promise<CreditWarningData> {
    const data = await this.getSection('billing-credit-warning');
    return data as CreditWarningData;
  },

  /**
   * Save credit warning settings
   */
  async saveCreditWarning(settings: CreditWarningData): Promise<CreditWarningData> {
    const data = await this.saveSection('billing-credit-warning', settings);
    return data as CreditWarningData;
  },

  /**
   * Get price list and units settings
   */
  async getPriceListUnits(): Promise<PriceListUnitsData> {
    const data = await this.getSection('billing-price-list-units');
    return data as PriceListUnitsData;
  },

  /**
   * Save price list and units settings
   */
  async savePriceListUnits(settings: PriceListUnitsData): Promise<PriceListUnitsData> {
    const data = await this.saveSection('billing-price-list-units', settings);
    return data as PriceListUnitsData;
  },

  /**
   * Get number sequences and OCR settings
   */
  async getNumberSequencesOCR(): Promise<NumberSequencesOCRData> {
    const data = await this.getSection('billing-number-sequences-ocr');
    return data as NumberSequencesOCRData;
  },

  /**
   * Save number sequences and OCR settings
   */
  async saveNumberSequencesOCR(settings: NumberSequencesOCRData): Promise<NumberSequencesOCRData> {
    const data = await this.saveSection('billing-number-sequences-ocr', settings);
    return data as NumberSequencesOCRData;
  },

  /**
   * Get VAT settings
   */
  async getVAT(): Promise<VATData> {
    const data = await this.getSection('billing-vat');
    return data as VATData;
  },

  /**
   * Save VAT settings
   */
  async saveVAT(settings: VATData): Promise<VATData> {
    const data = await this.saveSection('billing-vat', settings);
    return data as VATData;
  },

  /**
   * Get accruals settings
   */
  async getAccruals(): Promise<AccrualsData> {
    const data = await this.getSection('billing-accruals');
    return data as AccrualsData;
  },

  /**
   * Save accruals settings
   */
  async saveAccruals(settings: AccrualsData): Promise<AccrualsData> {
    const data = await this.saveSection('billing-accruals', settings);
    return data as AccrualsData;
  },

  /**
   * Get project settings
   */
  async getProject(): Promise<ProjectData> {
    const data = await this.getSection('billing-project');
    return data as ProjectData;
  },

  /**
   * Save project settings
   */
  async saveProject(settings: ProjectData): Promise<ProjectData> {
    const data = await this.saveSection('billing-project', settings);
    return data as ProjectData;
  },

  /**
   * Get reminders settings
   */
  async getReminders(): Promise<RemindersData> {
    const data = await this.getSection('billing-reminders');
    return data as RemindersData;
  },

  /**
   * Save reminders settings
   */
  async saveReminders(settings: RemindersData): Promise<RemindersData> {
    const data = await this.saveSection('billing-reminders', settings);
    return data as RemindersData;
  },

  /**
   * Get reports settings
   */
  async getReports(): Promise<ReportsData> {
    const data = await this.getSection('billing-reports');
    return data as ReportsData;
  },

  /**
   * Save reports settings
   */
  async saveReports(settings: ReportsData): Promise<ReportsData> {
    const data = await this.saveSection('billing-reports', settings);
    return data as ReportsData;
  },

  /**
   * Get registration view settings
   */
  async getRegistrationView(): Promise<RegistrationViewData> {
    const data = await this.getSection('billing-registration-view');
    return data as RegistrationViewData;
  },

  /**
   * Save registration view settings
   */
  async saveRegistrationView(settings: RegistrationViewData): Promise<RegistrationViewData> {
    const data = await this.saveSection('billing-registration-view', settings);
    return data as RegistrationViewData;
  },

  /**
   * Get financial year settings
   */
  async getFinancialYear(): Promise<{ settings: Record<string, unknown>; years: Array<Record<string, unknown>> }> {
    const res = await apiFetch('/api/settings/financial-year');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to fetch financial year settings' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to fetch financial year settings`);
    }
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || json.error || 'Failed to fetch financial year settings');
    }
    return json.data as { settings: Record<string, unknown>; years: Array<Record<string, unknown>> };
  },

  /**
   * Save financial year settings
   */
  async saveFinancialYear(settings: Record<string, unknown>): Promise<{ settings: Record<string, unknown>; years: Array<Record<string, unknown>> }> {
    const res = await apiFetch('/api/settings/financial-year', {
      method: 'PUT',
      json: settings
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to save financial year settings' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to save financial year settings`);
    }
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || json.error || 'Failed to save financial year settings');
    }
    return json.data as { settings: Record<string, unknown>; years: Array<Record<string, unknown>> };
  },

  /**
   * Create a financial year
   */
  async createFinancialYear(yearData: {
    fromDate: string;
    toDate: string;
    accountingMethod?: string;
    accountChart?: string;
    openAtLogin?: boolean;
    isPreselected?: boolean;
  }): Promise<Record<string, unknown>> {
    const res = await apiFetch('/api/settings/financial-year/years', {
      method: 'POST',
      json: {
        from_date: yearData.fromDate,
        to_date: yearData.toDate,
        accounting_method: yearData.accountingMethod || null,
        account_chart: yearData.accountChart || null,
        open_at_login: yearData.openAtLogin || false,
        is_preselected: yearData.isPreselected || false
      }
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to create financial year' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to create financial year`);
    }
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || json.error || 'Failed to create financial year');
    }
    return json.data as Record<string, unknown>;
  },

  /**
   * Update a financial year
   */
  async updateFinancialYear(id: string, yearData: {
    fromDate: string;
    toDate: string;
    accountingMethod?: string;
    accountChart?: string;
    openAtLogin?: boolean;
    isPreselected?: boolean;
  }): Promise<Record<string, unknown>> {
    const res = await apiFetch(`/api/settings/financial-year/years/${id}`, {
      method: 'PUT',
      json: {
        from_date: yearData.fromDate,
        to_date: yearData.toDate,
        accounting_method: yearData.accountingMethod || null,
        account_chart: yearData.accountChart || null,
        open_at_login: yearData.openAtLogin || false,
        is_preselected: yearData.isPreselected || false
      }
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to update financial year' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to update financial year`);
    }
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || json.error || 'Failed to update financial year');
    }
    return json.data as Record<string, unknown>;
  },

  /**
   * Delete a financial year
   */
  async deleteFinancialYear(id: string): Promise<void> {
    const res = await apiFetch(`/api/settings/financial-year/years/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Failed to delete financial year' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to delete financial year`);
    }
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || json.error || 'Failed to delete financial year');
    }
  },

  /**
   * Get interest invoicing settings
   */
  async getInterestInvoicing(): Promise<Record<string, unknown>> {
    const data = await this.getSection('billing-interest-invoicing' as BillingSection);
    return data;
  },

  /**
   * Save interest invoicing settings
   */
  async saveInterestInvoicing(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await this.saveSection('billing-interest-invoicing' as BillingSection, settings);
    return data;
  },

  /**
   * Get printouts settings
   */
  async getPrintouts(): Promise<Record<string, unknown>> {
    const data = await this.getSection('billing-printouts' as BillingSection);
    return data;
  },

  /**
   * Save printouts settings
   */
  async savePrintouts(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await this.saveSection('billing-printouts' as BillingSection, settings);
    return data;
  },

  /**
   * Get printing service settings
   */
  async getPrintingService(): Promise<Record<string, unknown>> {
    const data = await this.getSection('billing-printing-service' as BillingSection);
    return data;
  },

  /**
   * Save printing service settings
   */
  async savePrintingService(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await this.saveSection('billing-printing-service' as BillingSection, settings);
    return data;
  },

  /**
   * Get currency settings
   */
  async getCurrency(): Promise<Record<string, unknown>> {
    const data = await this.getSection('billing-currency' as BillingSection);
    return data;
  },

  /**
   * Save currency settings
   */
  async saveCurrency(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = await this.saveSection('billing-currency' as BillingSection, settings);
    return data;
  },

  /**
   * Get verification series settings
   */
  async getVerificationSeries(): Promise<{ series: Array<Record<string, unknown>> }> {
    const data = await this.getSection('billing-verification-series' as BillingSection);
    return data as { series: Array<Record<string, unknown>> };
  },

  /**
   * Save verification series settings
   */
  async saveVerificationSeries(settings: { series: Array<Record<string, unknown>> }): Promise<{ series: Array<Record<string, unknown>> }> {
    const data = await this.saveSection('billing-verification-series' as BillingSection, settings);
    return data as { series: Array<Record<string, unknown>> };
  }
};

