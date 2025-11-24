import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class AssetController {
  // Get all assets for a foundation
  static async getAssets(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { page = 1, limit = 50, search = '', status = 'all' } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      let query = supabase
        .from('assets')
        .select('*')
        .eq('foundation_id', foundation_id);

      // Apply search filter
      if (search) {
        query = query.or(`asset_number.ilike.%${search}%,name.ilike.%${search}%,asset_type.ilike.%${search}%`);
      }

      // Apply status filter
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: assets, error } = await query;

      if (error) {
        throw createError('Failed to fetch assets', 500);
      }

      // Get total count for pagination
      const { count } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('foundation_id', foundation_id);

      res.json({
        success: true,
        data: assets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get asset by ID
  static async getAssetById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: asset, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (error) {
        throw createError('Asset not found', 404);
      }

      res.json({
        success: true,
        data: asset
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new asset
  static async createAsset(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const {
        asset_number,
        name,
        asset_type,
        linked_to_asset_group,
        acquisition_value,
        estimated_residual_value,
        acquisition_date,
        depreciation_start,
        useful_life_years,
        useful_life_months,
        depreciation_method,
        id_number,
        manufacturer_brand,
        insured_with,
        insurance_number,
        group,
        room,
        investment,
        section,
        notes,
        image_url
      } = req.body;

      // Generate next asset number if not provided
      let finalAssetNumber = asset_number;
      if (!finalAssetNumber) {
        const { data: lastAsset } = await supabase
          .from('assets')
          .select('asset_number')
          .eq('foundation_id', foundation_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextNumber = lastAsset ? parseInt(lastAsset.asset_number) + 1 : 1;
        finalAssetNumber = nextNumber.toString();
      }

      const { data: asset, error } = await supabase
        .from('assets')
        .insert({
          foundation_id,
          asset_number: finalAssetNumber,
          name,
          asset_type,
          linked_to_asset_group,
          acquisition_value: parseFloat(acquisition_value),
          estimated_residual_value: parseFloat(estimated_residual_value),
          acquisition_date,
          depreciation_start,
          useful_life_years: parseInt(useful_life_years),
          useful_life_months: parseInt(useful_life_months),
          depreciation_method,
          id_number,
          manufacturer_brand,
          insured_with,
          insurance_number,
          group,
          room,
          investment,
          section,
          notes,
          image_url,
          status: 'not-started',
          created_by: user_id
        })
        .select()
        .single();

      if (error) {
        throw createError('Failed to create asset', 500);
      }

      res.status(201).json({
        success: true,
        data: asset,
        message: 'Asset created successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update asset
  static async updateAsset(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const updateData = { ...req.body, updated_by: user_id };

      const { data: asset, error } = await supabase
        .from('assets')
        .update(updateData)
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .select()
        .single();

      if (error) {
        throw createError('Failed to update asset', 500);
      }

      res.json({
        success: true,
        data: asset,
        message: 'Asset updated successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete asset
  static async deleteAsset(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (error) {
        throw createError('Failed to delete asset', 500);
      }

      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get depreciation schedule for asset
  static async getDepreciationSchedule(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { view = 'year' } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (assetError) {
        throw createError('Asset not found', 404);
      }

      // Calculate depreciation schedule
      const schedule = calculateDepreciationSchedule(asset, view as string);

      res.json({
        success: true,
        data: {
          asset,
          schedule
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Perform depreciation
  static async performDepreciation(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const { asset_ids, write_off_empty_date, transaction_date, print_report } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      // Get selected assets
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .in('id', asset_ids)
        .eq('foundation_id', foundation_id);

      if (assetsError) {
        throw createError('Failed to fetch assets', 500);
      }

      // Calculate depreciation for each asset
      const depreciationEntries = [];
      for (const asset of assets) {
        const schedule = calculateDepreciationSchedule(asset, 'month');
        const txDate = new Date(String(transaction_date || new Date().toISOString()));
        const currentPeriod = schedule.find((entry: any) => 
          new Date(String(entry.period_start)) <= txDate &&
          new Date(String(entry.period_end)) >= txDate
        );

        if (currentPeriod) {
          depreciationEntries.push({
            foundation_id,
            asset_id: asset.id,
            period_start: currentPeriod.period_start,
            period_end: currentPeriod.period_end,
            depreciation_amount: currentPeriod.amount,
            remaining_value: currentPeriod.remaining_value,
            transaction_date,
            created_by: user_id
          });
        }
      }

      // Insert depreciation entries
      const { data: entries, error: entriesError } = await supabase
        .from('asset_depreciation_entries')
        .insert(depreciationEntries)
        .select();

      if (entriesError) {
        throw createError('Failed to create depreciation entries', 500);
      }

      res.json({
        success: true,
        data: entries,
        message: `Depreciation performed for ${asset_ids.length} assets`
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Upload asset image
  static async uploadAssetImage(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      if (!req.file) {
        throw createError('No image file provided', 400);
      }

      // Upload to Supabase Storage
      const fileName = `asset-${id}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('asset-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        throw createError('Failed to upload image', 500);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('asset-images')
        .getPublicUrl(fileName);

      // Update asset with image URL
      const { error: updateError } = await supabase
        .from('assets')
        .update({ image_url: urlData.publicUrl })
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (updateError) {
        throw createError('Failed to update asset with image URL', 500);
      }

      res.json({
        success: true,
        data: { image_url: urlData.publicUrl },
        message: 'Image uploaded successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Helper function to calculate depreciation schedule
function calculateDepreciationSchedule(asset: any, view: string) {
  const acquisitionValue = asset.acquisition_value;
  const residualValue = asset.estimated_residual_value;
  const years = asset.useful_life_years;
  const months = asset.useful_life_months;
  const totalMonths = years * 12 + months;
  
  if (totalMonths === 0) return [];
  
  const depreciableAmount = acquisitionValue - residualValue;
  const monthlyDepreciation = asset.depreciation_method === 'Irregular' 
    ? depreciableAmount / (totalMonths * 1.5)
    : depreciableAmount / totalMonths;
  
  const schedule = [];
  let remainingValue = acquisitionValue;
  let currentDate = new Date(asset.depreciation_start);
  
  if (view === 'month') {
    for (let i = 0; i < totalMonths; i++) {
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0);
      
      const depreciationAmount = Math.min(monthlyDepreciation, remainingValue - residualValue);
      
      remainingValue = Math.max(remainingValue - depreciationAmount, residualValue);
      
      schedule.push({
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        amount: parseFloat(depreciationAmount.toFixed(2)),
        percentage: parseFloat(((depreciationAmount / acquisitionValue) * 100).toFixed(2)),
        remaining_value: parseFloat(remainingValue.toFixed(2))
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } else {
    const totalYears = Math.ceil(totalMonths / 12);
    
    for (let i = 0; i < totalYears; i++) {
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      periodEnd.setDate(0);
      
      const monthsInThisYear = Math.min(12, totalMonths - (i * 12));
      const yearlyDepreciationAmount = Math.min(monthlyDepreciation * monthsInThisYear, remainingValue - residualValue);
      
      remainingValue = Math.max(remainingValue - yearlyDepreciationAmount, residualValue);
      
      schedule.push({
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
        amount: parseFloat(yearlyDepreciationAmount.toFixed(2)),
        percentage: parseFloat(((yearlyDepreciationAmount / acquisitionValue) * 100).toFixed(2)),
        remaining_value: parseFloat(remainingValue.toFixed(2))
      });
      
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }
  
  return schedule;
}
