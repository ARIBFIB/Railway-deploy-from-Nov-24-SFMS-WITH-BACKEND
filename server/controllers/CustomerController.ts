import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class CustomerController {
  static getCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('customers')
      .select(`
        *,
        customer_addresses(*),
        customer_contacts(*),
        customer_billing_info(*),
        customer_e_document_settings(*)
      `)
      .eq('foundation_id', foundation_id)
      .order('created_at', { ascending: false });

    const { data: customers, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      customers: customers || [],
      total: customers?.length || 0
    });
  });

  static getCustomerById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_addresses(*),
        customer_contacts(*),
        customer_billing_info(*),
        customer_e_document_settings(*)
      `)
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (error) {
      throw createError('Customer not found', 404);
    }

    res.json({ customer });
  });

  static createCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      customer_number,
      customer_type,
      corporate_personal_id,
      name,
      status,
      industry_code,
      workplace_number,
      store_id,
      notes,
      // Related data
      addresses,
      contacts,
      billing_info,
      e_document_settings
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!name || !customer_number) {
      throw createError('Customer name and number are required', 400);
    }

    // Check if customer number already exists for this foundation
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('foundation_id', foundation_id)
      .eq('customer_number', customer_number)
      .single();

    if (existingCustomer) {
      throw createError('Customer number already exists', 400);
    }

    // Start transaction-like operation
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        foundation_id,
        customer_number,
        customer_type: customer_type || 'business',
        corporate_personal_id,
        name,
        status: status || 'active',
        industry_code,
        workplace_number,
        store_id,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (customerError) {
      throw createError(customerError.message, 400);
    }

    // Insert related data if provided
    if (addresses && addresses.length > 0) {
      const addressData = addresses.map((addr: any) => ({
        customer_id: customer.id,
        ...addr
      }));
      
      await supabase
        .from('customer_addresses')
        .insert(addressData);
    }

    if (contacts && contacts.length > 0) {
      const contactData = contacts.map((contact: any) => ({
        customer_id: customer.id,
        ...contact
      }));
      
      await supabase
        .from('customer_contacts')
        .insert(contactData);
    }

    if (billing_info) {
      await supabase
        .from('customer_billing_info')
        .insert({
          customer_id: customer.id,
          ...billing_info
        });
    }

    if (e_document_settings) {
      await supabase
        .from('customer_e_document_settings')
        .insert({
          customer_id: customer.id,
          ...e_document_settings
        });
    }

    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  });

  static updateCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    // Remove related data from updateData as they are handled separately
    const {
      addresses,
      contacts,
      billing_info,
      e_document_settings,
      ...customerUpdateData
    } = updateData;

    const { data: customer, error } = await supabase
      .from('customers')
      .update({
        ...customerUpdateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .select()
      .single();

    if (error) {
      throw createError('Customer not found or update failed', 404);
    }

    // Update related data if provided
    if (addresses) {
      // Delete existing addresses and insert new ones
      await supabase
        .from('customer_addresses')
        .delete()
        .eq('customer_id', id);

      if (addresses.length > 0) {
        const addressData = addresses.map((addr: any) => ({
          customer_id: id,
          ...addr
        }));
        
        await supabase
          .from('customer_addresses')
          .insert(addressData);
      }
    }

    if (contacts) {
      await supabase
        .from('customer_contacts')
        .delete()
        .eq('customer_id', id);

      if (contacts.length > 0) {
        const contactData = contacts.map((contact: any) => ({
          customer_id: id,
          ...contact
        }));
        
        await supabase
          .from('customer_contacts')
          .insert(contactData);
      }
    }

    if (billing_info) {
      await supabase
        .from('customer_billing_info')
        .upsert({
          customer_id: id,
          ...billing_info
        });
    }

    if (e_document_settings) {
      await supabase
        .from('customer_e_document_settings')
        .upsert({
          customer_id: id,
          ...e_document_settings
        });
    }

    res.json({
      message: 'Customer updated successfully',
      customer
    });
  });

  static deleteCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    // Check if customer exists
    const { data: customer, error: checkError } = await supabase
      .from('customers')
      .select('id')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (checkError) {
      throw createError('Customer not found', 404);
    }

    // Delete related data first (cascade should handle this, but being explicit)
    await supabase
      .from('customer_e_document_settings')
      .delete()
      .eq('customer_id', id);

    await supabase
      .from('customer_billing_info')
      .delete()
      .eq('customer_id', id);

    await supabase
      .from('customer_contacts')
      .delete()
      .eq('customer_id', id);

    await supabase
      .from('customer_addresses')
      .delete()
      .eq('customer_id', id);

    // Delete customer
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete customer', 500);
    }

    res.json({
      message: 'Customer deleted successfully'
    });
  });

  static searchCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, q, status } = req.query;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    let query = supabase
      .from('customers')
      .select('*')
      .eq('foundation_id', foundation_id);

    if (q) {
      query = query.or(`name.ilike.%${q}%,customer_number.ilike.%${q}%,corporate_personal_id.ilike.%${q}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: customers, error } = await query
      .order('name', { ascending: true })
      .limit(50);

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      customers: customers || [],
      total: customers?.length || 0
    });
  });
}
