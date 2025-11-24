import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class SalaryAgreementsController {
  static getSalaryAgreements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, search } = req.query;

    let query = supabase
      .from('salary_agreements')
      .select('*')
      .order('created_at', { ascending: false });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,staff_type.ilike.%${search}%,agreement_template.ilike.%${search}%`);
    }

    const { data: salaryAgreements, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: salaryAgreements || [],
      total: salaryAgreements?.length || 0
    });
  });

  static getSalaryAgreementById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('salary_agreements')
      .select('*')
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: salaryAgreement, error } = await query.single();

    if (error || !salaryAgreement) {
      throw createError('Salary agreement not found', 404);
    }

    res.json({
      success: true,
      data: salaryAgreement
    });
  });

  static createSalaryAgreement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      name,
      staff_type,
      agreement_template,
      description
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: salaryAgreement, error } = await supabase
      .from('salary_agreements')
      .insert({
        foundation_id,
        name,
        staff_type,
        agreement_template,
        description,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Salary agreement created successfully',
      data: salaryAgreement
    });
  });

  static updateSalaryAgreement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('salary_agreements')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: salaryAgreement, error } = await query.select().single();

    if (error || !salaryAgreement) {
      throw createError('Salary agreement not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Salary agreement updated successfully',
      data: salaryAgreement
    });
  });

  static deleteSalaryAgreement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('salary_agreements')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete salary agreement', 500);
    }

    res.json({
      success: true,
      message: 'Salary agreement deleted successfully'
    });
  });

  static copySalaryAgreement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const { name } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Get the original salary agreement
    const { data: originalAgreement, error: fetchError } = await supabase
      .from('salary_agreements')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (fetchError || !originalAgreement) {
      throw createError('Salary agreement not found', 404);
    }

    // Create a copy with new name
    const { data: copiedAgreement, error: insertError } = await supabase
      .from('salary_agreements')
      .insert({
        foundation_id,
        name: name || `${originalAgreement.name} (Copy)`,
        staff_type: originalAgreement.staff_type,
        agreement_template: originalAgreement.agreement_template,
        description: originalAgreement.description,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      throw createError(insertError.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Salary agreement copied successfully',
      data: copiedAgreement
    });
  });

  static bulkUpdateSalaryAgreements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { salary_agreement_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: salaryAgreements, error } = await supabase
      .from('salary_agreements')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', salary_agreement_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update salary agreements', 500);
    }

    res.json({
      success: true,
      message: `${salaryAgreements?.length || 0} salary agreements updated successfully`,
      data: salaryAgreements
    });
  });
}
