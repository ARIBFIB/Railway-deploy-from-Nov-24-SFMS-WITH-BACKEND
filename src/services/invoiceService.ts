import { apiFetch } from '../utils/api';

export interface InvoiceLineItem {
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    unit?: string;
    discount_percent?: number;
    vat_rate?: number;
    line_total?: number;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    customer_id: string;
    order_id?: string;
    invoice_date: string;
    due_date: string;
    payment_terms: string;
    invoice_type: string;
    currency: string;
    subtotal: number;
    total_vat: number;
    total_amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    items: InvoiceLineItem[];
    // New fields
    invoice_address?: string;
    invoice_address_2?: string;
    postcode?: string;
    city?: string;
    country?: string;
    cin?: string;
    your_order_number?: string;
    your_reference?: string;
    our_reference?: string;
    delivery_name?: string;
    delivery_address?: string;
    delivery_address_2?: string;
    delivery_postcode?: string;
    delivery_city?: string;
    delivery_country?: string;
    delivery_date?: string;
    delivery_method?: string;
    shipping_fee?: number;
    invoice_fee?: number;
    invoice_discount_percent?: number;
    price_list?: string;
    prices_incl_vat?: boolean;
    email?: string;
    phone?: string;
    notes?: string;
    customer_supplier_name?: string; // For display
}

export interface CreateInvoiceData {
    invoice_type: string;
    customer_id?: string;
    invoice_date: string;
    due_date: string;
    payment_terms: string;
    currency?: string;
    notes?: string;
    items: InvoiceLineItem[];
    // New fields
    customer_supplier_name?: string;
    invoice_address?: string;
    invoice_address_2?: string;
    postcode?: string;
    city?: string;
    country?: string;
    cin?: string;
    your_order_number?: string;
    your_reference?: string;
    our_reference?: string;
    delivery_name?: string;
    delivery_address?: string;
    delivery_address_2?: string;
    delivery_postcode?: string;
    delivery_city?: string;
    delivery_country?: string;
    delivery_date?: string;
    delivery_method?: string;
    shipping_fee?: number;
    invoice_fee?: number;
    invoice_discount_percent?: number;
    price_list?: string;
    prices_incl_vat?: boolean;
    email?: string;
    phone?: string;
}

export interface InvoiceFilters {
    status?: string;
    invoice_type?: string;
    customer_id?: string;
}

export const invoiceService = {
    getInvoices: async (foundationId: string, status?: string) => {
        let url = `/api/invoices?foundation_id=${foundationId}`;
        if (status && status !== 'all') {
            url += `&status=${status}`;
        }

        // Add cache busting
        url += `&_t=${Date.now()}`;

        const response = await apiFetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();

        // Transform if necessary or just return
        return data;
    },

    getInvoiceById: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/invoices/${id}?foundation_id=${foundationId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch invoice');
        }
        return await response.json();
    },

    createInvoice: async (foundationId: string, invoiceData: any) => {
        const response = await apiFetch(`/api/invoices?foundation_id=${foundationId}`, {
            method: 'POST',
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create invoice');
        }
        return await response.json();
    },

    updateInvoice: async (id: string, foundationId: string, invoiceData: any) => {
        const response = await apiFetch(`/api/invoices/${id}?foundation_id=${foundationId}`, {
            method: 'PUT',
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update invoice');
        }
        return await response.json();
    },

    deleteInvoice: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/invoices/${id}?foundation_id=${foundationId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete invoice');
        }
        return await response.json();
    },

    sendInvoice: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/invoices/${id}/send?foundation_id=${foundationId}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send invoice');
        }
        return await response.json();
    }
};
