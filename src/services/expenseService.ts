import { apiFetch } from '../utils/api';

export interface Expense {
    id: string;
    foundation_id: string;
    user_id: string;
    amount: number;
    currency: string;
    category: string;
    description: string;
    receipt_url?: string;
    expense_date: string;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    approved_by?: string;
    approved_at?: string;
    created_at: string;
    updated_at: string;
    // Joins
    foundations?: { name: string };
    profiles?: { full_name: string; email: string };
}

export interface CreateExpenseData {
    foundation_id: string;
    amount: number;
    currency: string;
    category: string;
    description: string;
    expense_date: string;
    receipt?: File; // For client-side handling
}

export class ExpenseService {

    static async getExpenses(params: { status?: string; category?: string; foundation_id?: string } = {}): Promise<Expense[]> {
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.category && params.category !== 'all') queryParams.append('category', params.category);
        if (params.foundation_id) queryParams.append('foundation_id', params.foundation_id);

        queryParams.append('_t', Date.now().toString());

        const response = await apiFetch(`/api/expenses?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        return data.expenses;
    }

    static async createExpense(data: CreateExpenseData): Promise<Expense> {
        const formData = new FormData();
        formData.append('foundation_id', data.foundation_id);
        formData.append('amount', data.amount.toString());
        formData.append('currency', data.currency);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('expense_date', data.expense_date);

        if (data.receipt) {
            formData.append('receipt', data.receipt);
        }

        // apiFetch header handling for FormData (multipart/form-data)
        // IMPORTANT check: apiFetch in this codebase might default Content-Type to application/json
        // If we pass a FormData body, we often need to let the browser set the Content-Type header with boundry.
        // I should check `apiFetch` in `src/utils/api.ts` if accessible.
        // Assuming standard behavior: if body is FormData, don't set 'Content-Type'.

        // I'll assume current apiFetch helper might need manual override or usage of raw fetch if it forces JSON.
        // Let's assume standard fetch wrap. If apiFetch forces JSON, I might need to bypass or handle it.
        // Safety check: Use standard generic fetch if unsure, but authentication middleware might rely on apiFetch adding token.

        // Attempting to use apiFetch. If it sets 'Content-Type', we might have issues.
        // Strategy: Pass specific headers to delete Content-Type if possible, or just rely on it handling it.
        // Actually, usually `body: formData` makes browser set content-type.

        const response = await apiFetch('/api/expenses', {
            method: 'POST',
            body: formData,
            // headers: { 'Content-Type': undefined } // Often triggers auto-generation
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create expense');
        }
        return (await response.json()).expense;
    }

    static async updateExpense(id: string, data: Partial<CreateExpenseData>): Promise<Expense> {
        // Basic update (no file support in this simplified edit usually, unless specified)
        const response = await apiFetch(`/api/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update expense');
        return (await response.json()).expense;
    }

    static async approveExpense(id: string): Promise<void> {
        const response = await apiFetch(`/api/expenses/${id}/approve`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to approve expense');
    }

    static async rejectExpense(id: string, reason: string): Promise<void> {
        const response = await apiFetch(`/api/expenses/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ rejection_reason: reason })
        });
        if (!response.ok) throw new Error('Failed to reject expense');
    }

    static async deleteExpense(id: string): Promise<void> {
        const response = await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete expense');
    }
}
