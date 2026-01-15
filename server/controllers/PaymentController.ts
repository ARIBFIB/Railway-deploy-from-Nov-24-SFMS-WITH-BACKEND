import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class PaymentController {
  /**
   * Get all payments for a foundation
   */
  static getAllPayments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    
    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices (
          invoice_number,
          customer_id,
          total_amount,
          customers (
            name,
            customer_number
          )
        )
      `)
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw createError('Failed to fetch payments', 500);
    }

    res.json({ payments: data });
  });

  /**
   * Get a specific payment by ID
   */
  static getPaymentById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices (
          invoice_number,
          customer_id,
          total_amount,
          customers (
            name,
            customer_number
          )
        )
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') {
        throw createError('Payment not found', 404);
      }
      console.error('Error fetching payment:', error);
      throw createError('Failed to fetch payment', 500);
    }

    res.json(data);
  });

  /**
   * Create a new payment
   */
  static createPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { invoice_id, payment_date, amount, currency, payment_method, transaction_reference, status, notes } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!invoice_id || !payment_date || !amount) {
      throw createError('Invoice ID, payment date, and amount are required', 400);
    }

    // Check if the invoice belongs to the foundation
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, foundation_id')
      .eq('id', invoice_id)
      .eq('foundation_id', foundation_id)
      .single();

    if (invoiceError || !invoiceData) {
      throw createError('Invoice not found or does not belong to foundation', 404);
    }

    // Insert the new payment
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        invoice_id,
        payment_date,
        amount,
        currency: currency || 'SEK',
        payment_method,
        transaction_reference,
        status: status || 'completed',
        notes,
        foundation_id,
        user_id: (req as AuthenticatedRequest).user?.user_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw createError('Failed to create payment', 500);
    }

    // Update the invoice status to 'paid' if the payment covers the full amount
    const { data: invoice, error: fetchInvoiceError } = await supabase
      .from('invoices')
      .select('total_amount, paid_amount')
      .eq('id', invoice_id)
      .single();

    if (!fetchInvoiceError && invoice) {
      const totalPaid = (invoice.paid_amount || 0) + amount;
      const newStatus = totalPaid >= invoice.total_amount ? 'paid' : 'partially_paid';

      await supabase
        .from('invoices')
        .update({ 
          paid_amount: totalPaid,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoice_id);
    }

    res.status(201).json(data);
  });

  /**
   * Update an existing payment
   */
  static updatePayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const { payment_date, amount, currency, payment_method, transaction_reference, status, notes } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Check if the payment exists and belongs to the foundation
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (fetchError || !existingPayment) {
      throw createError('Payment not found or does not belong to foundation', 404);
    }

    // Update the payment
    const { data, error } = await supabase
      .from('payments')
      .update({
        payment_date,
        amount,
        currency,
        payment_method,
        transaction_reference,
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      throw createError('Failed to update payment', 500);
    }

    res.json(data);
  });

  /**
   * Delete a payment
   */
  static deletePayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Check if the payment exists and belongs to the foundation
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (fetchError || !existingPayment) {
      throw createError('Payment not found or does not belong to foundation', 404);
    }

    // Delete the payment
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      console.error('Error deleting payment:', error);
      throw createError('Failed to delete payment', 500);
    }

    // Recalculate the invoice's paid amount
    const { data: remainingPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('invoice_id', existingPayment.invoice_id);

    if (!paymentsError && remainingPayments) {
      const totalPaid = remainingPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('id', existingPayment.invoice_id)
        .single();

      if (!invoiceError && invoice) {
        const newStatus = totalPaid >= invoice.total_amount ? 'paid' : (totalPaid > 0 ? 'partially_paid' : 'sent');

        await supabase
          .from('invoices')
          .update({ 
            paid_amount: totalPaid,
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPayment.invoice_id);
      }
    }

    res.json({ message: 'Payment deleted successfully' });
  });

  /**
   * Get all payments for a specific invoice
   */
  static getPaymentsByInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { invoiceId } = req.params;
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices (
          invoice_number,
          customers (
            name
          )
        )
      `)
      .eq('invoice_id', invoiceId)
      .eq('foundation_id', foundation_id)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments for invoice:', error);
      throw createError('Failed to fetch payments for invoice', 500);
    }

    res.json({ payments: data });
  });
}