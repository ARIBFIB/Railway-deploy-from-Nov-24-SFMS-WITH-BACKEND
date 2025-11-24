import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class PersonnelController {
  // Employee Management
  static getEmployees = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status, search } = req.query;

    let query = supabase
      .from('employees')
      .select(`
        *,
        employee_addresses(*),
        employee_bank_details(*),
        employee_emergency_contacts(*),
        employee_tax_info(*),
        employee_holidays(*)
      `)
      .order('created_at', { ascending: false });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    if (status === 'active') {
      query = query.eq('is_active', true).eq('is_complete', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    } else if (status === 'notComplete') {
      query = query.eq('is_complete', false);
    }

    if (search) {
      query = query.or(`employment_id.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,social_security_number.ilike.%${search}%`);
    }

    const { data: employees, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: employees || [],
      total: employees?.length || 0
    });
  });

  static getEmployeeById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('employees')
      .select(`
        *,
        employee_addresses(*),
        employee_bank_details(*),
        employee_emergency_contacts(*),
        employee_tax_info(*),
        employee_holidays(*)
      `)
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: employee, error } = await query.single();

    if (error || !employee) {
      throw createError('Employee not found', 404);
    }

    res.json({
      success: true,
      data: employee
    });
  });

  static createEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      employment_id,
      first_name,
      last_name,
      social_security_number,
      staff_type,
      agreement_for_salaries,
      agreement_template,
      salary_form,
      type_of_pay_slip,
      calendar_permissions,
      addresses,
      bank_details,
      emergency_contacts,
      tax_info,
      holidays
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Create employee
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        foundation_id,
        employment_id,
        first_name,
        last_name,
        social_security_number,
        staff_type,
        agreement_for_salaries,
        agreement_template,
        salary_form,
        type_of_pay_slip,
        calendar_permissions,
        is_active: true,
        is_complete: true
      })
      .select()
      .single();

    if (employeeError) {
      throw createError(employeeError.message, 400);
    }

    // Create related records
    const promises = [];

    // Addresses
    if (addresses && addresses.length > 0) {
      const addressPromises = addresses.map((address: any) =>
        supabase.from('employee_addresses').insert({
          employee_id: employee.id,
          ...address
        })
      );
      promises.push(...addressPromises);
    }

    // Bank details
    if (bank_details) {
      promises.push(
        supabase.from('employee_bank_details').insert({
          employee_id: employee.id,
          ...bank_details
        })
      );
    }

    // Emergency contacts
    if (emergency_contacts && emergency_contacts.length > 0) {
      const contactPromises = emergency_contacts.map((contact: any) =>
        supabase.from('employee_emergency_contacts').insert({
          employee_id: employee.id,
          ...contact
        })
      );
      promises.push(...contactPromises);
    }

    // Tax info
    if (tax_info) {
      promises.push(
        supabase.from('employee_tax_info').insert({
          employee_id: employee.id,
          ...tax_info
        })
      );
    }

    // Holidays
    if (holidays && holidays.length > 0) {
      const holidayPromises = holidays.map((holiday: any) =>
        supabase.from('employee_holidays').insert({
          employee_id: employee.id,
          ...holiday
        })
      );
      promises.push(...holidayPromises);
    }

    // Execute all related inserts
    if (promises.length > 0) {
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Error creating related records:', errors);
        // Don't throw error, just log it
      }
    }

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  });

  static updateEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('employees')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: employee, error } = await query.select().single();

    if (error || !employee) {
      throw createError('Employee not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  });

  static deleteEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete employee', 500);
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  });

  static bulkUpdateEmployees = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { employee_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: employees, error } = await supabase
      .from('employees')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', employee_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update employees', 500);
    }

    res.json({
      success: true,
      message: `${employees?.length || 0} employees updated successfully`,
      data: employees
    });
  });

  static bulkDeleteEmployees = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { employee_ids } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { error } = await supabase
      .from('employees')
      .delete()
      .in('id', employee_ids)
      .eq('foundation_id', foundation_id);

    if (error) {
      throw createError('Failed to delete employees', 500);
    }

    res.json({
      success: true,
      message: `${employee_ids.length} employees deleted successfully`
    });
  });

  // Employee Address Management
  static getEmployeeAddresses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { employee_id } = req.params;

    const { data: addresses, error } = await supabase
      .from('employee_addresses')
      .select('*')
      .eq('employee_id', employee_id)
      .order('is_primary', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: addresses || []
    });
  });

  static createEmployeeAddress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { employee_id } = req.params;
    const addressData = req.body;

    const { data: address, error } = await supabase
      .from('employee_addresses')
      .insert({
        employee_id,
        ...addressData
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Employee address created successfully',
      data: address
    });
  });

  // Employee Holiday Management
  static getEmployeeHolidays = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { employee_id } = req.params;
    const { year } = req.query;

    let query = supabase
      .from('employee_holidays')
      .select('*')
      .eq('employee_id', employee_id);

    if (year) {
      query = query.eq('year', year);
    }

    query = query.order('year', { ascending: false });

    const { data: holidays, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: holidays || []
    });
  });

  static createEmployeeHoliday = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { employee_id } = req.params;
    const { year, total_days, used_days } = req.body;

    const remaining_days = (total_days || 25) - (used_days || 0);

    const { data: holiday, error } = await supabase
      .from('employee_holidays')
      .insert({
        employee_id,
        year,
        total_days: total_days || 25,
        used_days: used_days || 0,
        remaining_days
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Employee holiday record created successfully',
      data: holiday
    });
  });

  static updateEmployeeHoliday = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { total_days, used_days } = req.body;

    const remaining_days = total_days - used_days;

    const { data: holiday, error } = await supabase
      .from('employee_holidays')
      .update({
        total_days,
        used_days,
        remaining_days
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !holiday) {
      throw createError('Holiday record not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Employee holiday record updated successfully',
      data: holiday
    });
  });
}
