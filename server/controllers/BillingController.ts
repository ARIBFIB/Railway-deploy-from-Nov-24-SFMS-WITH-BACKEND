import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class BillingController {
  // Get customer invoices
  static async getCustomerInvoices(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { page = 1, limit = 50, search = '', filter = 'to-handle' } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      let query = supabase
        .from('invoices')
        .select(`
          *,
          customers (
            id,
            name,
            customer_number
          )
        `)
        .eq('foundation_id', foundation_id);

      // Apply search filter
      if (search) {
        query = query.or(`invoice_number.ilike.%${search}%,ocr.ilike.%${search}%,customers.name.ilike.%${search}%`);
      }

      // Apply status filter
      if (filter !== 'all') {
        switch (filter) {
          case 'to-handle':
            query = query.in('status', ['draft', 'sent', 'overdue']);
            break;
          case 'not-booked':
            query = query.eq('status', 'draft');
            break;
          case 'unpaid':
            query = query.in('status', ['sent', 'overdue']);
            break;
          case 'unpaid-overdue':
            query = query.eq('status', 'overdue');
            break;
          case 'final-payment':
            query = query.eq('status', 'final_payment');
            break;
          case 'cancelled':
            query = query.eq('status', 'cancelled');
            break;
          case 'failed':
            query = query.eq('status', 'failed');
            break;
        }
      }

      // Apply pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: invoices, error } = await query;

      if (error) {
        throw createError('Failed to fetch invoices', 500);
      }

      // Get total count for pagination
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('foundation_id', foundation_id);

      res.json({
        success: true,
        data: invoices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Add payment
  static async addPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const { payment_date, invoice_number, paid_amount } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      // Find invoice by number or OCR
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('foundation_id', foundation_id)
        .or(`invoice_number.eq.${invoice_number},ocr.eq.${invoice_number}`)
        .single();

      if (invoiceError) {
        throw createError('Invoice not found', 404);
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          foundation_id,
          invoice_id: invoice.id,
          payment_date,
          paid_amount: parseFloat(paid_amount),
          payment_method: 'bank_transfer',
          status: 'pending',
          created_by: user_id
        })
        .select()
        .single();

      if (paymentError) {
        throw createError('Failed to create payment', 500);
      }

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Payment added successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get payments
  static async getPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { page = 1, limit = 50 } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoices (
            id,
            invoice_number,
            total_amount,
            customers (
              id,
              name,
              customer_number
            )
          )
        `)
        .eq('foundation_id', foundation_id)
        .order('payment_date', { ascending: false });

      if (error) {
        throw createError('Failed to fetch payments', 500);
      }

      res.json({
        success: true,
        data: payments
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Book payments
  static async bookPayments(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const { payment_ids, payment_method } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      // Update payments status to booked
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .update({
          status: 'booked',
          payment_method,
          booked_by: user_id,
          booked_at: new Date().toISOString()
        })
        .in('id', payment_ids)
        .eq('foundation_id', foundation_id)
        .select();

      if (paymentsError) {
        throw createError('Failed to book payments', 500);
      }

      // Update invoice balances (fetch current values then update)
      for (const payment of payments) {
        const { data: inv, error: fetchErr } = await supabase
          .from('invoices')
          .select('id, paid_amount, balance')
          .eq('id', payment.invoice_id)
          .eq('foundation_id', foundation_id)
          .single();

        if (fetchErr || !inv) {
          console.error('Failed to fetch invoice for balance update:', fetchErr);
          continue;
        }

        const newPaid = (inv.paid_amount || 0) + (payment.paid_amount || 0);
        const newBalance = (inv.balance || 0) - (payment.paid_amount || 0);

        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({ paid_amount: newPaid, balance: newBalance })
          .eq('id', payment.invoice_id)
          .eq('foundation_id', foundation_id);

        if (invoiceError) {
          console.error('Failed to update invoice balance:', invoiceError);
        }
      }

      res.json({
        success: true,
        data: payments,
        message: `${payment_ids.length} payments booked successfully`
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get reminders
  static async getReminders(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { filter = 'all-unpaid-overdue' } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      let query = supabase
        .from('invoice_reminders')
        .select(`
          *,
          invoices (
            id,
            invoice_number,
            ocr,
            invoice_date,
            total_amount,
            balance,
            customers (
              id,
              name,
              customer_number
            )
          )
        `)
        .eq('foundation_id', foundation_id);

      // Apply filter
      switch (filter) {
        case 'all-unpaid-overdue':
          query = query.eq('status', 'overdue');
          break;
        case 'reminders-to-send':
          query = query.eq('status', 'pending');
          break;
        case 'external-management':
          query = query.eq('status', 'external');
          break;
        case 'failed':
          query = query.eq('status', 'failed');
          break;
      }

      const { data: reminders, error } = await query;

      if (error) {
        throw createError('Failed to fetch reminders', 500);
      }

      res.json({
        success: true,
        data: reminders
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Send reminders
  static async sendReminders(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const { reminder_ids, reminder_date, print_template, language, distribution_method } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      // Update reminders
      const { data: reminders, error: remindersError } = await supabase
        .from('invoice_reminders')
        .update({
          reminder_date,
          print_template,
          language,
          distribution_method,
          status: 'sent',
          sent_by: user_id,
          sent_at: new Date().toISOString()
        })
        .in('id', reminder_ids)
        .eq('foundation_id', foundation_id)
        .select();

      if (remindersError) {
        throw createError('Failed to send reminders', 500);
      }

      res.json({
        success: true,
        data: reminders,
        message: `${reminder_ids.length} reminders sent successfully`
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create recurring invoice
  static async createRecurringInvoice(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const {
        customer_id,
        recurring_type,
        frequency,
        start_date,
        end_date,
        items,
        invoice_template,
        language,
        distribution_method
      } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      // Create recurring invoice template
      const { data: recurringInvoice, error: recurringError } = await supabase
        .from('recurring_invoices')
        .insert({
          foundation_id,
          customer_id,
          recurring_type,
          frequency,
          start_date,
          end_date,
          invoice_template,
          language,
          distribution_method,
          status: 'active',
          created_by: user_id
        })
        .select()
        .single();

      if (recurringError) {
        throw createError('Failed to create recurring invoice', 500);
      }

      // Create recurring invoice items
      const itemsWithRecurringId = items.map((item: any) => ({
        ...item,
        recurring_invoice_id: recurringInvoice.id,
        foundation_id
      }));

      const { data: recurringItems, error: itemsError } = await supabase
        .from('recurring_invoice_items')
        .insert(itemsWithRecurringId)
        .select();

      if (itemsError) {
        throw createError('Failed to create recurring invoice items', 500);
      }

      res.status(201).json({
        success: true,
        data: {
          ...recurringInvoice,
          items: recurringItems
        },
        message: 'Recurring invoice created successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get invoice services
  static async getInvoiceServices(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: services, error } = await supabase
        .from('invoice_services')
        .select('*')
        .eq('foundation_id', foundation_id);

      if (error) {
        throw createError('Failed to fetch invoice services', 500);
      }

      res.json({
        success: true,
        data: services
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get billing statistics
  static async getBillingStats(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      // Get invoice statistics
      const { data: invoiceStats, error: invoiceError } = await supabase
        .from('invoices')
        .select('status, total_amount, balance')
        .eq('foundation_id', foundation_id);

      if (invoiceError) {
        throw createError('Failed to fetch invoice statistics', 500);
      }

      // Calculate statistics
      const stats = {
        total_invoices: invoiceStats.length,
        total_amount: invoiceStats.reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
        total_balance: invoiceStats.reduce((sum, inv) => sum + (inv.balance || 0), 0),
        unpaid_overdue: invoiceStats.filter(inv => inv.status === 'overdue').length,
        reminders_to_send: 0 // This would be calculated from reminders table
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
