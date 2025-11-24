import { apiFetch } from '../utils/api';

export interface WorkingHoursScheduleDto {
  id: string;
  foundation_id: string;
  schema_id: string;
  name: string;
  schedule_length_in_days: number;
  number_of_obs: number;
  employment_rate: number;
  is_active: boolean;
}

export const workingHoursService = {
  async list(params?: { foundation_id?: string; status?: 'all' | 'active' | 'inactive'; search?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const res = await apiFetch(`/api/working-hours-schedules/working-hours-schedules?${qs.toString()}`);
    const json = await res.json();
    return json.data as WorkingHoursScheduleDto[];
  }
};


