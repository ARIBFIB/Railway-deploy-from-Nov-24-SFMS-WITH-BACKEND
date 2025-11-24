import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class WageTypesController {
  // Wage Types Management
  static getWageTypes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, staff_type, agreement_template, status } = req.query;

    let query = supabase
      .from('wage_types')
      .select('*')
      .order('salary_type', { ascending: true });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: wageTypes, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: wageTypes || [],
      total: wageTypes?.length || 0
    });
  });

  static getWageTypeById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('wage_types')
      .select('*')
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: wageType, error } = await query.single();

    if (error || !wageType) {
      throw createError('Wage type not found', 404);
    }

    res.json({
      success: true,
      data: wageType
    });
  });

  static createWageType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      salary_type,
      name,
      category,
      unit,
      formula,
      preliminary_tax,
      employer_contribution,
      preselected_account
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: wageType, error } = await supabase
      .from('wage_types')
      .insert({
        foundation_id,
        salary_type,
        name,
        category,
        unit,
        formula,
        preliminary_tax,
        employer_contribution,
        preselected_account,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Wage type created successfully',
      data: wageType
    });
  });

  static updateWageType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('wage_types')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: wageType, error } = await query.select().single();

    if (error || !wageType) {
      throw createError('Wage type not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Wage type updated successfully',
      data: wageType
    });
  });

  static deleteWageType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('wage_types')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete wage type', 500);
    }

    res.json({
      success: true,
      message: 'Wage type deleted successfully'
    });
  });

  static bulkUpdateWageTypes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { wage_type_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: wageTypes, error } = await supabase
      .from('wage_types')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', wage_type_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update wage types', 500);
    }

    res.json({
      success: true,
      message: `${wageTypes?.length || 0} wage types updated successfully`,
      data: wageTypes
    });
  });

  // Registration Codes Management
  static getRegistrationCodes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status } = req.query;

    let query = supabase
      .from('registration_codes')
      .select('*')
      .order('code', { ascending: true });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: registrationCodes, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: registrationCodes || [],
      total: registrationCodes?.length || 0
    });
  });

  static createRegistrationCode = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      code,
      name,
      used,
      employee
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: registrationCode, error } = await supabase
      .from('registration_codes')
      .insert({
        foundation_id,
        code,
        name,
        used: used || false,
        employee: employee || false,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Registration code created successfully',
      data: registrationCode
    });
  });

  static updateRegistrationCode = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('registration_codes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: registrationCode, error } = await query.select().single();

    if (error || !registrationCode) {
      throw createError('Registration code not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Registration code updated successfully',
      data: registrationCode
    });
  });

  static bulkUpdateRegistrationCodes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { registration_code_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: registrationCodes, error } = await supabase
      .from('registration_codes')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', registration_code_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update registration codes', 500);
    }

    res.json({
      success: true,
      message: `${registrationCodes?.length || 0} registration codes updated successfully`,
      data: registrationCodes
    });
  });

  // Wage Type Controls Management
  static getWageTypeControls = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status } = req.query;

    let query = supabase
      .from('wage_type_controls')
      .select('*')
      .order('registration_code', { ascending: true });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data: wageTypeControls, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: wageTypeControls || [],
      total: wageTypeControls?.length || 0
    });
  });

  static createWageTypeControl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      registration_code,
      day_code,
      salary_type
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: wageTypeControl, error } = await supabase
      .from('wage_type_controls')
      .insert({
        foundation_id,
        registration_code,
        day_code,
        salary_type,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Wage type control created successfully',
      data: wageTypeControl
    });
  });

  static updateWageTypeControl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('wage_type_controls')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: wageTypeControl, error } = await query.select().single();

    if (error || !wageTypeControl) {
      throw createError('Wage type control not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Wage type control updated successfully',
      data: wageTypeControl
    });
  });

  static bulkUpdateWageTypeControls = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { wage_type_control_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: wageTypeControls, error } = await supabase
      .from('wage_type_controls')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', wage_type_control_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update wage type controls', 500);
    }

    res.json({
      success: true,
      message: `${wageTypeControls?.length || 0} wage type controls updated successfully`,
      data: wageTypeControls
    });
  });
}
