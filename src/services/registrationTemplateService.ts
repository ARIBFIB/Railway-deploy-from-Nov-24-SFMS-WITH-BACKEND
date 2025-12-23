import { apiFetch } from '../utils/api';

export interface SaleEntry {
    id: string;
    text: string;
    account: string;
    outputVat: string;
}

export interface RegistrationTemplate {
    id: string;
    name: string;
    description: string;
    verificationSeries: string;
    type: 'Daily cash register' | 'Receipt';
    templateType: 'Daily cash register' | 'Receipt';
    verificationDescription: string;
    headingSales: string;
    showPaymentMethodsAtTop: boolean;
    vatDeclaration: 'Incl.' | 'Excl.';
    importAccountBalance: boolean;
    savePrintoutInArchiveLocation: 'Save' | "Don't save";
    headingPaymentMethod: string;
    accountForDifference: string;
    headingWithdrawal: string;
    saleEntries: SaleEntry[];
}

export class RegistrationTemplateService {
    static async getTemplates(): Promise<RegistrationTemplate[]> {
        const cacheBuster = `_t=${Date.now()}`;
        const response = await apiFetch(`/api/settings/registration-templates?${cacheBuster}`);

        if (!response.ok) {
            throw new Error('Failed to fetch registration templates');
        }

        const data = await response.json();
        if (data.success && data.data && data.data.templates) {
            return data.data.templates;
        }

        return [];
    }
}
