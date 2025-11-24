import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class ProductController {
  static getProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        product_categories(id, name, description)
      `)
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false });

    // Filter by category if provided
    if (req.query.category_id) {
      query = query.eq('category_id', req.query.category_id);
    }

    // Filter by active status if provided
    if (req.query.is_active !== undefined) {
      query = query.eq('is_active', req.query.is_active === 'true');
    }

    const { data: products, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      products: products || [],
      total: products?.length || 0
    });
  });

  static getProductById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(id, name, description),
        stock_levels(
          warehouse_id,
          quantity,
          reserved_quantity,
          min_stock_level,
          max_stock_level,
          reorder_point,
          warehouses(name, city)
        )
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error) {
      throw createError('Product not found', 404);
    }

    res.json({ product });
  });

  static createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      article_number,
      name,
      description,
      category_id,
      unit,
      purchase_price,
      sell_price,
      currency,
      vat_rate,
      is_active
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!name) {
      throw createError('Product name is required', 400);
    }

    // Check if article number already exists for this foundation (if provided)
    if (article_number) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('foundation_id', foundation_id)
        .eq('article_number', article_number)
        .single();

      if (existingProduct) {
        throw createError('Article number already exists', 400);
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        foundation_id,
        article_number,
        name,
        description,
        category_id,
        unit,
        purchase_price,
        sell_price,
        currency: currency || 'SEK',
        vat_rate: vat_rate || 25.00,
        is_active: is_active !== undefined ? is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        product_categories(id, name, description)
      `)
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  });

  static updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    // If updating article_number, check for duplicates
    if (updateData.article_number) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('foundation_id', foundation_id)
        .eq('article_number', updateData.article_number)
        .neq('id', id)
        .single();

      if (existingProduct) {
        throw createError('Article number already exists', 400);
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select(`
        *,
        product_categories(id, name, description)
      `)
      .single();

    if (error) {
      throw createError('Product not found or update failed', 404);
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  });

  static deleteProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Check if product exists
    const { data: product, error: checkError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Product not found', 404);
    }

    // Check if product is used in any orders or invoices
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    const { data: quoteItems } = await supabase
      .from('quote_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    const { data: invoiceItems } = await supabase
      .from('invoice_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    if (orderItems && orderItems.length > 0) {
      throw createError('Cannot delete product: it is used in orders', 400);
    }

    if (quoteItems && quoteItems.length > 0) {
      throw createError('Cannot delete product: it is used in quotes', 400);
    }

    if (invoiceItems && invoiceItems.length > 0) {
      throw createError('Cannot delete product: it is used in invoices', 400);
    }

    // Delete stock levels first
    await supabase
      .from('stock_levels')
      .delete()
      .eq('product_id', id);

    // Delete stock movements
    await supabase
      .from('stock_movements')
      .delete()
      .eq('product_id', id);

    // Delete product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete product', 500);
    }

    res.json({
      message: 'Product deleted successfully'
    });
  });

  static searchProducts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, q, category_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('products')
      .select(`
        id,
        article_number,
        name,
        sell_price,
        currency,
        is_active,
        product_categories(id, name)
      `)
      .eq('foundation_id', foundation_id)
      .eq('is_active', true);

    if (q) {
      query = query.or(`name.ilike.%${q}%,article_number.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data: products, error } = await query
      .order('name', { ascending: true })
      .limit(50);

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      products: products || [],
      total: products?.length || 0
    });
  });

  static getProductCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: categories, error } = await supabase
      .from('product_categories')
      .select(`
        id,
        name,
        description,
        parent_category_id,
        is_active
      `)
      .eq('foundation_id', foundation_id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      categories: categories || [],
      total: categories?.length || 0
    });
  });

  static createProductCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { name, description, parent_category_id } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!name) {
      throw createError('Category name is required', 400);
    }

    const { data: category, error } = await supabase
      .from('product_categories')
      .insert({
        foundation_id,
        name,
        description,
        parent_category_id,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      message: 'Product category created successfully',
      category
    });
  });
}
