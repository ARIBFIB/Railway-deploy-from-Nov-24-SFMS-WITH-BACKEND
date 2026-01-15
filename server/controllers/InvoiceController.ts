import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class InvoiceController {
  static getInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Use global supabase client like QuoteController does
    const client = supabase;

    let query = client
      .from('invoices')
      .select(`
        *,
        customers(id, name, customer_number),
        invoice_items(
          id,
          line_number,
          description,
          quantity,
          unit_price,
          line_total,
          vat_rate,
          vat_amount,
          product_id,
          items:product_id(item_number, name)
        )
      `)
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }

    // Filter by customer if provided
    if (req.query.customer_id) {
      query = query.eq('customer_id', req.query.customer_id);
    }

    // Filter by invoice type if provided
    if (req.query.invoice_type) {
      query = query.eq('invoice_type', req.query.invoice_type);
    }

    const { data: invoices, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      invoices: invoices || [],
      total: invoices?.length || 0
    });
  });

  static getInvoiceById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const client = supabase;

    const { data: invoice, error } = await client
      .from('invoices')
      .select(`
        *,
        customers(
          id, name, customer_number,
          customer_addresses(*),
          customer_contacts(*),
          customer_billing_info(*)
        ),
        orders(id, order_number),
        invoice_items(
          id,
          line_number,
          description,
          quantity,
          unit,
          unit_price,
          discount_percent,
          discount_amount,
          line_total,
          vat_rate,
          vat_amount,
          product_id,
          items:product_id(item_number, name)
        ),
        payments(
          id,
          payment_date,
          amount,
          payment_method,
          reference,
          status
        )
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error) {
      throw createError('Invoice not found', 404);
    }

    res.json({ invoice });
  });

  static createInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // FIX: Read foundation_id from body first (standard for POST), fallback to query
    const foundation_id = req.body.foundation_id || req.query.foundation_id;
    const {
      customer_id,
      order_id,
      invoice_date,
      due_date,
      payment_terms,
      invoice_type,
      currency,
      invoice_address,
      invoice_address_2,
      postcode,
      city,
      country,
      cin,
      your_order_number,
      your_reference,
      our_reference,
      delivery_name,
      delivery_address,
      delivery_address_2,
      delivery_postcode,
      delivery_city,
      delivery_country,
      delivery_date,
      delivery_method,
      shipping_fee,
      invoice_fee,
      invoice_discount_percent,
      price_list,
      prices_incl_vat,
      email,
      phone,
      notes,
      items = []
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!invoice_date) {
      throw createError('Invoice date is required', 400);
    }

    // Generate invoice number - use global supabase client like QuoteController does
    const { data: lastInvoice, error: lastInvoiceError } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // If client fails to read due to RLS, we might need global client just for reading the number sequence?
    // But usually users can read their own invoices.

    const nextNumber = lastInvoice && !lastInvoiceError ? parseInt(lastInvoice.invoice_number.split('-').pop() || '0') + 1 : 1;
    const invoice_number = `I-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Calculate totals
    let subtotal = 0;
    let total_vat = 0;

    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;
        subtotal += itemTotal;
        total_vat += itemTotal * ((item.vat_rate || 0) / 100);
      });
    }

    let total_amount = subtotal + total_vat;
    if (shipping_fee) total_amount += Number(shipping_fee);
    if (invoice_fee) total_amount += Number(invoice_fee);

    // Apply invoice discount
    if (invoice_discount_percent) {
      total_amount = total_amount * (1 - (invoice_discount_percent / 100));
    }

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        foundation_id,
        invoice_number,
        customer_id,
        order_id,
        user_id: req.user?.userId, // Add user_id to satisfy RLS policy
        invoice_date,
        due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        payment_terms: payment_terms || '30 days',
        invoice_type: invoice_type || 'invoice',
        currency: currency || 'SEK',
        invoice_address,
        invoice_address_2,
        postcode,
        city,
        country,
        cin,
        your_order_number,
        your_reference,
        our_reference,
        delivery_name,
        delivery_address,
        delivery_address_2,
        delivery_postcode,
        delivery_city,
        delivery_country,
        delivery_date,
        delivery_method,
        shipping_fee: shipping_fee || 0,
        invoice_fee: invoice_fee || 0,
        invoice_discount_percent: invoice_discount_percent || 0,
        price_list,
        prices_incl_vat: prices_incl_vat || false,
        email,
        phone,
        subtotal,
        total_vat,
        total_amount,
        status: 'draft',
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id, invoice_number, status, created_at, updated_at')
      .single();

    if (invoiceError) {
      console.error('Invoice creation failed:', invoiceError);
      throw createError(invoiceError.message, 400);
    }

    // Create invoice items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item: any, index: number) => {
        const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;

        return {
          invoice_id: invoice.id,
          line_number: index + 1,
          product_id: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent || 0,
          discount_amount: discountAmount,
          line_total: itemTotal,
          vat_rate: item.vat_rate || 0,
          vat_amount: itemTotal * ((item.vat_rate || 0) / 100),
          created_at: new Date().toISOString()
        };
      });

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) {
        console.error('Failed to create invoice items:', itemsError);
        // Delete the invoice since items failed
        await supabase.from('invoices').delete().eq('id', invoice.id);
        throw createError('Failed to create invoice items', 400);
      }
    }

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  });

  static updateInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;
    const { items, ...invoiceUpdateData } = updateData;

    const client = supabase;

    // Update invoice
    const { data: invoice, error: invoiceError } = await client
      .from('invoices')
      .update({
        ...invoiceUpdateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (invoiceError) {
      throw createError('Invoice not found or update failed', 404);
    }

    // Update items if provided
    if (items !== undefined) {
      // Delete existing items
      await client
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id);

      // Add new items
      if (items.length > 0) {
        const invoiceItems = items.map((item: any, index: number) => {
          const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;

          return {
            invoice_id: id,
            line_number: index + 1,
            product_id: item.product_id,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            discount_percent: item.discount_percent || 0,
            discount_amount: discountAmount,
            line_total: itemTotal,
            vat_rate: item.vat_rate || 0,
            vat_amount: itemTotal * ((item.vat_rate || 0) / 100),
            created_at: new Date().toISOString()
          };
        });

        await client
          .from('invoice_items')
          .insert(invoiceItems);
      }

      // Recalculate totals
      let subtotal = 0;
      let total_vat = 0;

      if (items.length > 0) {
        items.forEach((item: any) => {
          const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;
          subtotal += itemTotal;
          total_vat += itemTotal * ((item.vat_rate || 0) / 100);
        });
      }

      let total_amount = subtotal + total_vat;

      const shippingFee = invoice.shipping_fee || 0;
      const invoiceFee = invoice.invoice_fee || 0;
      const invoiceDiscountPercent = invoice.invoice_discount_percent || 0;

      if (shippingFee) total_amount += Number(shippingFee);
      if (invoiceFee) total_amount += Number(invoiceFee);

      if (invoiceDiscountPercent) {
        total_amount = total_amount * (1 - (invoiceDiscountPercent / 100));
      }

      // Update totals
      await client
        .from('invoices')
        .update({
          subtotal,
          total_vat,
          total_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  });

  static deleteInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const client = supabase;

    // Check if invoice exists
    const { data: invoice, error: checkError } = await client
      .from('invoices')
      .select('id, status')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Invoice not found', 404);
    }

    // Check if invoice can be deleted (only draft invoices can be deleted)
    if (invoice.status !== 'draft') {
      throw createError('Only draft invoices can be deleted', 400);
    }

    // Delete related data first
    await client
      .from('payments')
      .delete()
      .eq('invoice_id', id);

    await client
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    // Delete invoice
    const { error } = await client
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete invoice', 500);
    }

    res.json({
      message: 'Invoice deleted successfully'
    });
  });

  static markAsPaid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const { payment_method, payment_date, reference } = req.body;

    const client = supabase;

    const { data: invoice, error: invoiceError } = await client
      .from('invoices')
      .select('id, total_amount')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (invoiceError) {
      throw createError('Invoice not found', 404);
    }

    // Update invoice status
    const { error: updateError } = await client
      .from('invoices')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      throw createError('Failed to update invoice status', 500);
    }

    // Create payment record
    const { error: paymentError } = await client
      .from('payments')
      .insert({
        invoice_id: id,
        amount: invoice.total_amount,
        payment_date: payment_date || new Date().toISOString().split('T')[0],
        payment_method: payment_method || 'bank_transfer',
        reference: reference,
        status: 'completed',
        created_at: new Date().toISOString()
      });

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      // Don't fail the request since invoice is already marked as paid
    }

    res.json({
      message: 'Invoice marked as paid successfully'
    });
  });

  static sendInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const client = supabase;

    const { data: invoice, error } = await client
      .from('invoices')
      .select('id, status, invoice_number')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error || !invoice) {
      console.error('Invoice fetch error:', error);
      throw createError('Invoice not found', 404);
    }

    if (invoice.status !== 'draft') {
      throw createError('Only draft invoices can be sent', 400);
    }

    // Update invoice status to sent
    const { error: updateError } = await client
      .from('invoices')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (updateError) {
      console.error('Update invoice error:', updateError);
      throw createError('Failed to send invoice: ' + updateError.message, 500);
    }

    // Here you would typically integrate with email service
    // For now, we'll just log the action
    console.log(`Invoice ${invoice.invoice_number} sent successfully`);

    res.json({
      message: 'Invoice sent successfully'
    });
  });

  static getInvoiceStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const client = supabase;

    // Get invoice statistics
    const { data: stats, error } = await client
      .from('invoices')
      .select('status, total_amount')
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError(error.message, 500);
    }

    const invoiceStats = {
      total: stats.length,
      draft: stats.filter(s => s.status === 'draft').length,
      sent: stats.filter(s => s.status === 'sent').length,
      paid: stats.filter(s => s.status === 'paid').length,
      overdue: stats.filter(s => s.status === 'overdue').length,
      total_amount: stats.reduce((sum, s) => sum + (s.total_amount || 0), 0),
      outstanding_amount: stats
        .filter(s => ['sent', 'overdue'].includes(s.status))
        .reduce((sum, s) => sum + (s.total_amount || 0), 0)
    };

    res.json({ stats: invoiceStats });
  });
}

