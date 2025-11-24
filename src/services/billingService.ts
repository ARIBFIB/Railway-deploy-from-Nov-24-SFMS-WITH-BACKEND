import { apiFetch } from '../utils/api';

export interface BillingInvoice {
  id: string;
  foundation_id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  vat_amount: number;
  paid_amount: number;
  status: string;
  payment_terms?: string;
  notes?: string;
}

export interface BillingPayment {
  id: string;
  foundation_id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  payment_method?: string;
  reference?: string;
  notes?: string;
}

export interface BillingReminder {
  id: string;
  foundation_id: string;
  invoice_id: string;
  reminder_date: string;
  reminder_type: string;
  sent_date?: string;
  status: string;
  notes?: string;
}

export const billingService = {
  async getInvoices(params?: { foundation_id?: string; customer_id?: string; status?: string }) {
    const qs = new URLSearchParams();
    if (params?.foundation_id) qs.set('foundation_id', params.foundation_id);
    if (params?.customer_id) qs.set('customer_id', params.customer_id);
    if (params?.status) qs.set('status', params.status);
    const res = await apiFetch(`/api/billing/invoices?${qs.toString()}`);
    const json = await res.json();
    return json.data as BillingInvoice[];
  },

  async getInvoiceById(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/billing/invoices/${id}?${qs.toString()}`);
    const json = await res.json();
    return json.data as BillingInvoice;
  },

  async createInvoice(data: Partial<BillingInvoice>, foundation_id: string) {
    const res = await apiFetch('/api/billing/invoices', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as BillingInvoice;
  },

  async updateInvoice(id: string, data: Partial<BillingInvoice>, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/billing/invoices/${id}?${qs.toString()}`, {
      method: 'PUT',
      json: data
    });
    const json = await res.json();
    return json.data as BillingInvoice;
  },

  async markInvoiceAsPaid(id: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    const res = await apiFetch(`/api/billing/invoices/${id}/mark-paid?${qs.toString()}`, {
      method: 'PATCH'
    });
    const json = await res.json();
    return json.data as BillingInvoice;
  },

  async getPayments(invoice_id?: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    if (invoice_id) qs.set('invoice_id', invoice_id);
    const res = await apiFetch(`/api/billing/payments?${qs.toString()}`);
    const json = await res.json();
    return json.data as BillingPayment[];
  },

  async createPayment(data: Partial<BillingPayment>, foundation_id: string) {
    const res = await apiFetch('/api/billing/payments', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as BillingPayment;
  },

  async getReminders(invoice_id?: string, foundation_id?: string) {
    const qs = new URLSearchParams();
    if (foundation_id) qs.set('foundation_id', foundation_id);
    if (invoice_id) qs.set('invoice_id', invoice_id);
    const res = await apiFetch(`/api/billing/reminders?${qs.toString()}`);
    const json = await res.json();
    return json.data as BillingReminder[];
  },

  async createReminder(data: Partial<BillingReminder>, foundation_id: string) {
    const res = await apiFetch('/api/billing/reminders', {
      method: 'POST',
      json: data,
      headers: { 'X-Foundation-ID': foundation_id }
    });
    const json = await res.json();
    return json.data as BillingReminder;
  }
};
