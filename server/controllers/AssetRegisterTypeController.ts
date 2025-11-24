import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import {
  AssetRegisterTypeModel,
  CreateAssetRegisterTypeData,
  UpdateAssetRegisterTypeData
} from '../models/AssetRegisterType';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuditService } from '../services/AuditService';

export class AssetRegisterTypeController {
  /**
   * Get all asset register types for the current foundation
   */
  static getAssetRegisterTypes = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AssetRegisterTypeController.getAssetRegisterTypes - Starting');
    
    const foundationId = req.user?.foundation_id;

    console.log('👤 User context:', { foundationId, userId: req.user?.user_id });

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
      const types = await AssetRegisterTypeModel.getByFoundation(foundationId);
      console.log('✅ Asset register types fetched successfully:', types.length);

      res.status(200).json({
        success: true,
        data: types,
        message: 'Asset register types retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error fetching asset register types:', error);
      res.status(500).json(createError(`Failed to fetch asset register types: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Get a specific asset register type by ID
   */
  static getAssetRegisterTypeById = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const type = await AssetRegisterTypeModel.getById(id!);

      // Verify the type belongs to the user's foundation
      if (type.foundation_id !== foundationId) {
        res.status(403).json(createError('Access denied'));
        return;
      }

      res.status(200).json({
        success: true,
        data: type,
        message: 'Asset register type retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error fetching asset register type:', error);
      res.status(500).json(createError(`Failed to fetch asset register type: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Create a new asset register type
   */
  static createAssetRegisterType = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AssetRegisterTypeController.createAssetRegisterType - Starting');
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

    // Validate required fields
    if (!req.body.number || !req.body.description || !req.body.depreciation_type) {
      res.status(400).json(createError('Number, description, and depreciation type are required'));
      return;
    }

    const typeData: CreateAssetRegisterTypeData = {
      number: req.body.number,
      description: req.body.description,
      depreciation_type: req.body.depreciation_type || req.body.depreciationType,
      note: req.body.note,
      asset_account: req.body.asset_account || req.body.assetAccount,
      depreciation_account: req.body.depreciation_account || req.body.depreciationAccount,
      revaluation_account: req.body.revaluation_account || req.body.revaluationAccount,
      impairment_account: req.body.impairment_account || req.body.impairmentAccount,
      offsetting_account_for_sales: req.body.offsetting_account_for_sales || req.body.offsettingAccountForSales,
      accumulated_depreciation: req.body.accumulated_depreciation || req.body.accumulatedDepreciation,
      accumulated_impairment_losses: req.body.accumulated_impairment_losses || req.body.accumulatedImpairmentLosses,
      capital_gain_on_sale: req.body.capital_gain_on_sale || req.body.capitalGainOnSale,
      capital_loss_sale: req.body.capital_loss_sale || req.body.capitalLossSale
    };

    try {
      const type = await AssetRegisterTypeModel.create(foundationId, typeData, userId);
      console.log('✅ Asset register type created successfully:', type.id);

      // Log audit trail
      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: 'CREATE',
        target_table: 'asset_register_types',
        target_id: type.id,
        new_values: typeData as unknown as Record<string, unknown>,
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(201).json({
        success: true,
        data: type,
        message: 'Asset register type created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating asset register type:', error);
      if (error instanceof Error && (error.message.includes('duplicate') || error.message.includes('unique'))) {
        res.status(400).json(createError('An asset register type with this number already exists for this foundation'));
      } else {
        res.status(500).json(createError(`Failed to create asset register type: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    }
  });

  /**
   * Update an asset register type
   */
  static updateAssetRegisterType = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AssetRegisterTypeController.updateAssetRegisterType - Starting');
    console.log('📋 Request params:', req.params);
    console.log('📋 Request body:', req.body);
    
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId, typeId: id });

    if (!foundationId || !userId) {
      console.error('❌ Missing foundation ID or user ID');
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      // Verify the type exists and belongs to the user's foundation
      const existingType = await AssetRegisterTypeModel.getById(id!);
      
      if (existingType.foundation_id !== foundationId) {
        res.status(403).json(createError('Access denied'));
        return;
      }

      const updateData: UpdateAssetRegisterTypeData = {
        number: req.body.number,
        description: req.body.description,
        depreciation_type: req.body.depreciation_type || req.body.depreciationType,
        note: req.body.note,
        asset_account: req.body.asset_account || req.body.assetAccount,
        depreciation_account: req.body.depreciation_account || req.body.depreciationAccount,
        revaluation_account: req.body.revaluation_account || req.body.revaluationAccount,
        impairment_account: req.body.impairment_account || req.body.impairmentAccount,
        offsetting_account_for_sales: req.body.offsetting_account_for_sales || req.body.offsettingAccountForSales,
        accumulated_depreciation: req.body.accumulated_depreciation || req.body.accumulatedDepreciation,
        accumulated_impairment_losses: req.body.accumulated_impairment_losses || req.body.accumulatedImpairmentLosses,
        capital_gain_on_sale: req.body.capital_gain_on_sale || req.body.capitalGainOnSale,
        capital_loss_sale: req.body.capital_loss_sale || req.body.capitalLossSale
      };

      const type = await AssetRegisterTypeModel.update(id!, updateData, userId);
      console.log('✅ Asset register type updated successfully');

      // Log audit trail
      const oldValues = {
        number: existingType.number,
        description: existingType.description,
        depreciation_type: existingType.depreciation_type,
        note: existingType.note,
        asset_account: existingType.asset_account,
        depreciation_account: existingType.depreciation_account,
        revaluation_account: existingType.revaluation_account,
        impairment_account: existingType.impairment_account,
        offsetting_account_for_sales: existingType.offsetting_account_for_sales,
        accumulated_depreciation: existingType.accumulated_depreciation,
        accumulated_impairment_losses: existingType.accumulated_impairment_losses,
        capital_gain_on_sale: existingType.capital_gain_on_sale,
        capital_loss_sale: existingType.capital_loss_sale
      };

      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: 'UPDATE',
        target_table: 'asset_register_types',
        target_id: type.id,
        old_values: oldValues,
        new_values: updateData as unknown as Record<string, unknown>,
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(200).json({
        success: true,
        data: type,
        message: 'Asset register type updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating asset register type:', error);
      res.status(500).json(createError(`Failed to update asset register type: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  /**
   * Delete an asset register type
   */
  static deleteAssetRegisterType = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AssetRegisterTypeController.deleteAssetRegisterType - Starting');
    
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId, typeId: id });

    if (!foundationId || !userId) {
      console.error('❌ Missing foundation ID or user ID');
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      // Verify the type exists and belongs to the user's foundation
      const existingType = await AssetRegisterTypeModel.getById(id!);
      
      if (existingType.foundation_id !== foundationId) {
        res.status(403).json(createError('Access denied'));
        return;
      }

      await AssetRegisterTypeModel.delete(id!);
      console.log('✅ Asset register type deleted successfully');

      // Log audit trail
      await AuditService.log({
        user_id: userId,
        foundation_id: foundationId,
        action: 'DELETE',
        target_table: 'asset_register_types',
        target_id: id,
        old_values: {
          number: existingType.number,
          description: existingType.description,
          depreciation_type: existingType.depreciation_type
        },
        ip_address: req.ip || req.socket.remoteAddress,
        user_agent: req.headers['user-agent']
      });

      res.status(200).json({
        success: true,
        message: 'Asset register type deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting asset register type:', error);
      res.status(500).json(createError(`Failed to delete asset register type: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

