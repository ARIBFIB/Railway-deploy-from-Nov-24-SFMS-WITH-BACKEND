import { apiFetch } from '../utils/api';

export interface InvoiceLineItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    line_total?: number;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    invoice_type: string;
    customer_supplier_name: string; // Mapped from customers.name or directly if text
    invoice_date: string;
    due_date: string;
    subtotal: number;
    tax_amount: number; // API uses total_vat, checking controller... yes total_vat
    total_amount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    payment_terms: string;
    line_items: InvoiceLineItem[];
    customer_id?: string;
    order_id?: string;
    notes?: string;
}

export interface CreateInvoiceData {
    invoice_type: string;
    customer_id?: string; // For sales invoices
    customer_supplier_name?: string; // Fallback or if no customer record
    invoice_date: string;
    due_date: string;
    payment_terms: string;
    currency?: string;
    notes?: string;
    items: InvoiceLineItem[];
}

export interface InvoiceFilters {
    status?: string;
    invoice_type?: string;
    customer_id?: string;
}

export class InvoiceService {
    static async getInvoices(filters: InvoiceFilters = {}): Promise<{ invoices: Invoice[], total: number }> {
        const queryParams = new URLSearchParams();
        if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.invoice_type && filters.invoice_type !== 'all') queryParams.append('invoice_type', filters.invoice_type);
        if (filters.customer_id) queryParams.append('customer_id', filters.customer_id);

        // Add cache busting
        queryParams.append('_t', Date.now().toString());

        const response = await apiFetch(`/api/invoices?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();

        // Transform backend data to frontend interface matches if necessary
        // Backend returns: invoices: [ { ..., customers: { name: ... }, total_vat: ... } ]
        const invoices = data.invoices.map((inv: any) => ({
            ...inv,
            tax_amount: inv.total_vat,
            // Map customer name if available
            customer_supplier_name: inv.customers?.name || inv.customer_supplier_name || 'Unknown',
            // Ensure line items are present (backend sends invoice_items usually separate or included)
            // Controller lines 16-30 include `invoice_items`
            line_items: (inv.invoice_items || []).map((item: any) => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.vat_rate, // Backend uses vat_rate
                line_total: item.line_total
            }))
        }));

        return { invoices, total: data.total };
    }

    static async getInvoiceById(id: string): Promise<Invoice> {
        const response = await apiFetch(`/api/invoices/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch invoice');
        }
        const data = await response.json();
        const inv = data.invoice;

        return {
            ...inv,
            tax_amount: inv.total_vat,
            customer_supplier_name: inv.customers?.name || inv.customer_supplier_name || 'Unknown',
            line_items: (inv.invoice_items || []).map((item: any) => ({
                id: item.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.vat_rate,
                line_total: item.line_total
            }))
        };
    }

    static async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
        // Map frontend data to backend expectations
        // Backend expects: customer_id, items: [{..., vat_rate ...}]
        const payload = {
            ...data,
            // If frontend sends 'tax_rate', map to 'vat_rate' for items
            items: data.items.map(item => ({
                ...item,
                vat_rate: item.tax_rate
            }))
        };

        const response = await apiFetch('/api/invoices', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create invoice');
        }

        const result = await response.json();
        return result.invoice;
    }

    static async deleteInvoice(id: string): Promise<void> {
        const response = await apiFetch(`/api/invoices/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete invoice');
        }
    }
}
