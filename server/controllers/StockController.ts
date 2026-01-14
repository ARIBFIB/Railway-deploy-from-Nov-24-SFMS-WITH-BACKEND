import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class StockController {
  static getStockLevels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const foundationId = foundation_id as string || req.user?.foundation_id;

    if (!foundationId) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('stock_levels')
      .select(`
        *,
        items:product_id (
          id,
          name,
          item_number,
          unit
        ),
        warehouses:warehouse_id (
          id,
          name,
          location
        )
      `)
      .eq('foundation_id', foundationId);

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: data || []
    });
  });

  static getStockLevelById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { data, error } = await supabase
      .from('stock_levels')
      .select(`
        *,
        items:product_id (
          id,
          name,
          item_number,
          unit
        ),
        warehouses:warehouse_id (
          id,
          name,
          location
        )
      `)
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .single();

    if (error) {
      throw createError('Stock level not found', 404);
    }

    res.json({
      success: true,
      data
    });
  });

  static createStockMovement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.id;
    const { product_id, warehouse_id, movement_type, quantity, reference_type, reference_id, notes } = req.body;

    if (!foundationId || !product_id || !movement_type || !quantity) {
      throw createError('Foundation ID, product ID, movement type, and quantity are required', 400);
    }

    // Create stock movement
    const { data: movement, error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        foundation_id: foundationId,
        product_id,
        warehouse_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        notes,
        created_by: userId
      })
      .select()
      .single();

    if (movementError) {
      throw createError(movementError.message, 500);
    }

    // Update stock level
    const { data: stockLevel } = await supabase
      .from('stock_levels')
      .select('quantity, reserved_quantity')
      .eq('foundation_id', foundationId)
      .eq('product_id', product_id)
      .eq('warehouse_id', warehouse_id)
      .single();

    if (stockLevel) {
      let newQuantity = stockLevel.quantity;

      if (movement_type === 'in') {
        newQuantity = parseFloat(stockLevel.quantity) + parseFloat(quantity);
      } else if (movement_type === 'out') {
        newQuantity = parseFloat(stockLevel.quantity) - parseFloat(quantity);
      }

      await supabase
        .from('stock_levels')
        .update({
          quantity: newQuantity,
          last_updated: new Date().toISOString()
        })
        .eq('foundation_id', foundationId)
        .eq('product_id', product_id)
        .eq('warehouse_id', warehouse_id);
    }

    res.json({
      success: true,
      data: movement
    });
  });

  static getStockMovements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, product_id, warehouse_id } = req.query;
    const foundationId = foundation_id as string || req.user?.foundation_id;

    if (!foundationId) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        items:product_id (
          id,
          name,
          item_number
        ),
        warehouses:warehouse_id (
          id,
          name
        ),
        profiles:created_by (
          id,
          full_name
        )
      `)
      .eq('foundation_id', foundationId)
      .order('created_at', { ascending: false });

    if (product_id) {
      query = query.eq('product_id', product_id);
    }
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id);
    }

    const { data, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: data || []
    });
  });

  static getWarehouses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status } = req.query;
    const foundationId = foundation_id as string || req.user?.foundation_id;

    if (!foundationId) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('warehouses')
      .select('*')
      .eq('foundation_id', foundationId);

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    query = query.order('name');

    const { data, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: data || []
    });
  });

  static getWarehouseById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .single();

    if (error) {
      throw createError('Warehouse not found', 404);
    }

    res.json({
      success: true,
      data
    });
  });

  static createWarehouse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { name, location, description } = req.body;

    if (!foundationId || !name) {
      throw createError('Foundation ID and name are required', 400);
    }

    const { data, error } = await supabase
      .from('warehouses')
      .insert({
        foundation_id: foundationId,
        name,
        location,
        description
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data
    });
  });

  static updateWarehouse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const { name, location, description, is_active } = req.body;

    const { data, error } = await supabase
      .from('warehouses')
      .update({
        name,
        location,
        description,
        is_active
      })
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .select()
      .single();

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data
    });
  });

  static deleteWarehouse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundationId);

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      message: 'Warehouse deleted successfully'
    });
  });
}
