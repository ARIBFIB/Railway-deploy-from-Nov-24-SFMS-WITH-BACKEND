import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class OrderController {
  static getOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        customers(id, name, customer_number),
        order_items(
          id,
          line_number,
          description,
          ordered_quantity,
          delivered_quantity,
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

    const { data: orders, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      orders: orders || [],
      total: orders?.length || 0
    });
  });

  static getOrderById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers(
          id, name, customer_number,
          customer_addresses(*),
          customer_contacts(*),
          customer_billing_info(*)
        ),
        order_items(
          id,
          line_number,
          description,
          ordered_quantity,
          delivered_quantity,
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
      throw createError('Order not found', 404);
    }

    res.json({ order });
  });

  static createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      customer_id,
      order_date,
      delivery_date,
      order_type,
      payment_terms,
      our_reference,
      your_order_number,
      your_reference,
      labels,
      price_list,
      prices_incl_vat,
      currency,
      course,
      unit,
      vat_type,
      items = []
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!order_date) {
      throw createError('Order date is required', 400);
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

    // Calculate totals
    let total_amount = 0;
    let total_vat = 0;

    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const lineTotal = (item.ordered_quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;
        total_amount += itemTotal;
        total_vat += itemTotal * ((item.vat_rate || 0) / 100);
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        foundation_id,
        order_number,
        customer_id,
        order_date,
        delivery_date,
        order_type: order_type || 'order',
        payment_terms,
        our_reference,
        your_order_number,
        your_reference,
        labels,
        price_list,
        prices_incl_vat: prices_incl_vat || false,
        currency: currency || 'SEK',
        course: course || 1.0000,
        unit: unit || 1,
        vat_type,
        total_amount,
        total_vat,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      throw createError(orderError.message, 400);
    }

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any, index: number) => {
        const lineTotal = (item.ordered_quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;
        
        return {
          order_id: order.id,
          line_number: index + 1,
          product_id: item.product_id,
          article_number: item.article_number,
          description: item.description,
          ordered_quantity: item.ordered_quantity,
          delivered_quantity: 0,
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
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Failed to create order items:', itemsError);
        // Delete the order since items failed
        await supabase.from('orders').delete().eq('id', order.id);
        throw createError('Failed to create order items', 400);
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  });

  static updateOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;
    const { items, ...orderUpdateData } = updateData;

    // Update order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        ...orderUpdateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (orderError) {
      throw createError('Order not found or update failed', 404);
    }

    // Update items if provided
    if (items !== undefined) {
      // Delete existing items
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      // Add new items
      if (items.length > 0) {
        const orderItems = items.map((item: any, index: number) => {
          const lineTotal = (item.ordered_quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;
          
          return {
            order_id: id,
            line_number: index + 1,
            product_id: item.product_id,
            article_number: item.article_number,
            description: item.description,
            ordered_quantity: item.ordered_quantity,
            delivered_quantity: item.delivered_quantity || 0,
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
          .from('order_items')
          .insert(orderItems);
      }

      // Recalculate totals
      let total_amount = 0;
      let total_vat = 0;

      if (items.length > 0) {
        items.forEach((item: any) => {
          const lineTotal = (item.ordered_quantity || 0) * (item.unit_price || 0);
          const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
          const itemTotal = lineTotal - discountAmount;
          total_amount += itemTotal;
          total_vat += itemTotal * ((item.vat_rate || 0) / 100);
        });
      }

      // Update totals
      await supabase
        .from('orders')
        .update({
          total_amount,
          total_vat,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    }

    res.json({
      message: 'Order updated successfully',
      order
    });
  });

  static deleteOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Check if order exists
    const { data: order, error: checkError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Order not found', 404);
    }

    // Check if order can be deleted (only draft orders can be deleted)
    if (order.status !== 'draft') {
      throw createError('Only draft orders can be deleted', 400);
    }

    // Delete order items first
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    // Delete order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete order', 500);
    }

    res.json({
      message: 'Order deleted successfully'
    });
  });

  static updateDeliveryStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const { delivered_quantities } = req.body; // Array of { item_id, delivered_quantity }

    // Update order items with delivered quantities
    for (const item of delivered_quantities) {
      await supabase
        .from('order_items')
        .update({
          delivered_quantity: item.delivered_quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.item_id)
        .eq('order_id', id);
    }

    // Check if all items are fully delivered
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('ordered_quantity, delivered_quantity')
      .eq('order_id', id);

    if (itemsError) {
      throw createError('Failed to check delivery status', 500);
    }

    const allDelivered = orderItems.every(item => 
      item.delivered_quantity >= item.ordered_quantity
    );

    // Update order status if fully delivered
    if (allDelivered) {
      await supabase
        .from('orders')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('foundation_id', foundation_id);
    }

    res.json({
      message: 'Delivery status updated successfully'
    });
  });

  static convertToInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (orderError) {
      throw createError('Order not found', 404);
    }

    if (order.status !== 'confirmed') {
      throw createError('Only confirmed orders can be converted to invoices', 400);
    }

    // Generate invoice number
    const { data: lastInvoice, error: lastInvoiceError } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextNumber = lastInvoice && !lastInvoiceError ? parseInt(lastInvoice.invoice_number.split('-').pop() || '0') + 1 : 1;
    const invoice_number = `I-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        foundation_id,
        invoice_number,
        customer_id: order.customer_id,
        order_id: order.id,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        payment_terms: order.payment_terms || '30 days',
        subtotal: order.total_amount - order.total_vat,
        total_vat: order.total_vat,
        total_amount: order.total_amount,
        status: 'sent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (invoiceError) {
      throw createError(invoiceError.message, 400);
    }

    // Create invoice items
    if (order.order_items && order.order_items.length > 0) {
      const invoiceItems = order.order_items.map((item: any) => ({
        invoice_id: invoice.id,
        line_number: item.line_number,
        product_id: item.product_id,
        description: item.description,
        quantity: item.ordered_quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        line_total: item.line_total,
        vat_rate: item.vat_rate,
        vat_amount: item.vat_amount,
        account_number: item.account_number,
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('invoice_items')
        .insert(invoiceItems);
    }

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'invoiced',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    res.json({
      message: 'Order converted to invoice successfully',
      invoice
    });
  });
}
