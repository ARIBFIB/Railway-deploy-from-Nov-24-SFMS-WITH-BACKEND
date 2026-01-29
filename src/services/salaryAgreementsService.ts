import { apiFetch } from '../utils/api';

export interface SalaryAgreement {
  id: string;
  foundation_id: string;
  name: string;
  staff_type: string;
  agreement_template: string;
  is_active: boolean;
}

export interface CreateSalaryAgreementData {
  name: string;
  staff_type: string;
  agreement_template: string;
  salary_period?: string;
  atf?: {
    enabled: boolean;
    period: string;
    showOnPayslip: boolean;
  };
  atk?: {
    enabled: boolean;
    period: string;
    showOnPayslip: boolean;
  };
  holiday?: {
    earningYear: string;
    startDate: {
      day: string;
      month: string;
    };
    entitlement: string;
    fullDaysOnly: boolean;
    rule: string;
    holidayPay: string;
    minimumWage: string;
    compliesWithAnnualLeaveAct: boolean;
    variableSupplementPerDay: boolean;
    sicknessDeduction: string;
    sickWaitingPeriod: string;
    automaticSchedule: boolean;
    automaticFullDay: boolean;
    settings: Array<{
      name: string;
      formula: string;
      value: string;
    }>;
    salaryTypes: Array<{
      label: string;
      enabled: boolean;
    }>;
  };
}

export const salaryAgreementsService = {
  async list(params?: { foundation_id?: string; search?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.search) qs.set('search', params.search);
    
    console.log('Fetching salary agreements with params:', params);
    
    const res = await apiFetch(`/api/salary-agreements/salary-agreements?${qs.toString()}`);
    
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error response:', errorText);
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }
    
    const json = await res.json();
    console.log('API Response data:', json);
    
    // Handle both data wrapper and direct array responses
    const data = Array.isArray(json) ? json : (json.data || []);
    console.log('Processed data:', data);
    
    return data as SalaryAgreement[];
  },

  async create(data: CreateSalaryAgreementData, foundationId: string) {
    const res = await apiFetch(`/api/salary-agreements/salary-agreements?foundation_id=${foundationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create salary agreement');
    }
    
    const json = await res.json();
    return json.data as SalaryAgreement;
  },

  async getById(id: string, foundationId: string) {
    const res = await apiFetch(`/api/salary-agreements/salary-agreements/${id}?foundation_id=${foundationId}`);
    const json = await res.json();
    return json.data as SalaryAgreement;
  },

  async update(id: string, data: Partial<CreateSalaryAgreementData>, foundationId: string) {
    const res = await apiFetch(`/api/salary-agreements/salary-agreements/${id}?foundation_id=${foundationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update salary agreement');
    }
    
    const json = await res.json();
    return json.data as SalaryAgreement;
  },

  async delete(id: string, foundationId: string) {
    const res = await apiFetch(`/api/salary-agreements/salary-agreements/${id}?foundation_id=${foundationId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete salary agreement');
    }
    
    return true;
  }
};


