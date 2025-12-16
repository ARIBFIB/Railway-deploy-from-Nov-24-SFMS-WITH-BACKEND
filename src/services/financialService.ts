import { apiFetch } from '../utils/api';

export interface DashboardStats {
    total_assets: number;
    outstanding_invoices: {
        amount: number;
        count: number;
    };
    pending_approvals: number;
    monthly_payroll: number;
    currency: string;
    bank_accounts: any[];
}

export class FinancialService {
    static async getDashboardStats(foundationId: string): Promise<DashboardStats> {
        const response = await apiFetch(`/api/financial/dashboard-stats?foundation_id=${foundationId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        return await response.json();
    }
}
