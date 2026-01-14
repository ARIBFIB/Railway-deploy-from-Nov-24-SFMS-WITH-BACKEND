import { apiFetch } from '../utils/api';

export interface Quote {
    id?: string;
    quote_number: string;
    foundation_id: string;
    customer_id?: string;
    quote_date: string;
    valid_until?: string;
    delivery_date?: string;
    quote_text?: string;
    use_as_order_text?: boolean;
    shipping_fee?: number;
    invoice_fee?: number;
    invoice_discount?: number;
    print_template?: string;
    language?: string;
    distribution_method?: string;
    total_amount: number;
    total_vat: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
    items?: any[];
}

export const quoteService = {
    getQuotes: async (foundationId: string, params: any = {}) => {
        const queryParams = new URLSearchParams({ foundation_id: foundationId, ...params }).toString();
        const response = await apiFetch(`/api/quotes?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch quotes');
        return await response.json();
    },

    getQuoteById: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/quotes/${id}?foundation_id=${foundationId}`);
        if (!response.ok) throw new Error('Failed to fetch quote');
        return await response.json();
    },

    createQuote: async (foundationId: string, quoteData: any) => {
        const response = await apiFetch(`/api/quotes?foundation_id=${foundationId}`, {
            method: 'POST',
            body: JSON.stringify(quoteData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create quote');
        }
        return await response.json();
    },

    updateQuote: async (id: string, foundationId: string, quoteData: any) => {
        const response = await apiFetch(`/api/quotes/${id}?foundation_id=${foundationId}`, {
            method: 'PUT',
            body: JSON.stringify(quoteData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update quote');
        }
        return await response.json();
    },

    deleteQuote: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/quotes/${id}?foundation_id=${foundationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete quote');
        return await response.json();
    },

    convertToOrder: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/quotes/${id}/convert-to-order?foundation_id=${foundationId}`, {
            method: 'POST',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to convert quote to order');
        }
        return await response.json();
    }
};
