import { apiFetch } from '../utils/api';

export interface PayrollRun {
    id: string;
    payroll_period_start: string;
    payroll_period_end: string;
    pay_date: string;
    status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
    total_gross_pay: number;
    total_deductions: number; // Represents tax deduction from employee
    total_net_pay: number;
    currency: string;
    employee_count: number;
    created_at: string;
}

export interface CreatePayrollRunData {
    payroll_period_start: string;
    payroll_period_end: string;
    pay_date: string;
    currency?: string;
}

export interface PayrollEntry {
    id: string;
    employee_name: string; // Mapped from join
    gross_pay: number;
    tax_deduction: number;
    social_security_deduction: number;
    other_deductions: number;
    total_deductions: number; // Calculated helper
    net_pay: number;
    hours_worked?: number;
}

export class PayrollService {
    static async getPayrollRuns(status?: string): Promise<PayrollRun[]> {
        const queryParams = new URLSearchParams();
        if (status) queryParams.append('status', status);
        queryParams.append('_t', Date.now().toString());

        const response = await apiFetch(`/api/payroll/runs?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch payroll runs');
        }
        const data = await response.json();
        return data.payroll_runs;
    }

    static async getPayrollRunById(id: string): Promise<{ run: PayrollRun, entries: PayrollEntry[] }> {
        const response = await apiFetch(`/api/payroll/runs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch payroll run details');
        }
        const data = await response.json();
        const run = data.payroll_run;

        // Map entries
        const entries = (run.payroll_entries || []).map((entry: any) => ({
            id: entry.id,
            employee_name: `${entry.employees?.first_name || ''} ${entry.employees?.last_name || ''}`.trim() || 'Unknown',
            gross_pay: entry.gross_pay,
            tax_deduction: entry.tax_deduction,
            social_security_deduction: entry.social_security_deduction,
            other_deductions: entry.other_deductions,
            total_deductions: entry.tax_deduction + entry.other_deductions, // Assuming Tax is the main deduction from Net
            net_pay: entry.gross_pay - entry.tax_deduction - entry.other_deductions,
            hours_worked: 160 // Placeholder or fetched if available
        }));

        return { run, entries };
    }

    static async createPayrollRun(data: CreatePayrollRunData): Promise<PayrollRun> {
        const response = await apiFetch('/api/payroll/runs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create payroll run');
        }
        return (await response.json()).payroll_run;
    }

    static async calculatePayrollRun(id: string): Promise<void> {
        const response = await apiFetch(`/api/payroll/runs/${id}/calculate`, {
            method: 'POST'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to calculate payroll');
        }
    }

    static async approvePayrollRun(id: string): Promise<void> {
        const response = await apiFetch(`/api/payroll/runs/${id}/approve`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Failed to approve payroll run');
        }
    }
}
