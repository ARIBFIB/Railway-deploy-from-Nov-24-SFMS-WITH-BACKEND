import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { VerificationModel, CreateVerificationData, UpdateVerificationData, VerificationFilters } from '../models/Verification';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class VerificationController {
  static createVerification = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 VerificationController.createVerification - Starting');
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

    const verificationData: CreateVerificationData = {
      ...req.body,
      verification_number: String(req.body.verification_number)
    };

    console.log('📊 Processed verification data:', verificationData);

    if (!verificationData.verification_number || !verificationData.verification_series || !verificationData.accounting_date) {
      console.error('❌ Missing required fields');
      res.status(400).json(createError('Verification number, series, and accounting date are required'));
      return;
    }

    try {
      // Check if verification number already exists
      console.log('🔍 Checking for existing verification number:', verificationData.verification_number);
      const existingVerifications = await VerificationModel.getByFoundation(foundationId, {
        search: verificationData.verification_number
      });

      const verificationExists = existingVerifications.data.some(
        verification => verification.verification_number === verificationData.verification_number
      );

      if (verificationExists) {
        console.error('❌ Verification number already exists');
        res.status(400).json(createError('Verification number already exists for this foundation. Please choose a different number.'));
        return;
      }

      console.log('✅ Verification number is unique, creating verification...');
      const verification = await VerificationModel.create(foundationId, verificationData, String(userId));
      console.log('✅ Verification created successfully:', verification);

      res.status(201).json({
        success: true,
        data: verification,
        message: 'Verification created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating verification:', error);
      res.status(500).json(createError(`Failed to create verification: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static getVerifications = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 VerificationController.getVerifications - Starting');
    console.log('📋 Request query:', req.query);
    
    const foundationId = req.user?.foundation_id;
    const userRole = req.user?.role;
    const isAdmin = userRole === 'admin';
    console.log('👤 User context:', { foundationId, userId: req.user?.user_id, userRole, isAdmin });
    console.log('👤 Full user object:', req.user);

    // All users need a valid foundation_id
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

    const filters: VerificationFilters = {
      search: req.query.search as string,
      verification_series: req.query.verification_series as string,
      status: req.query.status as string,
      accounting_date_from: req.query.accounting_date_from as string,
      accounting_date_to: req.query.accounting_date_to as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    console.log('📊 Filters applied:', filters);

    try {
      let result;
      if (isAdmin) {
        // Admin users can see ALL verifications from all foundations
        console.log('📊 Admin user - Fetching ALL verifications from all foundations');
        result = await VerificationModel.getAll();
      } else {
        // Regular users see only their foundation's verifications
        console.log('📊 Regular user - Fetching ALL verifications for foundation:', foundationId);
        result = await VerificationModel.getAllByFoundation(foundationId);
      }
      
      console.log('✅ VerificationModel.getAllByFoundation result:', {
        success: result.success,
        dataCount: result.data?.length || 0
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.error('❌ Error in getVerifications:', error);
      res.status(500).json(createError(`Failed to fetch verifications: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static getVerificationById = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Verification ID is required'));
      return;
    }

    const verification = await VerificationModel.getById(id);

    // Check if verification belongs to user's foundation (skip for global admin)
    if (!isGlobalAdmin && verification.foundation_id !== foundationId) {
      res.status(403).json(createError('Access denied to this verification'));
      return;
    }

    res.status(200).json({
      success: true,
      data: verification
    });
  });

  static updateVerification = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Verification ID is required'));
      return;
    }

    // Check if verification exists and belongs to user's foundation
    const existingVerification = await VerificationModel.getById(id);
    if (!isGlobalAdmin && existingVerification.foundation_id !== foundationId) {
      res.status(403).json(createError('Access denied to this verification'));
      return;
    }

    const verificationData: UpdateVerificationData = {
      ...req.body,
      verification_number: req.body.verification_number ? String(req.body.verification_number) : undefined
    };

    // If verification number is being changed, check if new number already exists
    if (verificationData.verification_number && verificationData.verification_number !== existingVerification.verification_number) {
      const existingVerifications = await VerificationModel.getByFoundation(foundationId, {
        search: verificationData.verification_number
      });

      const verificationExists = existingVerifications.data.some(
        verification => verification.verification_number === verificationData.verification_number && verification.id !== id
      );

      if (verificationExists) {
        res.status(400).json(createError('Verification number already exists for this foundation'));
        return;
      }
    }

    const verification = await VerificationModel.update(id, verificationData, String(userId));

    res.status(200).json({
      success: true,
      data: verification,
      message: 'Verification updated successfully'
    });
  });

  static deleteVerification = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Verification ID is required'));
      return;
    }

    // Check if verification exists and belongs to user's foundation
    const existingVerification = await VerificationModel.getById(id);
    if (!isGlobalAdmin && existingVerification.foundation_id !== foundationId) {
      res.status(403).json(createError('Access denied to this verification'));
      return;
    }

    await VerificationModel.delete(id);

    res.status(200).json({
      success: true,
      message: 'Verification deleted successfully'
    });
  });

  static getNextVerificationNumber = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { series } = req.query;

    console.log('🚀 VerificationController.getNextVerificationNumber - Starting');
    console.log('📋 Request params:', { foundationId, series });

    if (!foundationId) {
      console.error('❌ Missing foundation ID');
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!series) {
      console.error('❌ Missing verification series');
      res.status(400).json(createError('Verification series is required'));
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
    const nextNumber = await VerificationModel.getNextVerificationNumber(foundationId, String(series));
      console.log('✅ Next verification number generated:', nextNumber);

    res.status(200).json({
      success: true,
      data: { verification_number: nextNumber }
    });
    } catch (error) {
      console.error('❌ Error getting next verification number:', error);
      res.status(500).json(createError(`Failed to get next verification number: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static uploadImage = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 VerificationController.uploadImage - Starting');
    console.log('📋 Request info:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      foundationId: req.user?.foundation_id,
      userId: req.user?.user_id
    });

    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

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

    if (!req.file) {
      console.error('❌ No file uploaded');
      res.status(400).json(createError('No file uploaded'));
      return;
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      console.error('❌ Invalid file type:', req.file.mimetype);
      res.status(400).json(createError('Only image files are allowed'));
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      console.error('❌ File too large:', req.file.size);
      res.status(400).json(createError('File size exceeds 10MB limit'));
      return;
    }

    try {
      // This would typically handle file upload to a storage service (AWS S3, Google Cloud Storage, etc.)
      // For now, we'll return a mock response with proper file information
      const mockImageUrl = `https://storage.example.com/verifications/${foundationId}/${Date.now()}-${req.file.originalname}`;

      console.log('✅ Image upload processed successfully');

    res.status(200).json({
      success: true,
      data: {
        image_url: mockImageUrl,
          image_name: req.file.originalname,
          image_size: req.file.size,
          mime_type: req.file.mimetype,
          foundation_id: foundationId,
          uploaded_by: userId,
          uploaded_at: new Date().toISOString()
      },
      message: 'Image uploaded successfully'
    });
    } catch (error) {
      console.error('❌ Error processing image upload:', error);
      res.status(500).json(createError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static bulkUpdateStatus = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const { verification_ids, status } = req.body;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    if (!verification_ids || !Array.isArray(verification_ids) || verification_ids.length === 0) {
      res.status(400).json(createError('Verification IDs array is required'));
      return;
    }

    if (!status || !['draft', 'posted', 'cancelled'].includes(status)) {
      res.status(400).json(createError('Valid status is required (draft, posted, cancelled)'));
      return;
    }

    // Update each verification
    const updatePromises = verification_ids.map(async (id: string) => {
      const verification = await VerificationModel.getById(id);
      if (isGlobalAdmin || verification.foundation_id === foundationId) {
        return VerificationModel.update(id, { status }, String(userId));
      }
      return null;
    });

    const results = await Promise.all(updatePromises);
    const updatedVerifications = results.filter(result => result !== null);

    res.status(200).json({
      success: true,
      data: updatedVerifications,
      message: `${updatedVerifications.length} verifications updated successfully`
    });
  });

  static bulkDelete = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { verification_ids } = req.body;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!verification_ids || !Array.isArray(verification_ids) || verification_ids.length === 0) {
      res.status(400).json(createError('Verification IDs array is required'));
      return;
    }

    // Delete each verification
    const deletePromises = verification_ids.map(async (id: string) => {
      const verification = await VerificationModel.getById(id);
      if (isGlobalAdmin || verification.foundation_id === foundationId) {
        return VerificationModel.delete(id);
      }
      return null;
    });

    await Promise.all(deletePromises);

    res.status(200).json({
      success: true,
      message: `${verification_ids.length} verifications deleted successfully`
    });
  });
}
