import { apiFetch } from '../utils/api';

export interface WageType {
  id: string;
  foundation_id: string;
  salary_type: string;
  name: string;
  category?: string;
  unit?: string;
  formula?: string;
  preliminary_tax?: string;
  employer_contribution?: string;
  preselected_account?: string;
  is_active: boolean;
}

export interface RegistrationCode {
  id: string;
  foundation_id: string;
  code: string;
  name: string;
  used: boolean;
  employee: boolean;
  is_active: boolean;
}

export interface WageTypeControl {
  id: string;
  foundation_id: string;
  registration_code: string;
  day_code: string;
  salary_type: string;
  is_active: boolean;
}

export const wageTypesService = {
  async listWageTypes(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/wage-types/wage-types?${qs.toString()}`);
    const json = await res.json();
    return json.data as WageType[];
  },

  async bulkUpdateWageTypes(foundation_id: string, ids: string[], is_active: boolean) {
    const res = await apiFetch('/api/wage-types/wage-types/bulk-update', {
      method: 'PATCH',
      json: { wage_type_ids: ids, is_active },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as WageType[];
  },

  async listRegistrationCodes(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/wage-types/registration-codes?${qs.toString()}`);
    const json = await res.json();
    return json.data as RegistrationCode[];
  },

  async bulkUpdateRegistrationCodes(foundation_id: string, ids: string[], is_active: boolean) {
    const res = await apiFetch('/api/wage-types/registration-codes/bulk-update', {
      method: 'PATCH',
      json: { registration_code_ids: ids, is_active },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as RegistrationCode[];
  },

  async listWageTypeControls(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive' }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/wage-types/wage-type-controls?${qs.toString()}`);
    const json = await res.json();
    return json.data as WageTypeControl[];
  },

  async bulkUpdateWageTypeControls(foundation_id: string, ids: string[], is_active: boolean) {
    const res = await apiFetch('/api/wage-types/wage-type-controls/bulk-update', {
      method: 'PATCH',
      json: { wage_type_control_ids: ids, is_active },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as WageTypeControl[];
  }
};


