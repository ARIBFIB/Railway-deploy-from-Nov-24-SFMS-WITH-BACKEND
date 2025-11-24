import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import {
  FacilityRegisterSettingsModel,
  CreateFacilityRegisterSettingsData,
  UpdateFacilityRegisterSettingsData
} from '../models/FacilityRegisterSettings';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuditService } from '../services/AuditService';

export class FacilityRegisterSettingsController {
  /**
   * Get facility register settings for the current foundation
   */
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 FacilityRegisterSettingsController.getSettings - Starting');
    
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId });

    if (!foundationId) {
      console.error('❌ Missing foundation ID');
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    // Validate that foundationId is a proper UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(foundationId)) {
      console.error('❌ Invalid foundation ID format:', foundationId);
      res.status(400).json(createError('Invalid foundation ID format. Please contact support.'));
      return;
    }

    try {
      const settings = await FacilityRegisterSettingsModel.getByFoundation(foundationId);
      console.log('✅ Facility register settings fetched successfully');

      res.status(200).json({
        success: true,
        data: settings,
        message: 'Facility register settings retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error fetching facility register settings:', error);
      res.status(500).json(createError(`Failed to fetch facility register settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Create or update facility register settings
   */
  static upsertSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 FacilityRegisterSettingsController.upsertSettings - Starting');
    console.log('📋 Request body:', req.body);
    
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId });

    if (!foundationId || !userId) {
      console.error('❌ Missing foundation ID or user ID');
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    // Validate that foundationId is a proper UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(foundationId)) {
      console.error('❌ Invalid foundation ID format:', foundationId);
      res.status(400).json(createError('Invalid foundation ID format. Please contact support.'));
      return;
    }

    // Validate request body
    const settingsData: CreateFacilityRegisterSettingsData = {
      proposed_depreciation_start_date: req.body.proposedDepreciationStartDate || req.body.proposed_depreciation_start_date,
      create_asset_from_supplier_invoice: req.body.createAssetFromSupplierInvoice !== undefined 
        ? req.body.createAssetFromSupplierInvoice 
        : req.body.create_asset_from_supplier_invoice,
      enable_component_depreciation_support: req.body.enableComponentDepreciationSupport !== undefined
        ? req.body.enableComponentDepreciationSupport
        : req.body.enable_component_depreciation_support
    };

    // Validate proposed_depreciation_start_date if provided
    if (settingsData.proposed_depreciation_start_date) {
      const validOptions = [
        'Acquisition month',
        'First month of the acquisition year',
        'The month after the acquisition date'
      ];
      if (!validOptions.includes(settingsData.proposed_depreciation_start_date)) {
        res.status(400).json(createError('Invalid proposed depreciation start date option'));
        return;
      }
    }

    try {
      // Get existing settings for audit log
      const existingSettings = await FacilityRegisterSettingsModel.getByFoundation(foundationId);
      const isUpdate = !!existingSettings.id;

      // Upsert settings
      const settings = await FacilityRegisterSettingsModel.upsert(foundationId, settingsData, userId);
      console.log('✅ Facility register settings saved successfully:', {
        id: settings.id,
        foundation_id: settings.foundation_id
      });

      // Log audit trail
      const oldValues = isUpdate ? {
        proposed_depreciation_start_date: existingSettings.proposed_depreciation_start_date,
        create_asset_from_supplier_invoice: existingSettings.create_asset_from_supplier_invoice,
        enable_component_depreciation_support: existingSettings.enable_component_depreciation_support
      } : undefined;

      const newValues = {
        proposed_depreciation_start_date: settings.proposed_depreciation_start_date,
        create_asset_from_supplier_invoice: settings.create_asset_from_supplier_invoice,
        enable_component_depreciation_support: settings.enable_component_depreciation_support
      };

      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: isUpdate ? 'UPDATE' : 'CREATE',
        target_table: 'facility_register_settings',
        target_id: settings.id,
        old_values: oldValues,
        new_values: newValues,
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(isUpdate ? 200 : 201).json({
        success: true,
        data: settings,
        message: `Facility register settings ${isUpdate ? 'updated' : 'created'} successfully`
      });
    } catch (error) {
      console.error('❌ Error saving facility register settings:', error);
      res.status(500).json(createError(`Failed to save facility register settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Update facility register settings
   */
  static updateSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 FacilityRegisterSettingsController.updateSettings - Starting');
    console.log('📋 Request body:', req.body);
    
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId });

    if (!foundationId || !userId) {
      console.error('❌ Missing foundation ID or user ID');
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    // Validate that foundationId is a proper UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(foundationId)) {
      console.error('❌ Invalid foundation ID format:', foundationId);
      res.status(400).json(createError('Invalid foundation ID format. Please contact support.'));
      return;
    }

    // Get existing settings for audit log
    const existingSettings = await FacilityRegisterSettingsModel.getByFoundation(foundationId);

    // Prepare update data
    const updateData: UpdateFacilityRegisterSettingsData = {
      proposed_depreciation_start_date: req.body.proposedDepreciationStartDate || req.body.proposed_depreciation_start_date,
      create_asset_from_supplier_invoice: req.body.createAssetFromSupplierInvoice !== undefined 
        ? req.body.createAssetFromSupplierInvoice 
        : req.body.create_asset_from_supplier_invoice,
      enable_component_depreciation_support: req.body.enableComponentDepreciationSupport !== undefined
        ? req.body.enableComponentDepreciationSupport
        : req.body.enable_component_depreciation_support
    };

    // Validate proposed_depreciation_start_date if provided
    if (updateData.proposed_depreciation_start_date) {
      const validOptions = [
        'Acquisition month',
        'First month of the acquisition year',
        'The month after the acquisition date'
      ];
      if (!validOptions.includes(updateData.proposed_depreciation_start_date)) {
        res.status(400).json(createError('Invalid proposed depreciation start date option'));
        return;
      }
    }

    try {
      const settings = await FacilityRegisterSettingsModel.update(foundationId, updateData, userId);
      console.log('✅ Facility register settings updated successfully');

      // Log audit trail
      const oldValues = {
        proposed_depreciation_start_date: existingSettings.proposed_depreciation_start_date,
        create_asset_from_supplier_invoice: existingSettings.create_asset_from_supplier_invoice,
        enable_component_depreciation_support: existingSettings.enable_component_depreciation_support
      };

      const newValues = {
        proposed_depreciation_start_date: settings.proposed_depreciation_start_date,
        create_asset_from_supplier_invoice: settings.create_asset_from_supplier_invoice,
        enable_component_depreciation_support: settings.enable_component_depreciation_support
      };

      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: 'UPDATE',
        target_table: 'facility_register_settings',
        target_id: settings.id,
        old_values: oldValues,
        new_values: newValues,
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(200).json({
        success: true,
        data: settings,
        message: 'Facility register settings updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating facility register settings:', error);
      res.status(500).json(createError(`Failed to update facility register settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Delete facility register settings
   */
  static deleteSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 FacilityRegisterSettingsController.deleteSettings - Starting');
    
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId });

    if (!foundationId || !userId) {
      console.error('❌ Missing foundation ID or user ID');
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      // Get existing settings for audit log
      const existingSettings = await FacilityRegisterSettingsModel.getByFoundation(foundationId);

      if (!existingSettings.id) {
        res.status(404).json(createError('Facility register settings not found'));
        return;
      }

      await FacilityRegisterSettingsModel.delete(foundationId);
      console.log('✅ Facility register settings deleted successfully');

      // Log audit trail
      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: 'DELETE',
        target_table: 'facility_register_settings',
        target_id: existingSettings.id,
        old_values: {
          proposed_depreciation_start_date: existingSettings.proposed_depreciation_start_date,
          create_asset_from_supplier_invoice: existingSettings.create_asset_from_supplier_invoice,
          enable_component_depreciation_support: existingSettings.enable_component_depreciation_support
        },
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(200).json({
        success: true,
        message: 'Facility register settings deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting facility register settings:', error);
      res.status(500).json(createError(`Failed to delete facility register settings: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

