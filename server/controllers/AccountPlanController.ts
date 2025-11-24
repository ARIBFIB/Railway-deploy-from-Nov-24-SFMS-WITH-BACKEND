import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class AccountPlanController {
  // Purchase Categories Management
  static getPurchaseCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status } = req.query;

    let query = supabase
      .from('purchase_categories')
      .select(`
        *,
        purchase_types(*)
      `)
      .order('name', { ascending: true });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: categories, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: categories || [],
      total: categories?.length || 0
    });
  });

  static getPurchaseCategoryById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('purchase_categories')
      .select(`
        *,
        purchase_types(*)
      `)
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: category, error } = await query.single();

    if (error || !category) {
      throw createError('Purchase category not found', 404);
    }

    res.json({
      success: true,
      data: category
    });
  });

  static createPurchaseCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      name,
      icon,
      description,
      is_expanded,
      is_locked
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: category, error } = await supabase
      .from('purchase_categories')
      .insert({
        foundation_id,
        name,
        icon,
        description,
        is_expanded: is_expanded !== undefined ? is_expanded : true,
        is_locked: is_locked || false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Purchase category created successfully',
      data: category
    });
  });

  static updatePurchaseCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('purchase_categories')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: category, error } = await query.select().single();

    if (error || !category) {
      throw createError('Purchase category not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Purchase category updated successfully',
      data: category
    });
  });

  static deletePurchaseCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('purchase_categories')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete purchase category', 500);
    }

    res.json({
      success: true,
      message: 'Purchase category deleted successfully'
    });
  });

  // Purchase Types Management
  static getPurchaseTypes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, category_id, status } = req.query;

    let query = supabase
      .from('purchase_types')
      .select(`
        *,
        purchase_categories(*)
      `)
      .order('name', { ascending: true });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: purchaseTypes, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: purchaseTypes || [],
      total: purchaseTypes?.length || 0
    });
  });

  static getPurchaseTypeById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('purchase_types')
      .select(`
        *,
        purchase_categories(*)
      `)
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: purchaseType, error } = await query.single();

    if (error || !purchaseType) {
      throw createError('Purchase type not found', 404);
    }

    res.json({
      success: true,
      data: purchaseType
    });
  });

  static createPurchaseType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      category_id,
      name,
      account,
      account_name,
      is_locked
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: purchaseType, error } = await supabase
      .from('purchase_types')
      .insert({
        foundation_id,
        category_id,
        name,
        account,
        account_name,
        is_locked: is_locked || false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Purchase type created successfully',
      data: purchaseType
    });
  });

  static updatePurchaseType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('purchase_types')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: purchaseType, error } = await query.select().single();

    if (error || !purchaseType) {
      throw createError('Purchase type not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Purchase type updated successfully',
      data: purchaseType
    });
  });

  static deletePurchaseType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('purchase_types')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete purchase type', 500);
    }

    res.json({
      success: true,
      message: 'Purchase type deleted successfully'
    });
  });

  static bulkUpdatePurchaseTypes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { purchase_type_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: purchaseTypes, error } = await supabase
      .from('purchase_types')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', purchase_type_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update purchase types', 500);
    }

    res.json({
      success: true,
      message: `${purchaseTypes?.length || 0} purchase types updated successfully`,
      data: purchaseTypes
    });
  });

  // Bulk Operations
  static bulkUpdateCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { category_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: categories, error } = await supabase
      .from('purchase_categories')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', category_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update purchase categories', 500);
    }

    res.json({
      success: true,
      message: `${categories?.length || 0} purchase categories updated successfully`,
      data: categories
    });
  });

  static bulkDeleteCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { category_ids } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { error } = await supabase
      .from('purchase_categories')
      .delete()
      .in('id', category_ids)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete purchase categories', 500);
    }

    res.json({
      success: true,
      message: `${category_ids.length} purchase categories deleted successfully`
    });
  });

  static bulkDeletePurchaseTypes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { purchase_type_ids } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { error } = await supabase
      .from('purchase_types')
      .delete()
      .in('id', purchase_type_ids)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete purchase types', 500);
    }

    res.json({
      success: true,
      message: `${purchase_type_ids.length} purchase types deleted successfully`
    });
  });
}
