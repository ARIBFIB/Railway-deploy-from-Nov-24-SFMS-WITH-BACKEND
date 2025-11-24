import { apiFetch } from '../utils/api';

export interface Employee {
  id: string;
  foundation_id: string;
  employment_id: string;
  first_name: string;
  last_name: string;
  social_security_number?: string;
  staff_type?: string;
  agreement_for_salaries?: string;
  agreement_template?: string;
  salary_form?: string;
  type_of_pay_slip?: string;
  calendar_permissions?: string;
  is_active: boolean;
  is_complete: boolean;
}

export const personnelService = {
  async list(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive' | 'notComplete'; search?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const res = await apiFetch(`/api/personnel/employees?${qs.toString()}`);
    const json = await res.json();
    return json.data as Employee[];
  },

  async bulkUpdateStatus(foundation_id: string, ids: string[], is_active: boolean) {
    const res = await apiFetch('/api/personnel/employees/bulk-update', {
      method: 'PATCH',
      json: { employee_ids: ids, is_active },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as Employee[];
  },

  async bulkDelete(foundation_id: string, ids: string[]) {
    const res = await apiFetch('/api/personnel/employees/bulk-delete', {
      method: 'DELETE',
      json: { employee_ids: ids },
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json;
  }
};


