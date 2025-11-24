import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { JWTRequest } from '../middleware/jwtAuth';

const ALLOWED_CATEGORIES = ['accounting', 'supplier', 'billing'] as const;
type VerificationSeriesCategory = (typeof ALLOWED_CATEGORIES)[number];

const isValidCategory = (value: string): value is VerificationSeriesCategory =>
  ALLOWED_CATEGORIES.includes(value as VerificationSeriesCategory);

export class VerificationSeriesSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    const requestedCategoryParam = (req.query.category as string | undefined)?.toLowerCase() || undefined;
    const categories: VerificationSeriesCategory[] = requestedCategoryParam && isValidCategory(requestedCategoryParam)
      ? [requestedCategoryParam]
      : [...ALLOWED_CATEGORIES];

    const { data: seriesRows, error: seriesError } = await supabase
      .from('verification_series_settings')
      .select('*')
      .eq('foundation_id', foundationId)
      .in('category', categories)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });

    if (seriesError) {
      throw seriesError;
    }

    const { data: mappingRows, error: mappingError } = await supabase
      .from('verification_series_mappings')
      .select('*')
      .eq('foundation_id', foundationId)
      .in('category', categories);

    if (mappingError) {
      throw mappingError;
    }

    const payload: Record<string, { series: any[]; dropdownSelections: Record<string, string> }> = {};

    categories.forEach((category) => {
      const seriesForCategory = (seriesRows || [])
        .filter((row) => row.category === category)
        .map((row) => ({
          id: row.id,
          code: row.code,
          name: row.name,
          manualAccounting: row.manual_accounting,
          position: row.position ?? 0
        }));

      const dropdownSelections: Record<string, string> = {};
      (mappingRows || [])
        .filter((row) => row.category === category)
        .forEach((row) => {
          dropdownSelections[row.mapping_key] = row.series_code;
        });

      payload[category] = {
        series: seriesForCategory,
        dropdownSelections
      };
    });

    res.status(200).json({
      success: true,
      data: payload
    });
  });

  static saveSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    const categoryParam = (req.body.category as string | undefined)?.toLowerCase() || '';

    if (!isValidCategory(categoryParam)) {
      res.status(400).json(createError('Invalid category provided'));
      return;
    }

    const seriesInput = Array.isArray(req.body.series) ? req.body.series : [];
    const dropdownSelectionsInput =
      req.body.dropdownSelections && typeof req.body.dropdownSelections === 'object'
        ? req.body.dropdownSelections
        : {};

    const sanitizedSeries = seriesInput
      .map((item: any, index: number) => {
        const code = typeof item.code === 'string' ? item.code.trim() : '';
        const name = typeof item.name === 'string' ? item.name.trim() : '';

        if (!code || !name) {
          return null;
        }

        return {
          foundation_id: foundationId,
          category: categoryParam,
          code,
          name,
          manual_accounting: !!item.manualAccounting,
          position: Number.isFinite(item.position) ? item.position : index,
          created_by: userId,
          updated_by: userId
        };
      })
      .filter(
        (record: Record<string, unknown> | null): record is Record<string, unknown> =>
          record !== null
      );

    // Replace existing series for this category
    const { error: deleteSeriesError } = await supabase
      .from('verification_series_settings')
      .delete()
      .eq('foundation_id', foundationId)
      .eq('category', categoryParam);

    if (deleteSeriesError) {
      throw deleteSeriesError;
    }

    if (sanitizedSeries.length > 0) {
      const { error: insertSeriesError } = await supabase
        .from('verification_series_settings')
        .insert(sanitizedSeries);

      if (insertSeriesError) {
        throw insertSeriesError;
      }
    }

    // Replace dropdown selections for this category
    const { error: deleteMappingsError } = await supabase
      .from('verification_series_mappings')
      .delete()
      .eq('foundation_id', foundationId)
      .eq('category', categoryParam);

    if (deleteMappingsError) {
      throw deleteMappingsError;
    }

    const mappingEntries = Object.entries(dropdownSelectionsInput || {})
      .map(([key, value]) => ({
        foundation_id: foundationId,
        category: categoryParam,
        mapping_key: key.trim(),
        series_code: typeof value === 'string' ? value.trim() : '',
        updated_by: userId
      }))
      .filter((entry) => entry.mapping_key.length > 0 && entry.series_code.length > 0);

    if (mappingEntries.length > 0) {
      const { error: insertMappingsError } = await supabase
        .from('verification_series_mappings')
        .insert(mappingEntries);

      if (insertMappingsError) {
        throw insertMappingsError;
      }
    }

    // Fetch updated data for the requested category to return in response
    const [{ data: updatedSeries }, { data: updatedMappings }] = await Promise.all([
      supabase
        .from('verification_series_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .eq('category', categoryParam)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true }),
      supabase
        .from('verification_series_mappings')
        .select('*')
        .eq('foundation_id', foundationId)
        .eq('category', categoryParam)
    ]);

    const responseDropdownSelections: Record<string, string> = {};
    (updatedMappings || []).forEach((mapping) => {
      responseDropdownSelections[mapping.mapping_key] = mapping.series_code;
    });

    res.status(200).json({
      success: true,
      message: 'Verification series settings saved successfully',
      data: {
        category: categoryParam,
        series: (updatedSeries || []).map((row) => ({
          id: row.id,
          code: row.code,
          name: row.name,
          manualAccounting: row.manual_accounting,
          position: row.position ?? 0
        })),
        dropdownSelections: responseDropdownSelections
      }
    });
  });
}

