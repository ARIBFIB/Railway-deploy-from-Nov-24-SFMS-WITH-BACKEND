import { Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../utils/errorHandler';

export class CustomerController {
  static getCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { foundation_id } = req.query;

    if (!foundation_id) {
      return next(createError('Foundation ID is required', 400));
    }

    try {
      const { data: customers, error } = await supabase
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

      if (error) throw error;

      res.json({
        success: true,
        customers: customers || [],
        total: customers?.length || 0
      });
    } catch (error) {
      next(error);
    }
  });

  static getCustomerById = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    try {
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
        return next(createError('Customer not found', 404));
      }

      res.json({
        success: true,
        customer
      });
    } catch (error) {
      next(error);
    }
  });

  static createCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
      addresses,
      contacts,
      billing_info,
      e_document_settings
    } = req.body;

    if (!foundation_id) {
      return next(createError('Foundation ID is required', 400));
    }

    if (!name || !customer_number) {
      return next(createError('Customer name and number are required', 400));
    }

    try {
      console.log('🔍 CustomerController.createCustomer - Supabase Client State:', {
        supabaseUrl: (supabase as any).supabaseUrl,
        hasKey: !!(supabase as any).supabaseKey,
        keyLength: (supabase as any).supabaseKey?.length,
        isServiceRole: (supabase as any).supabaseKey?.includes('service_role') || (supabase as any).supabaseKey?.length > 100
      });

      // Check if customer number already exists
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('foundation_id', foundation_id)
        .eq('customer_number', customer_number)
        .maybeSingle();

      if (existing) {
        return next(createError('Customer number already exists', 400));
      }

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
          notes
        })
        .select()
        .single();

      if (customerError) {
        console.error('❌ Error creating customer record:', customerError);
        throw customerError;
      }

      console.log('✅ Customer record created:', customer.id);

      // Related data inserts
      try {
        if (addresses?.length > 0) {
          console.log(`Inserting ${addresses.length} addresses...`);
          const { error: addrError } = await supabase.from('customer_addresses').insert(
            addresses.map((a: any) => ({ ...a, customer_id: customer.id }))
          );
          if (addrError) {
            console.error('❌ Error inserting customer addresses:', addrError);
            throw addrError;
          }
        }

        if (contacts?.length > 0) {
          console.log(`Inserting ${contacts.length} contacts...`);
          const { error: contactError } = await supabase.from('customer_contacts').insert(
            contacts.map((c: any) => ({ ...c, customer_id: customer.id }))
          );
          if (contactError) {
            console.error('❌ Error inserting customer contacts:', contactError);
            throw contactError;
          }
        }

        if (billing_info) {
          console.log('Inserting billing info...');
          const { error: billingError } = await supabase.from('customer_billing_info').insert({ ...billing_info, customer_id: customer.id });
          if (billingError) {
            console.error('❌ Error inserting customer billing info:', billingError);
            throw billingError;
          }
        }

        if (e_document_settings) {
          console.log('Inserting e-document settings...');
          const { error: edocError } = await supabase.from('customer_e_document_settings').insert({ ...e_document_settings, customer_id: customer.id });
          if (edocError) {
            console.error('❌ Error inserting customer e-document settings:', edocError);
            throw edocError;
          }
        }
      } catch (relatedError: any) {
        console.error('❌ Error during related data insertion:', relatedError);
        // We could potentially delete the customer here if we want atomic behavior
        // but for now let's just throw so the user knows it failed.
        throw relatedError;
      }

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        customer
      });
    } catch (error: any) {
      console.error('❌ Create Customer Failure:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      next(error);
    }
  });

  static updateCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const {
      addresses,
      contacts,
      billing_info,
      e_document_settings,
      ...customerUpdateData
    } = req.body;

    try {
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
        return next(createError('Customer not found or update failed', 404));
      }

      // Update related tables - delete and re-insert for simplicity/consistency
      if (addresses) {
        await supabase.from('customer_addresses').delete().eq('customer_id', id);
        if (addresses.length > 0) {
          await supabase.from('customer_addresses').insert(
            addresses.map((a: any) => ({ ...a, customer_id: id }))
          );
        }
      }

      if (contacts) {
        await supabase.from('customer_contacts').delete().eq('customer_id', id);
        if (contacts.length > 0) {
          await supabase.from('customer_contacts').insert(
            contacts.map((c: any) => ({ ...c, customer_id: id }))
          );
        }
      }

      if (billing_info) {
        await supabase.from('customer_billing_info').upsert({ ...billing_info, customer_id: id });
      }

      if (e_document_settings) {
        await supabase.from('customer_e_document_settings').upsert({ ...e_document_settings, customer_id: id });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      next(error);
    }
  });

  static deleteCustomer = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  });

  static searchCustomers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { foundation_id, q, status } = req.query;

    if (!foundation_id) {
      return next(createError('Foundation ID is required', 400));
    }

    try {
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

      if (error) throw error;

      res.json({
        success: true,
        customers: customers || [],
        total: customers?.length || 0
      });
    } catch (error) {
      next(error);
    }
  });
}
