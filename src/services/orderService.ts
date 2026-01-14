import { apiFetch } from '../utils/api';

export interface Order {
    id?: string;
    order_number: string;
    foundation_id: string;
    customer_id?: string;
    order_date: string;
    delivery_date?: string;
    payment_terms?: string;
    our_reference?: string;
    your_order_number?: string;
    your_reference?: string;
    price_list?: string;
    currency?: string;
    course?: number;
    unit?: number;
    vat_type?: string;
    total_amount: number;
    total_vat: number;
    status: 'draft' | 'confirmed' | 'delivered' | 'invoiced' | 'completed' | 'cancelled';
    items?: any[];
}

export const orderService = {
    getOrders: async (foundationId: string, params: any = {}) => {
        const queryParams = new URLSearchParams({ foundation_id: foundationId, ...params }).toString();
        const response = await apiFetch(`/api/orders?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    },

    getOrderById: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/orders/${id}?foundation_id=${foundationId}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        return await response.json();
    },

    createOrder: async (foundationId: string, orderData: any) => {
        const response = await apiFetch(`/api/orders?foundation_id=${foundationId}`, {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }
        return await response.json();
    },

    updateOrder: async (id: string, foundationId: string, orderData: any) => {
        const response = await apiFetch(`/api/orders/${id}?foundation_id=${foundationId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order');
        }
        return await response.json();
    },

    deleteOrder: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/orders/${id}?foundation_id=${foundationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return await response.json();
    },

    convertToInvoice: async (id: string, foundationId: string) => {
        const response = await apiFetch(`/api/orders/${id}/convert-to-invoice?foundation_id=${foundationId}`, {
            method: 'POST',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to convert order to invoice');
        }
        return await response.json();
    },

    convertToOrder: async (id: string, foundationId: string) => {
        return orderService.convertToInvoice(id, foundationId);
    },

    updateDeliveryStatus: async (id: string, foundationId: string, deliveryData: any) => {
        const response = await apiFetch(`/api/orders/${id}/delivery?foundation_id=${foundationId}`, {
            method: 'PUT',
            body: JSON.stringify(deliveryData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update delivery status');
        }
        return await response.json();
    }
};
