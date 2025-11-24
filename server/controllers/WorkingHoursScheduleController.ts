import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class WorkingHoursScheduleController {
  static getWorkingHoursSchedules = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, status, search } = req.query;

    let query = supabase
      .from('working_hours_schedules')
      .select('*')
      .order('created_at', { ascending: false });

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(`schema_id.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: schedules, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: schedules || [],
      total: schedules?.length || 0
    });
  });

  static getWorkingHoursScheduleById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('working_hours_schedules')
      .select('*')
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: schedule, error } = await query.single();

    if (error || !schedule) {
      throw createError('Working hours schedule not found', 404);
    }

    res.json({
      success: true,
      data: schedule
    });
  });

  static createWorkingHoursSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const {
      schema_id,
      name,
      schedule_length_in_days,
      number_of_obs,
      employment_rate
    } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: schedule, error } = await supabase
      .from('working_hours_schedules')
      .insert({
        foundation_id,
        schema_id,
        name,
        schedule_length_in_days: schedule_length_in_days || 7,
        number_of_obs: number_of_obs || 0,
        employment_rate: employment_rate || 100,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Working hours schedule created successfully',
      data: schedule
    });
  });

  static updateWorkingHoursSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const updateData = req.body;

    let query = supabase
      .from('working_hours_schedules')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { data: schedule, error } = await query.select().single();

    if (error || !schedule) {
      throw createError('Working hours schedule not found or update failed', 404);
    }

    res.json({
      success: true,
      message: 'Working hours schedule updated successfully',
      data: schedule
    });
  });

  static deleteWorkingHoursSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;

    let query = supabase
      .from('working_hours_schedules')
      .delete()
      .eq('id', id);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }

    const { error } = await query;

    if (error) {
      throw createError('Failed to delete working hours schedule', 500);
    }

    res.json({
      success: true,
      message: 'Working hours schedule deleted successfully'
    });
  });

  static copyWorkingHoursSchedule = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { foundation_id } = req.query;
    const { name } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    // Get the original schedule
    const { data: originalSchedule, error: fetchError } = await supabase
      .from('working_hours_schedules')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundation_id)
      .single();

    if (fetchError || !originalSchedule) {
      throw createError('Working hours schedule not found', 404);
    }

    // Create a copy with new name
    const { data: copiedSchedule, error: insertError } = await supabase
      .from('working_hours_schedules')
      .insert({
        foundation_id,
        schema_id: `${originalSchedule.schema_id}_COPY`,
        name: name || `${originalSchedule.name} (Copy)`,
        schedule_length_in_days: originalSchedule.schedule_length_in_days,
        number_of_obs: originalSchedule.number_of_obs,
        employment_rate: originalSchedule.employment_rate,
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      throw createError(insertError.message, 400);
    }

    res.status(201).json({
      success: true,
      message: 'Working hours schedule copied successfully',
      data: copiedSchedule
    });
  });

  static bulkUpdateWorkingHoursSchedules = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { schedule_ids, is_active } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    const { data: schedules, error } = await supabase
      .from('working_hours_schedules')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .in('id', schedule_ids)
      .eq('foundation_id', foundation_id)
      .select();

    if (error) {
      throw createError('Failed to update working hours schedules', 500);
    }

    res.json({
      success: true,
      message: `${schedules?.length || 0} working hours schedules updated successfully`,
      data: schedules
    });
  });

  static importWorkingHoursSchedules = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const { schedules } = req.body;

    if (!foundation_id) {
      throw createError('Foundation ID is required', 400);
    }

    if (!schedules || !Array.isArray(schedules)) {
      throw createError('Schedules array is required', 400);
    }

    // Prepare schedules for insertion
    const schedulesToInsert = schedules.map((schedule: any) => ({
      foundation_id,
      schema_id: schedule.schema_id,
      name: schedule.name,
      schedule_length_in_days: schedule.schedule_length_in_days || 7,
      number_of_obs: schedule.number_of_obs || 0,
      employment_rate: schedule.employment_rate || 100,
      is_active: true
    }));

    const { data: importedSchedules, error } = await supabase
      .from('working_hours_schedules')
      .insert(schedulesToInsert)
      .select();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      success: true,
      message: `${importedSchedules?.length || 0} working hours schedules imported successfully`,
      data: importedSchedules
    });
  });
}
