import { apiFetch } from '../utils/api';

export type SalarySection = 
  | 'salary-trusted-senders-storage'
  | 'salary-coverage'
  | 'salary-digital-flow-einvoice'
  | 'salary-statistics'
  | 'salary-outlay'
  | 'salary-employee'
  | 'salary-employer-certificate'
  | 'salary-certificate'
  | 'salary-accounting-settings'
  | 'salary-building-permit'
  | 'salary-collection'
  | 'salary-compensations'
  | 'salary-forums'
  | 'salary-distribution-templates'
  | 'salary-default-accounts'
  | 'salary-calendar'
  | 'salary-cost-centers'
  | 'salary-pay-slip'
  | 'salary-pay-periods'
  | 'salary-salary-year'
  | 'salary-project'
  | 'salary-financial-year'
  | 'salary-tax-employer-contributions'
  | 'salary-sorting';

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

export interface StatisticsData {
  workplaceNumberCFAR: string;
  slp: boolean;
  ssyk2012: string;
  snSalaryStatistics: boolean;
  nyk14: string;
  membershipNumberInThe: string;
  workplaceNumber: string;
  federalNumberCivilServants: string;
  contractCodeWhiteCollar: string;
  unionNumberWorkers: string;
  contractCodeWorker: string;
  klp: boolean;
  ksjU: boolean;
  sus: boolean;
  ksp: boolean;
}

export interface OutlayRow {
  id: string;
  code: string;
  name: string;
  accountNumber: string;
}

export interface OutlayData {
  rows: OutlayRow[];
}

export interface EmployeeData {
  allowRegistrationOnTransferredDays: boolean;
  allowEmployeesToChangeTasks: boolean;
}

export interface EmployerCertificateData {
  apiKey: string;
  employerId: string;
}

export interface CertificateData {
  personnelCertificate: boolean;
  certificateCalendar: boolean;
  payrollCertificate: boolean;
}

export interface AccountingSettingsData {
  postPaySlipsOnVoucher: boolean;
  postHolidayDebt: boolean;
  postEmployerContributionsPerPaySlip: boolean;
  postVacationDebtOnProjects: boolean;
  postBenefits: boolean;
  postVacationDebtToCostCenter: boolean;
}

export interface BuildingPermitData {
  useConstructionPermit: boolean;
  contractArea: string;
  countyAndMunicipality: string;
}

export interface CollectionData {
  itpCartoon: boolean;
  itpCostCenter: string;
  itpType: string;
  itp1ProductTime: string;
  itp2ProductTime: string;
  itp2FixedAnnualSalaryPaidMonthly: string;
  itp2FixedAnnualSalaryHourlyPaid: string;
}

export interface CompensationsData {
  mileageReimbursement: string;
  mileageReimbursementForCompany: string;
  mileageReimbursementForCompanySecond: string;
  mileageReimbursementFor: string;
  extraSickPayFor: string;
}

export interface ForumsData {
  foresigned: boolean;
  foraAgreementNumberAnnual: string;
  markups: string[];
}

export interface DistributionTemplateRow {
  id: string;
  accountNumber: string;
  costCenter: string;
  project: string;
  percent: string;
}

export interface DistributionTemplatesData {
  selectedTemplate: string;
  name: string;
  accountNumberToggle: boolean;
  costCenterToggle: boolean;
  projectToggle: boolean;
  rows: DistributionTemplateRow[];
}

export interface DefaultAccountsData {
  debtStaffWithholdingTaxes: string;
  debtSocialSecurityContributions: string;
  costEmployerContributions: string;
  costWagesWorkers: string;
  costSalaryCivilServant: string;
  sickPayWorkers: string;
  sickPayCivilServant: string;
  inputVAT: string;
  outputVAT: string;
  inputReverseChargeVAT: string;
  outputReverseChargeVAT: string;
  obsAccount: string;
  pennyRounding: string;
  otherNetCompensation: string;
  cashPayment: string;
  paymentFromBank: string;
  benefit: string;
  counterBookingBenefit: string;
  net: string;
  tradeFee: string;
  advance: string;
  personalLoans: string;
  attachmentOfWages: string;
  taxFreeAllowance: string;
  allowanceTaxable: string;
  foreignAllowancesTaxFree: string;
  expatriateAllowanceTaxable: string;
  mileageReimbursementTaxFree: string;
  mileageReimbursementTaxable: string;
  entertainmentDeductible: string;
  entertainmentNotDeductible: string;
  mealReduction: string;
  dividendInterest: string;
  taxOnDividendsInterest: string;
}

export interface CalendarData {
  automaticRegistrationNonWorkingDays: boolean;
  absenceBasedZeroSchedule: boolean;
}

export interface CostCentersData {
  enableCostCenterSupport: boolean;
  includeCostCenterWhenTabEntering: boolean;
}

export interface PaySlipData {
  senderName: string;
  senderEmail: string;
  senderTitle: string;
  senderPhone: string;
  numberOfDaysBeforePayoutDate: string;
}

export interface PayPeriodEntry {
  id: string;
  period: string;
  name: string;
  paymentDate: string;
  deviationPeriod: string;
  payPeriod: string;
  created: string;
}

export interface PayPeriodsData {
  periods: PayPeriodEntry[];
}

export interface SalaryYearData {
  years: string[];
}

export interface ProjectData {
  enableSupportForProjectAccounting: boolean;
  includeProjectsOnTabEnterInput: boolean;
}

export interface FinancialYearEntry {
  id: string;
  fromDate: string;
  toDate: string;
  accountingMethod: 'Billing method' | 'The cash method';
  accountChart: string;
  isPreselected: boolean;
  openAtLogin: boolean;
}

export interface FinancialYearData {
  createFiscalYearsAutomatically: boolean;
  years: FinancialYearEntry[];
}

export interface TaxEmployerContributionsData {
  calculationOfPreliminaryTax: string;
  normalTaxTable: string;
  specificationNumberAgi: string;
  workplaceNumberAgi: string;
  useAgiFrom2018: boolean;
  employerContributionLimitAthlete: boolean;
  useRegionalAidDeductions: boolean;
  useDiscountRAndD: boolean;
  growthSupportFirstEmployee: boolean;
  firstEmployee: string;
  growSupportUntilFirst: string;
  growthSupportOtherEmployees: boolean;
  secondEmployee: string;
  growSupportUntilSecond: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SortingData {
  numericEmployeeIds: boolean;
  schemaIdNumericSorting: boolean;
}

export interface SalarySettingsData {
  'salary-trusted-senders-storage': TrustedSendersStorageData;
  'salary-coverage': CoverageData;
  'salary-digital-flow-einvoice': DigitalFlowEInvoiceData;
  'salary-statistics': StatisticsData;
  'salary-outlay': OutlayData;
  'salary-employee': EmployeeData;
  'salary-employer-certificate': EmployerCertificateData;
  'salary-certificate': CertificateData;
  'salary-accounting-settings': AccountingSettingsData;
  'salary-building-permit': BuildingPermitData;
  'salary-collection': CollectionData;
  'salary-compensations': CompensationsData;
  'salary-forums': ForumsData;
  'salary-distribution-templates': DistributionTemplatesData;
  'salary-default-accounts': DefaultAccountsData;
  'salary-calendar': CalendarData;
  'salary-cost-centers': CostCentersData;
  'salary-pay-slip': PaySlipData;
  'salary-pay-periods': PayPeriodsData;
  'salary-salary-year': SalaryYearData;
  'salary-project': ProjectData;
  'salary-financial-year': FinancialYearData;
  'salary-tax-employer-contributions': TaxEmployerContributionsData;
  'salary-sorting': SortingData;
}

export const salarySettingsService = {
  /**
   * Get all salary settings sections
   */
  async getAllSections(): Promise<SalarySettingsData> {
    try {
      const res = await apiFetch('/api/settings/salary');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch salary settings' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to fetch salary settings`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to fetch salary settings');
      }
      return json.data as SalarySettingsData;
    } catch (error) {
      console.error('Error in getAllSections:', error);
      throw error;
    }
  },

  /**
   * Get a specific salary settings section
   */
  async getSection(section: SalarySection): Promise<Record<string, unknown>> {
    try {
      const res = await apiFetch(`/api/settings/salary/${section}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch salary section' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to fetch salary section`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to fetch salary section');
      }
      return json.data as Record<string, unknown>;
    } catch (error) {
      console.error('Error in getSection:', error);
      throw error;
    }
  },

  /**
   * Save a salary settings section
   */
  async saveSection(section: SalarySection, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const res = await apiFetch(`/api/settings/salary/${section}`, {
        method: 'PUT',
        json: data
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to save salary settings' }));
        throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Failed to save salary settings`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || json.error || 'Failed to save salary settings');
      }
      return json.data as Record<string, unknown>;
    } catch (error) {
      console.error('Error in saveSection:', error);
      throw error;
    }
  },

  /**
   * Get trusted senders & storage settings
   */
  async getTrustedSendersStorage(): Promise<TrustedSendersStorageData> {
    const data = await this.getSection('salary-trusted-senders-storage');
    return data as unknown as TrustedSendersStorageData;
  },

  /**
   * Save trusted senders & storage settings
   */
  async saveTrustedSendersStorage(settings: TrustedSendersStorageData): Promise<TrustedSendersStorageData> {
    const data = await this.saveSection('salary-trusted-senders-storage', settings as unknown as unknown as Record<string, unknown>);
    return data as unknown as TrustedSendersStorageData;
  },

  /**
   * Get coverage settings
   */
  async getCoverage(): Promise<CoverageData> {
    const data = await this.getSection('salary-coverage');
    return data as unknown as CoverageData;
  },

  /**
   * Save coverage settings
   */
  async saveCoverage(settings: CoverageData): Promise<CoverageData> {
    const data = await this.saveSection('salary-coverage', settings as unknown as unknown as Record<string, unknown>);
    return data as unknown as CoverageData;
  },

  /**
   * Get digital flow e-invoice settings
   */
  async getDigitalFlowEInvoice(): Promise<DigitalFlowEInvoiceData> {
    const data = await this.getSection('salary-digital-flow-einvoice');
    return data as unknown as DigitalFlowEInvoiceData;
  },

  /**
   * Save digital flow e-invoice settings
   */
  async saveDigitalFlowEInvoice(settings: DigitalFlowEInvoiceData): Promise<DigitalFlowEInvoiceData> {
    const data = await this.saveSection('salary-digital-flow-einvoice', settings as unknown as Record<string, unknown>);
    return data as unknown as DigitalFlowEInvoiceData;
  },

  /**
   * Get statistics settings
   */
  async getStatistics(): Promise<StatisticsData> {
    const data = await this.getSection('salary-statistics');
    return data as unknown as StatisticsData;
  },

  /**
   * Save statistics settings
   */
  async saveStatistics(settings: StatisticsData): Promise<StatisticsData> {
    const data = await this.saveSection('salary-statistics', settings as unknown as Record<string, unknown>);
    return data as unknown as StatisticsData;
  },

  /**
   * Get outlay settings
   */
  async getOutlay(): Promise<OutlayData> {
    const data = await this.getSection('salary-outlay');
    return data as unknown as OutlayData;
  },

  /**
   * Save outlay settings
   */
  async saveOutlay(settings: OutlayData): Promise<OutlayData> {
    const data = await this.saveSection('salary-outlay', settings as unknown as Record<string, unknown>);
    return data as unknown as OutlayData;
  },

  /**
   * Get employee settings
   */
  async getEmployee(): Promise<EmployeeData> {
    const data = await this.getSection('salary-employee');
    return data as unknown as EmployeeData;
  },

  /**
   * Save employee settings
   */
  async saveEmployee(settings: EmployeeData): Promise<EmployeeData> {
    const data = await this.saveSection('salary-employee', settings as unknown as Record<string, unknown>);
    return data as unknown as EmployeeData;
  },

  /**
   * Get employer certificate settings
   */
  async getEmployerCertificate(): Promise<EmployerCertificateData> {
    const data = await this.getSection('salary-employer-certificate');
    return data as unknown as EmployerCertificateData;
  },

  /**
   * Save employer certificate settings
   */
  async saveEmployerCertificate(settings: EmployerCertificateData): Promise<EmployerCertificateData> {
    const data = await this.saveSection('salary-employer-certificate', settings as unknown as Record<string, unknown>);
    return data as unknown as EmployerCertificateData;
  },

  /**
   * Get certificate settings
   */
  async getCertificate(): Promise<CertificateData> {
    const data = await this.getSection('salary-certificate');
    return data as unknown as CertificateData;
  },

  /**
   * Save certificate settings
   */
  async saveCertificate(settings: CertificateData): Promise<CertificateData> {
    const data = await this.saveSection('salary-certificate', settings as unknown as Record<string, unknown>);
    return data as unknown as CertificateData;
  },

  /**
   * Get accounting settings
   */
  async getAccountingSettings(): Promise<AccountingSettingsData> {
    const data = await this.getSection('salary-accounting-settings');
    return data as unknown as AccountingSettingsData;
  },

  /**
   * Save accounting settings
   */
  async saveAccountingSettings(settings: AccountingSettingsData): Promise<AccountingSettingsData> {
    const data = await this.saveSection('salary-accounting-settings', settings as unknown as Record<string, unknown>);
    return data as unknown as AccountingSettingsData;
  },

  /**
   * Get building permit settings
   */
  async getBuildingPermit(): Promise<BuildingPermitData> {
    const data = await this.getSection('salary-building-permit');
    return data as unknown as BuildingPermitData;
  },

  /**
   * Save building permit settings
   */
  async saveBuildingPermit(settings: BuildingPermitData): Promise<BuildingPermitData> {
    const data = await this.saveSection('salary-building-permit', settings as unknown as Record<string, unknown>);
    return data as unknown as BuildingPermitData;
  },

  /**
   * Get collection settings
   */
  async getCollection(): Promise<CollectionData> {
    const data = await this.getSection('salary-collection');
    return data as unknown as CollectionData;
  },

  /**
   * Save collection settings
   */
  async saveCollection(settings: CollectionData): Promise<CollectionData> {
    const data = await this.saveSection('salary-collection', settings as unknown as Record<string, unknown>);
    return data as unknown as CollectionData;
  },

  /**
   * Get compensations settings
   */
  async getCompensations(): Promise<CompensationsData> {
    const data = await this.getSection('salary-compensations');
    return data as unknown as CompensationsData;
  },

  /**
   * Save compensations settings
   */
  async saveCompensations(settings: CompensationsData): Promise<CompensationsData> {
    const data = await this.saveSection('salary-compensations', settings as unknown as Record<string, unknown>);
    return data as unknown as CompensationsData;
  },

  /**
   * Get forums settings
   */
  async getForums(): Promise<ForumsData> {
    const data = await this.getSection('salary-forums');
    return data as unknown as ForumsData;
  },

  /**
   * Save forums settings
   */
  async saveForums(settings: ForumsData): Promise<ForumsData> {
    const data = await this.saveSection('salary-forums', settings as unknown as Record<string, unknown>);
    return data as unknown as ForumsData;
  },

  /**
   * Get distribution templates settings
   */
  async getDistributionTemplates(): Promise<DistributionTemplatesData> {
    const data = await this.getSection('salary-distribution-templates');
    return data as unknown as DistributionTemplatesData;
  },

  /**
   * Save distribution templates settings
   */
  async saveDistributionTemplates(settings: DistributionTemplatesData): Promise<DistributionTemplatesData> {
    const data = await this.saveSection('salary-distribution-templates', settings as unknown as Record<string, unknown>);
    return data as unknown as DistributionTemplatesData;
  },

  /**
   * Get default accounts settings
   */
  async getDefaultAccounts(): Promise<DefaultAccountsData> {
    const data = await this.getSection('salary-default-accounts');
    return data as unknown as DefaultAccountsData;
  },

  /**
   * Save default accounts settings
   */
  async saveDefaultAccounts(settings: DefaultAccountsData): Promise<DefaultAccountsData> {
    const data = await this.saveSection('salary-default-accounts', settings as unknown as Record<string, unknown>);
    return data as unknown as DefaultAccountsData;
  },

  /**
   * Get calendar settings
   */
  async getCalendar(): Promise<CalendarData> {
    const data = await this.getSection('salary-calendar');
    return data as unknown as CalendarData;
  },

  /**
   * Save calendar settings
   */
  async saveCalendar(settings: CalendarData): Promise<CalendarData> {
    const data = await this.saveSection('salary-calendar', settings as unknown as Record<string, unknown>);
    return data as unknown as CalendarData;
  },

  /**
   * Get cost centers settings
   */
  async getCostCenters(): Promise<CostCentersData> {
    const data = await this.getSection('salary-cost-centers');
    return data as unknown as CostCentersData;
  },

  /**
   * Save cost centers settings
   */
  async saveCostCenters(settings: CostCentersData): Promise<CostCentersData> {
    const data = await this.saveSection('salary-cost-centers', settings as unknown as Record<string, unknown>);
    return data as unknown as CostCentersData;
  },

  /**
   * Get pay slip settings
   */
  async getPaySlip(): Promise<PaySlipData> {
    const data = await this.getSection('salary-pay-slip');
    return data as unknown as PaySlipData;
  },

  /**
   * Save pay slip settings
   */
  async savePaySlip(settings: PaySlipData): Promise<PaySlipData> {
    const data = await this.saveSection('salary-pay-slip', settings as unknown as Record<string, unknown>);
    return data as unknown as PaySlipData;
  },

  /**
   * Get pay periods settings
   */
  async getPayPeriods(): Promise<PayPeriodsData> {
    const data = await this.getSection('salary-pay-periods');
    return data as unknown as PayPeriodsData;
  },

  /**
   * Save pay periods settings
   */
  async savePayPeriods(settings: PayPeriodsData): Promise<PayPeriodsData> {
    const data = await this.saveSection('salary-pay-periods', settings as unknown as Record<string, unknown>);
    return data as unknown as PayPeriodsData;
  },

  /**
   * Get salary year settings
   */
  async getSalaryYear(): Promise<SalaryYearData> {
    const data = await this.getSection('salary-salary-year');
    return data as unknown as SalaryYearData;
  },

  /**
   * Save salary year settings
   */
  async saveSalaryYear(settings: SalaryYearData): Promise<SalaryYearData> {
    const data = await this.saveSection('salary-salary-year', settings as unknown as Record<string, unknown>);
    return data as unknown as SalaryYearData;
  },

  /**
   * Get project settings
   */
  async getProject(): Promise<ProjectData> {
    const data = await this.getSection('salary-project');
    return data as unknown as ProjectData;
  },

  /**
   * Save project settings
   */
  async saveProject(settings: ProjectData): Promise<ProjectData> {
    const data = await this.saveSection('salary-project', settings as unknown as Record<string, unknown>);
    return data as unknown as ProjectData;
  },

  /**
   * Get financial year settings
   */
  async getFinancialYear(): Promise<FinancialYearData> {
    const data = await this.getSection('salary-financial-year');
    return data as unknown as FinancialYearData;
  },

  /**
   * Save financial year settings
   */
  async saveFinancialYear(settings: FinancialYearData): Promise<FinancialYearData> {
    const data = await this.saveSection('salary-financial-year', settings as unknown as Record<string, unknown>);
    return data as unknown as FinancialYearData;
  },

  /**
   * Get tax and employer contributions settings
   */
  async getTaxEmployerContributions(): Promise<TaxEmployerContributionsData> {
    const data = await this.getSection('salary-tax-employer-contributions');
    return data as unknown as TaxEmployerContributionsData;
  },

  /**
   * Save tax and employer contributions settings
   */
  async saveTaxEmployerContributions(settings: TaxEmployerContributionsData): Promise<TaxEmployerContributionsData> {
    const data = await this.saveSection('salary-tax-employer-contributions', settings as unknown as Record<string, unknown>);
    return data as unknown as TaxEmployerContributionsData;
  },

  /**
   * Get sorting settings
   */
  async getSorting(): Promise<SortingData> {
    const data = await this.getSection('salary-sorting');
    return data as unknown as SortingData;
  },

  /**
   * Save sorting settings
   */
  async saveSorting(settings: SortingData): Promise<SortingData> {
    const data = await this.saveSection('salary-sorting', settings as unknown as Record<string, unknown>);
    return data as unknown as SortingData;
  }
};

