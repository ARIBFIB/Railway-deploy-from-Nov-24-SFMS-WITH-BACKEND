import { apiFetch } from '../utils/api';

export interface Payment {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  currency: string;
  payment_method?: string;
  transaction_reference?: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  foundation_id: string;
  user_id?: string;
  invoices?: {
    invoice_number: string;
    customer_id: string;
    total_amount: number;
    customers?: {
      name: string;
      customer_number?: string;
    };
  };
}

export interface CreatePaymentData {
  invoice_id: string;
  payment_date: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  transaction_reference?: string;
  status?: 'completed' | 'pending' | 'failed' | 'cancelled';
  notes?: string;
}

export interface UpdatePaymentData {
  payment_date?: string;
  amount?: number;
  currency?: string;
  payment_method?: string;
  transaction_reference?: string;
  status?: 'completed' | 'pending' | 'failed' | 'cancelled';
  notes?: string;
}

export const paymentService = {
  /**
   * Get all payments for a foundation
   */
  getPayments: async (foundationId: string): Promise<{ payments: Payment[] }> => {
    const response = await apiFetch(`/api/payments?foundation_id=${foundationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return await response.json();
  },

  /**
   * Get a specific payment by ID
   */
  getPaymentById: async (paymentId: string, foundationId: string): Promise<Payment> => {
    const response = await apiFetch(`/api/payments/${paymentId}?foundation_id=${foundationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }
    return await response.json();
  },

  /**
   * Create a new payment
   */
  createPayment: async (paymentData: CreatePaymentData, foundationId: string): Promise<Payment> => {
    const response = await apiFetch(`/api/payments?foundation_id=${foundationId}`, {
      method: 'POST',
      json: paymentData
    });
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    return await response.json();
  },

  /**
   * Update an existing payment
   */
  updatePayment: async (paymentId: string, paymentData: UpdatePaymentData, foundationId: string): Promise<Payment> => {
    const response = await apiFetch(`/api/payments/${paymentId}?foundation_id=${foundationId}`, {
      method: 'PUT',
      json: paymentData
    });
    if (!response.ok) {
      throw new Error('Failed to update payment');
    }
    return await response.json();
  },

  /**
   * Delete a payment
   */
  deletePayment: async (paymentId: string, foundationId: string): Promise<void> => {
    const response = await apiFetch(`/api/payments/${paymentId}?foundation_id=${foundationId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
  },

  /**
   * Get all payments for a specific invoice
   */
  getPaymentsByInvoice: async (invoiceId: string, foundationId: string): Promise<{ payments: Payment[] }> => {
    const response = await apiFetch(`/api/payments/invoice/${invoiceId}?foundation_id=${foundationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments for invoice');
    }
    return await response.json();
  },
};