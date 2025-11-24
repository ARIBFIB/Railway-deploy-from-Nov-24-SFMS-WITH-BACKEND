import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class SIEController {
  static getImports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const foundationId = foundation_id as string || req.user?.foundation_id;

    if (!foundationId) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('sie_imports')
      .select('*')
      .eq('foundation_id', foundationId)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: data || []
    });
  });

  static getImportById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { data, error } = await supabase
      .from('sie_imports')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .single();

    if (error) {
      throw createError('SIE import not found', 404);
    }

    res.json({
      success: true,
      data
    });
  });

  static createImport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.id;
    const { file_name, file_content, accounting_period_start, accounting_period_end } = req.body;

    if (!foundationId || !file_name || !file_content) {
      throw createError('Foundation ID, file name, and file content are required', 400);
    }

    const { data, error } = await supabase
      .from('sie_imports')
      .insert({
        foundation_id: foundationId,
        file_name,
        file_content,
        accounting_period_start,
        accounting_period_end,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data,
      message: 'SIE import created successfully. Process the file to import data.'
    });
  });

  static getExports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;
    const foundationId = foundation_id as string || req.user?.foundation_id;

    if (!foundationId) {
      throw createError('Foundation ID is required', 400);
    }

    const { data, error } = await supabase
      .from('sie_exports')
      .select('*')
      .eq('foundation_id', foundationId)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data: data || []
    });
  });

  static getExportById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { data, error } = await supabase
      .from('sie_exports')
      .select('*')
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .single();

    if (error) {
      throw createError('SIE export not found', 404);
    }

    res.json({
      success: true,
      data
    });
  });

  static createExport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.id;
    const { file_name, accounting_period_start, accounting_period_end, file_path } = req.body;

    if (!foundationId || !file_name) {
      throw createError('Foundation ID and file name are required', 400);
    }

    const { data, error } = await supabase
      .from('sie_exports')
      .insert({
        foundation_id: foundationId,
        file_name,
        accounting_period_start,
        accounting_period_end,
        file_path,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      success: true,
      data,
      message: 'SIE export created successfully'
    });
  });

  static downloadExport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    const { data, error } = await supabase
      .from('sie_exports')
      .select('file_path, file_name')
      .eq('id', id)
      .eq('foundation_id', foundationId)
      .single();

    if (error) {
      throw createError('SIE export not found', 404);
    }

    res.json({
      success: true,
      data: {
        file_path: data.file_path,
        file_name: data.file_name
      }
    });
  });
}
