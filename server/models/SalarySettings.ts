import { supabase } from '../config/database';

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

export interface SalarySettingsRow {
  id?: string;
  foundation_id: string;
  section: string;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

type SectionDataMap = Record<SalarySection, Record<string, unknown>>;

const DEFAULT_SECTION_DATA: SectionDataMap = {
  'salary-trusted-senders-storage': {
    email_function_enabled: true,
    storage_used_mb: 0,
    storage_total_mb: 10240,
    trusted_domains: [],
    trusted_email_addresses: [],
    rejected_email_addresses: []
  },
  'salary-coverage': {
    coverageEnabled: true
  },
  'salary-digital-flow-einvoice': {
    einvoiceEnabled: false,
    einvoiceProvider: '',
    einvoiceSettings: {}
  },
  'salary-statistics': {
    workplaceNumberCFAR: '',
    slp: true,
    ssyk2012: '',
    snSalaryStatistics: true,
    nyk14: '',
    membershipNumberInThe: '',
    workplaceNumber: '',
    federalNumberCivilServants: '',
    contractCodeWhiteCollar: '',
    unionNumberWorkers: '',
    contractCodeWorker: '',
    klp: true,
    ksjU: true,
    sus: true,
    ksp: true
  },
  'salary-outlay': {
    rows: []
  },
  'salary-employee': {
    allowRegistrationOnTransferredDays: false,
    allowEmployeesToChangeTasks: true
  },
  'salary-employer-certificate': {
    apiKey: '',
    employerId: ''
  },
  'salary-certificate': {
    personnelCertificate: false,
    certificateCalendar: false,
    payrollCertificate: true
  },
  'salary-accounting-settings': {
    postPaySlipsOnVoucher: true,
    postHolidayDebt: true,
    postEmployerContributionsPerPaySlip: true,
    postVacationDebtOnProjects: false,
    postBenefits: true,
    postVacationDebtToCostCenter: true
  },
  'salary-building-permit': {
    useConstructionPermit: true,
    contractArea: 'Construction contract (28075)',
    countyAndMunicipality: ''
  },
  'salary-collection': {
    itpCartoon: true,
    itpCostCenter: '',
    itpType: 'Automatically depending on age',
    itp1ProductTime: '',
    itp2ProductTime: '',
    itp2FixedAnnualSalaryPaidMonthly: 'SysGrad / 100 * Månadslön * 12.2',
    itp2FixedAnnualSalaryHourlyPaid: 'SysGrad / 100 * Timlön * 168 * 12.2'
  },
  'salary-compensations': {
    mileageReimbursement: '25,00',
    mileageReimbursementForCompany: '12,00',
    mileageReimbursementForCompanySecond: '12,00',
    mileageReimbursementFor: '9,50',
    extraSickPayFor: '0'
  },
  'salary-forums': {
    foresigned: true,
    foraAgreementNumberAnnual: '',
    markups: [
      'Not employed as of ...',
      'Employed as a civil servant from ...',
      'Not drawn'
    ]
  },
  'salary-distribution-templates': {
    selectedTemplate: 'New distribution template',
    name: '',
    accountNumberToggle: false,
    costCenterToggle: true,
    projectToggle: true,
    rows: [
      { id: '1', accountNumber: '', costCenter: '', project: '', percent: '0,00' },
      { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0.00' }
    ]
  },
  'salary-default-accounts': {
    debtStaffWithholdingTaxes: '2710',
    debtSocialSecurityContributions: '2730',
    costEmployerContributions: '7510',
    costWagesWorkers: '7010',
    costSalaryCivilServant: '7210',
    sickPayWorkers: '7081',
    sickPayCivilServant: '7281',
    inputVAT: '2641',
    outputVAT: '',
    inputReverseChargeVAT: '2645',
    outputReverseChargeVAT: '2614',
    obsAccount: '2999',
    pennyRounding: '3740',
    otherNetCompensation: '7390',
    cashPayment: '1910',
    paymentFromBank: '1930',
    benefit: '7390',
    counterBookingBenefit: '7399',
    net: '7390',
    tradeFee: '2794',
    advance: '1610',
    personalLoans: '1382',
    attachmentOfWages: '2750',
    taxFreeAllowance: '7321',
    allowanceTaxable: '7322',
    foreignAllowancesTaxFree: '7323',
    expatriateAllowanceTaxable: '7324',
    mileageReimbursementTaxFree: '7331',
    mileageReimbursementTaxable: '7332',
    entertainmentDeductible: '6071',
    entertainmentNotDeductible: '6072',
    mealReduction: '7321',
    dividendInterest: '2898',
    taxOnDividendsInterest: '2710'
  },
  'salary-calendar': {
    automaticRegistrationNonWorkingDays: false,
    absenceBasedZeroSchedule: true
  },
  'salary-cost-centers': {
    enableCostCenterSupport: false,
    includeCostCenterWhenTabEntering: false
  },
  'salary-pay-slip': {
    senderName: 'Test company',
    senderEmail: '',
    senderTitle: '',
    senderPhone: '',
    numberOfDaysBeforePayoutDate: ''
  },
  'salary-pay-periods': {
    periods: []
  },
  'salary-salary-year': {
    years: []
  },
  'salary-project': {
    enableSupportForProjectAccounting: true,
    includeProjectsOnTabEnterInput: false
  },
  'salary-financial-year': {
    createFiscalYearsAutomatically: false,
    years: []
  },
  'salary-tax-employer-contributions': {
    calculationOfPreliminaryTax: 'Main employer (Tax according to tax table)',
    normalTaxTable: '',
    specificationNumberAgi: '1',
    workplaceNumberAgi: '',
    useAgiFrom2018: false,
    employerContributionLimitAthlete: true,
    useRegionalAidDeductions: false,
    useDiscountRAndD: false,
    growthSupportFirstEmployee: false,
    firstEmployee: 'No',
    growSupportUntilFirst: '',
    growthSupportOtherEmployees: false,
    secondEmployee: 'No',
    growSupportUntilSecond: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  },
  'salary-sorting': {
    numericEmployeeIds: true,
    schemaIdNumericSorting: false
  }
};

function cloneDefault<T extends Record<string, unknown>>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export class SalarySettingsModel {
  static async getAllSections(foundationId: string): Promise<SectionDataMap> {
    const { data, error } = await supabase
      .from('salary_settings')
      .select('section, data')
      .eq('foundation_id', foundationId);

    if (error) {
      throw new Error(`Failed to fetch salary settings: ${error.message}`);
    }

    const result: SectionDataMap = {
      'salary-trusted-senders-storage': cloneDefault(DEFAULT_SECTION_DATA['salary-trusted-senders-storage']),
      'salary-coverage': cloneDefault(DEFAULT_SECTION_DATA['salary-coverage']),
      'salary-digital-flow-einvoice': cloneDefault(DEFAULT_SECTION_DATA['salary-digital-flow-einvoice']),
      'salary-statistics': cloneDefault(DEFAULT_SECTION_DATA['salary-statistics']),
      'salary-outlay': cloneDefault(DEFAULT_SECTION_DATA['salary-outlay']),
      'salary-employee': cloneDefault(DEFAULT_SECTION_DATA['salary-employee']),
      'salary-employer-certificate': cloneDefault(DEFAULT_SECTION_DATA['salary-employer-certificate']),
      'salary-certificate': cloneDefault(DEFAULT_SECTION_DATA['salary-certificate']),
      'salary-accounting-settings': cloneDefault(DEFAULT_SECTION_DATA['salary-accounting-settings']),
      'salary-building-permit': cloneDefault(DEFAULT_SECTION_DATA['salary-building-permit']),
      'salary-collection': cloneDefault(DEFAULT_SECTION_DATA['salary-collection']),
      'salary-compensations': cloneDefault(DEFAULT_SECTION_DATA['salary-compensations']),
      'salary-forums': cloneDefault(DEFAULT_SECTION_DATA['salary-forums']),
      'salary-distribution-templates': cloneDefault(DEFAULT_SECTION_DATA['salary-distribution-templates']),
      'salary-default-accounts': cloneDefault(DEFAULT_SECTION_DATA['salary-default-accounts']),
      'salary-calendar': cloneDefault(DEFAULT_SECTION_DATA['salary-calendar']),
      'salary-cost-centers': cloneDefault(DEFAULT_SECTION_DATA['salary-cost-centers']),
      'salary-pay-slip': cloneDefault(DEFAULT_SECTION_DATA['salary-pay-slip']),
      'salary-pay-periods': cloneDefault(DEFAULT_SECTION_DATA['salary-pay-periods']),
      'salary-salary-year': cloneDefault(DEFAULT_SECTION_DATA['salary-salary-year']),
      'salary-project': cloneDefault(DEFAULT_SECTION_DATA['salary-project']),
      'salary-financial-year': cloneDefault(DEFAULT_SECTION_DATA['salary-financial-year']),
      'salary-tax-employer-contributions': cloneDefault(DEFAULT_SECTION_DATA['salary-tax-employer-contributions']),
      'salary-sorting': cloneDefault(DEFAULT_SECTION_DATA['salary-sorting'])
    };

    (data as SalarySettingsRow[] | null | undefined)?.forEach((row) => {
      const sectionKey = row.section as SalarySection;
      if (sectionKey in result && row.data) {
        result[sectionKey] = { ...cloneDefault(DEFAULT_SECTION_DATA[sectionKey]), ...row.data };
      }
    });

    return result;
  }

  static async getSection(
    foundationId: string,
    section: SalarySection
  ): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('salary_settings')
      .select('data')
      .eq('foundation_id', foundationId)
      .eq('section', section)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch salary settings section: ${error.message}`);
    }

    const row = data as SalarySettingsRow | null;

    if (!row) {
      return cloneDefault(DEFAULT_SECTION_DATA[section]);
    }

    return { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row.data ?? {}) };
  }

  static async upsertSection(
    foundationId: string,
    section: SalarySection,
    payload: Record<string, unknown>,
    userId: string
  ): Promise<Record<string, unknown>> {
    console.log('💾 SalarySettingsModel.upsertSection - Starting', {
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
      .from('salary_settings')
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
      throw new Error(`Failed to save salary settings: ${error.message}`);
    }

    console.log('✅ SalarySettingsModel.upsertSection - Success', {
      section,
      hasData: !!data,
      dataKeys: data ? Object.keys(data as Record<string, unknown>) : []
    });

    const row = data as SalarySettingsRow | null;

    const result = { ...cloneDefault(DEFAULT_SECTION_DATA[section]), ...(row?.data ?? {}) };
    console.log('📤 Returning merged data:', {
      section,
      resultKeys: Object.keys(result)
    });

    return result;
  }
}

export const SALARY_SECTIONS: SalarySection[] = [
  'salary-trusted-senders-storage',
  'salary-coverage',
  'salary-digital-flow-einvoice',
  'salary-statistics',
  'salary-outlay',
  'salary-employee',
  'salary-employer-certificate',
  'salary-certificate',
  'salary-accounting-settings',
  'salary-building-permit',
  'salary-collection',
  'salary-compensations',
  'salary-forums',
  'salary-distribution-templates',
  'salary-default-accounts',
  'salary-calendar',
  'salary-cost-centers',
  'salary-pay-slip',
  'salary-pay-periods',
  'salary-salary-year',
  'salary-project',
  'salary-financial-year',
  'salary-tax-employer-contributions',
  'salary-sorting'
];

