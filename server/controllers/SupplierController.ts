import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class SupplierController {
  static getSuppliers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('suppliers')
      .select(`
        *,
        supplier_addresses(*),
        supplier_contacts(*)
      `)
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }

    const { data: suppliers, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      suppliers: suppliers || [],
      total: suppliers?.length || 0
    });
  });

  static getSupplierById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        supplier_addresses(*),
        supplier_contacts(*)
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error) {
      throw createError('Supplier not found', 404);
    }

    res.json({ supplier });
  });

  static createSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      supplier_number,
      name,
      corporate_personal_id,
      status,
      industry_code,
      notes,
      // Related data
      addresses,
      contacts
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!name || !supplier_number) {
      throw createError('Supplier name and number are required', 400);
    }

    // Check if supplier number already exists for this foundation
    const { data: existingSupplier } = await supabase
      .from('suppliers')
      .select('id')
      .eq('foundation_id', foundation_id)
      .eq('supplier_number', supplier_number)
      .single();

    if (existingSupplier) {
      throw createError('Supplier number already exists', 400);
    }

    // Start transaction-like operation
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .insert({
        foundation_id,
        supplier_number,
        name,
        corporate_personal_id,
        status: status || 'active',
        industry_code,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (supplierError) {
      throw createError(supplierError.message, 400);
    }

    // Insert related data if provided
    if (addresses && addresses.length > 0) {
      const addressData = addresses.map((addr: any) => ({
        supplier_id: supplier.id,
        ...addr
      }));
      
      await supabase
        .from('supplier_addresses')
        .insert(addressData);
    }

    if (contacts && contacts.length > 0) {
      const contactData = contacts.map((contact: any) => ({
        supplier_id: supplier.id,
        ...contact
      }));
      
      await supabase
        .from('supplier_contacts')
        .insert(contactData);
    }

    res.status(201).json({
      message: 'Supplier created successfully',
      supplier
    });
  });

  static updateSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    // Remove related data from updateData as they are handled separately
    const {
      addresses,
      contacts,
      ...supplierUpdateData
    } = updateData;

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .update({
        ...supplierUpdateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (error) {
      throw createError('Supplier not found or update failed', 404);
    }

    // Update related data if provided
    if (addresses) {
      // Delete existing addresses and insert new ones
      await supabase
        .from('supplier_addresses')
        .delete()
        .eq('supplier_id', id);

      if (addresses.length > 0) {
        const addressData = addresses.map((addr: any) => ({
          supplier_id: id,
          ...addr
        }));
        
        await supabase
          .from('supplier_addresses')
          .insert(addressData);
      }
    }

    if (contacts) {
      await supabase
        .from('supplier_contacts')
        .delete()
        .eq('supplier_id', id);

      if (contacts.length > 0) {
        const contactData = contacts.map((contact: any) => ({
          supplier_id: id,
          ...contact
        }));
        
        await supabase
          .from('supplier_contacts')
          .insert(contactData);
      }
    }

    res.json({
      message: 'Supplier updated successfully',
      supplier
    });
  });

  static deleteSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Check if supplier exists
    const { data: supplier, error: checkError } = await supabase
      .from('suppliers')
      .select('id')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Supplier not found', 404);
    }

    // Delete related data first (cascade should handle this, but being explicit)
    await supabase
      .from('supplier_contacts')
      .delete()
      .eq('supplier_id', id);

    await supabase
      .from('supplier_addresses')
      .delete()
      .eq('supplier_id', id);

    // Delete supplier
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete supplier', 500);
    }

    res.json({
      message: 'Supplier deleted successfully'
    });
  });

  static searchSuppliers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, q, status } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('suppliers')
      .select('*')
      .eq('foundation_id', foundation_id);

    if (q) {
      query = query.or(`name.ilike.%${q}%,supplier_number.ilike.%${q}%,corporate_personal_id.ilike.%${q}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: suppliers, error } = await query
      .order('name', { ascending: true })
      .limit(50);

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      suppliers: suppliers || [],
      total: suppliers?.length || 0
    });
  });
}
