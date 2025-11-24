import { apiFetch } from '../utils/api';

export interface SalaryAgreement {
  id: string;
  foundation_id: string;
  name: string;
  staff_type: string;
  agreement_template: string;
  is_active: boolean;
}

export const salaryAgreementsService = {
  async list(params?: { foundation_id?: string; search?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.search) qs.set('search', params.search);
    const res = await apiFetch(`/api/salary-agreements/salary-agreements?${qs.toString()}`);
    const json = await res.json();
    return json.data as SalaryAgreement[];
  }
};


