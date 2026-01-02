import { apiFetch } from '../utils/api';

export interface VATSettings {
    id?: string;
    foundation_id: string;
    vat_type: string | null;
    about: string | null;
    propose_vat_on_supplier_invoices: string | null;
    incoming_invoices_action: string | null;
    created_at?: string;
    updated_at?: string;
    updated_by?: string;
}

export interface VATEntry {
    id?: string;
    foundation_id: string;
    vat_code: string;
    description: string | null;
    vat_rate: number | null;
    valid_from: string | null;
    valid_to: string | null;
    is_deletable: boolean;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
}

export interface VATSettingsResponse {
    success: boolean;
    data: {
        settings: VATSettings;
        entries: VATEntry[];
        output_vat_entries: VATEntry[];
    };
    message?: string;
}

export class VATSettingsService {
    static async getSettings(): Promise<VATSettingsResponse> {
        const response = await apiFetch('/api/settings/vat');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch VAT settings');
        }
        return await response.json();
    }

    static async upsertSettings(settings: Partial<VATSettings & { output_vat_entries?: VATEntry[] }>): Promise<VATSettingsResponse> {
        const response = await apiFetch('/api/settings/vat', {
            method: 'POST',
            body: JSON.stringify(settings),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save VAT settings');
        }
        return await response.json();
    }
}
