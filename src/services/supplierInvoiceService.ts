import { apiFetch } from '../utils/api';

export interface SupplierInvoiceLineItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    line_total?: number;
}

export interface SupplierInvoice {
    id: string;
    supplier_name: string;
    supplier_id?: string;
    invoice_number: string;
    supplier_invoice_number: string;
    invoice_date: string;
    due_date: string;
    total_amount: number;
    currency: string;
    status: 'received' | 'under_review' | 'approved' | 'rejected' | 'paid';
    document_path?: string;
    notes?: string;
    received_by: string;
    approved_by?: string;
    approved_at?: string;
    created_at: string;
    line_items: SupplierInvoiceLineItem[];
    approval_workflow?: any[];
}

export interface CreateSupplierInvoiceData {
    supplier_id: string;
    supplier_invoice_number: string;
    invoice_date: string;
    due_date: string;
    total_amount: number;
    currency: string;
    notes?: string;
    items: SupplierInvoiceLineItem[];
}

export class SupplierInvoiceService {
    static async getSupplierInvoices(status: string = 'all'): Promise<SupplierInvoice[]> {
        const queryParams = new URLSearchParams();
        if (status && status !== 'all') queryParams.append('status', status);

        // Add cache busting
        queryParams.append('_t', Date.now().toString());

        const response = await apiFetch(`/api/supplier-invoices?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch supplier invoices');
        }
        const data = await response.json();

        return data.invoices.map((inv: any) => ({
            ...inv,
            supplier_name: inv.suppliers?.name || 'Unknown Supplier',
            received_by: inv.received_by_profile?.full_name || 'Unknown',
            approved_by: inv.approved_by_profile?.full_name || inv.approved_by,
            line_items: (inv.supplier_invoice_items || []).map((item: any) => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.tax_rate,
                line_total: item.line_total
            })),
            // Generate a synthetic workflow for UI compatibility if needed
            approval_workflow: [
                {
                    id: '1',
                    step_order: 1,
                    approver_name: 'Admin',
                    status: inv.status === 'approved' ? 'approved' : (inv.status === 'rejected' ? 'rejected' : 'pending'),
                    approved_at: inv.approved_at
                }
            ]
        }));
    }

    static async createSupplierInvoice(data: CreateSupplierInvoiceData): Promise<SupplierInvoice> {
        const response = await apiFetch('/api/supplier-invoices', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create supplier invoice');
        }

        return (await response.json()).invoice;
    }

    static async approveInvoice(id: string): Promise<void> {
        const response = await apiFetch(`/api/supplier-invoices/${id}/approve`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to approve invoice');
        }
    }

    static async rejectInvoice(id: string, reason?: string): Promise<void> {
        const response = await apiFetch(`/api/supplier-invoices/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });

        if (!response.ok) {
            throw new Error('Failed to reject invoice');
        }
    }
}
