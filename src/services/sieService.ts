import { apiFetch } from '../utils/api';

export interface SIEImport {
  id: string;
  foundation_id: string;
  file_name: string;
  import_date: string;
  accounting_period_start?: string;
  accounting_period_end?: string;
  status: string;
  records_imported: number;
  errors: any[];
}

export interface SIEExport {
  id: string;
  foundation_id: string;
  file_name: string;
  export_date: string;
  accounting_period_start?: string;
  accounting_period_end?: string;
  status: string;
  file_path?: string;
}

export const sieService = {
  async getImports(foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/sie/imports?${qs.toString()}`);
    const json = await res.json();
    return json.data as SIEImport[];
  },

  async getImportById(id: string) {
    const res = await apiFetch(`/api/sie/imports/${id}`);
    const json = await res.json();
    return json.data as SIEImport;
  },

  async createImport(data: Partial<SIEImport>, foundation_id: string) {
    const res = await apiFetch('/api/sie/imports', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as SIEImport;
  },

  async getExports(foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/sie/exports?${qs.toString()}`);
    const json = await res.json();
    return json.data as SIEExport[];
  },

  async getExportById(id: string) {
    const res = await apiFetch(`/api/sie/exports/${id}`);
    const json = await res.json();
    return json.data as SIEExport;
  },

  async createExport(data: Partial<SIEExport>, foundation_id: string) {
    const res = await apiFetch('/api/sie/exports', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as SIEExport;
  },

  async downloadExport(id: string) {
    const res = await apiFetch(`/api/sie/exports/${id}/download`);
    const json = await res.json();
    return json.data;
  }
};
