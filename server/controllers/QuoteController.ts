import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class QuoteController {
  static getQuotes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('quotes')
      .select(`
        *,
        customers(id, name, customer_number),
        quote_items(
          id,
          line_number,
          description,
          quantity,
          unit_price,
          line_total,
          product_id,
          products(article_number, name)
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

    const { data: quotes, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      quotes: quotes || [],
      total: quotes?.length || 0
    });
  });

  static getQuoteById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const { data: quote, error } = await supabase
      .from('quotes')
      .select(`
        *,
        customers(
          id, name, customer_number,
          customer_addresses(*),
          customer_contacts(*),
          customer_billing_info(*)
        ),
        quote_items(
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
          products(article_number, name, sell_price)
        )
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error) {
      throw createError('Quote not found', 404);
    }

    res.json({ quote });
  });

  static createQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      customer_id,
      quote_date,
      valid_until,
      delivery_date,
      quote_text,
      use_as_order_text,
      shipping_fee,
      invoice_fee,
      invoice_discount,
      print_template,
      language,
      distribution_method,
      items = []
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!quote_date) {
      throw createError('Quote date is required', 400);
    }

    // Generate quote number
    const { data: lastQuote, error: lastQuoteError } = await supabase
      .from('quotes')
      .select('quote_number')
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextNumber = lastQuote && !lastQuoteError ? parseInt(lastQuote.quote_number.split('-').pop() || '0') + 1 : 1;
    const quote_number = `Q-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Calculate totals
    let total_amount = 0;
    let total_vat = 0;

    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;
        total_amount += itemTotal;
        total_vat += itemTotal * ((item.vat_rate || 0) / 100);
      });
    }

    // Add fees
    total_amount += parseFloat(shipping_fee || '0') + parseFloat(invoice_fee || '0');
    total_amount -= parseFloat(invoice_discount || '0');

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        foundation_id,
        quote_number,
        customer_id,
        quote_date,
        valid_until,
        delivery_date,
        quote_text,
        use_as_order_text: use_as_order_text || false,
        shipping_fee: parseFloat(shipping_fee || '0'),
        invoice_fee: parseFloat(invoice_fee || '0'),
        invoice_discount: parseFloat(invoice_discount || '0'),
        print_template,
        language: language || 'Swedish',
        distribution_method: distribution_method || 'Printing',
        total_amount,
        total_vat,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (quoteError) {
      throw createError(quoteError.message, 400);
    }

    // Create quote items
    if (items && items.length > 0) {
      const quoteItems = items.map((item: any, index: number) => {
        const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;
        
        return {
          quote_id: quote.id,
          line_number: index + 1,
          product_id: item.product_id,
          article_number: item.article_number,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent || 0,
          discount_amount: discountAmount,
          line_total: itemTotal,
          vat_rate: item.vat_rate || 0,
          vat_amount: itemTotal * ((item.vat_rate || 0) / 100),
          account_number: item.account_number,
          tg_percent: item.tg_percent,
          created_at: new Date().toISOString()
        };
      });

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

      if (itemsError) {
        console.error('Failed to create quote items:', itemsError);
        // Delete the quote since items failed
        await supabase.from('quotes').delete().eq('id', quote.id);
        throw createError('Failed to create quote items', 400);
      }
    }

    res.status(201).json({
      message: 'Quote created successfully',
      quote
    });
  });

  static updateQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;
    const { items, ...quoteUpdateData } = updateData;

    // Update quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .update({
        ...quoteUpdateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (quoteError) {
      throw createError('Quote not found or update failed', 404);
    }

    // Update items if provided
    if (items !== undefined) {
      // Delete existing items
      await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', id);

      // Add new items
      if (items.length > 0) {
        const quoteItems = items.map((item: any, index: number) => {
          const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;
          
          return {
            quote_id: id,
            line_number: index + 1,
            product_id: item.product_id,
            article_number: item.article_number,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            discount_percent: item.discount_percent || 0,
            discount_amount: discountAmount,
            line_total: itemTotal,
            vat_rate: item.vat_rate || 0,
            vat_amount: itemTotal * ((item.vat_rate || 0) / 100),
            account_number: item.account_number,
            tg_percent: item.tg_percent,
            created_at: new Date().toISOString()
          };
        });

        await supabase
          .from('quote_items')
          .insert(quoteItems);
      }

      // Recalculate totals
      let total_amount = 0;
      let total_vat = 0;

      if (items.length > 0) {
        items.forEach((item: any) => {
          const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;
          total_amount += itemTotal;
          total_vat += itemTotal * ((item.vat_rate || 0) / 100);
        });
      }

      // Add fees
      total_amount += parseFloat(quoteUpdateData.shipping_fee || quote.shipping_fee || '0');
      total_amount += parseFloat(quoteUpdateData.invoice_fee || quote.invoice_fee || '0');
      total_amount -= parseFloat(quoteUpdateData.invoice_discount || quote.invoice_discount || '0');

      // Update totals
      await supabase
        .from('quotes')
        .update({
          total_amount,
          total_vat,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    }

    res.json({
      message: 'Quote updated successfully',
      quote
    });
  });

  static deleteQuote = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Check if quote exists
    const { data: quote, error: checkError } = await supabase
      .from('quotes')
      .select('id, status')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Quote not found', 404);
    }

    // Check if quote can be deleted (only draft quotes can be deleted)
    if (quote.status !== 'draft') {
      throw createError('Only draft quotes can be deleted', 400);
    }

    // Delete quote items first
    await supabase
      .from('quote_items')
      .delete()
      .eq('quote_id', id);

    // Delete quote
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete quote', 500);
    }

    res.json({
      message: 'Quote deleted successfully'
    });
  });

  static convertToOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Get the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_items(*)
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (quoteError) {
      throw createError('Quote not found', 404);
    }

    if (quote.status !== 'sent') {
      throw createError('Only sent quotes can be converted to orders', 400);
    }

    // Generate order number
    const { data: lastOrder, error: lastOrderError } = await supabase
      .from('orders')
      .select('order_number')
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextNumber = lastOrder && !lastOrderError ? parseInt(lastOrder.order_number.split('-').pop() || '0') + 1 : 1;
    const order_number = `O-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        foundation_id,
        order_number,
        customer_id: quote.customer_id,
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: quote.delivery_date,
        payment_terms: '30 days',
        total_amount: quote.total_amount,
        total_vat: quote.total_vat,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      throw createError(orderError.message, 400);
    }

    // Create order items
    if (quote.quote_items && quote.quote_items.length > 0) {
      const orderItems = quote.quote_items.map((item: any) => ({
        order_id: order.id,
        line_number: item.line_number,
        product_id: item.product_id,
        article_number: item.article_number,
        description: item.description,
        ordered_quantity: item.quantity,
        delivered_quantity: 0,
        unit: item.unit,
        unit_price: item.unit_price,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        line_total: item.line_total,
        vat_rate: item.vat_rate,
        vat_amount: item.vat_amount,
        account_number: item.account_number,
        tg_percent: item.tg_percent,
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('order_items')
        .insert(orderItems);
    }

    // Update quote status
    await supabase
      .from('quotes')
      .update({
        status: 'converted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    res.json({
      message: 'Quote converted to order successfully',
      order
    });
  });
}
