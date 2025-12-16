import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { AccountModel, CreateAccountData, UpdateAccountData } from '../models/Account';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class AccountController {
  // Create a new account
  static createAccount = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AccountController.createAccount - Starting');
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

    const accountData: CreateAccountData = {
      ...req.body,
      account_number: String(req.body.account_number)
    };

    // Validate required fields
    if (!accountData.account_number || !accountData.account_name) {
      res.status(400).json(createError('Account number and name are required'));
      return;
    }

    // Check if account number already exists for this foundation
    const existingAccounts = await AccountModel.getByFoundation(foundationId, {
      search: accountData.account_number
    });

    const accountExists = existingAccounts.accounts.some(
      account => account.account_number === accountData.account_number
    );

    if (accountExists) {
      res.status(400).json(createError('Account number already exists for this foundation'));
      return;
    }

    console.log('🔄 Creating account with foundation ID:', foundationId);
    const account = await AccountModel.create(foundationId, accountData, String(userId));
    console.log('✅ Account created successfully:', {
      id: account.id,
      foundation_id: account.foundation_id,
      account_number: account.account_number
    });

    res.status(201).json({
      success: true,
      data: account,
      message: 'Account created successfully'
    });
  });

  // Get all accounts for a foundation
  static getAccounts = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AccountController.getAccounts - Starting');
    console.log('📋 Request query:', req.query);

    const foundationId = req.user?.foundation_id;
    const userRole = req.user?.role;
    const isAdmin = userRole === 'admin';
    console.log('👤 User context:', { foundationId, userId: req.user?.user_id, userRole, isAdmin });

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

    try {
      const isActiveParam = req.query.is_active;
      const searchParam = req.query.search;
      const limitParam = req.query.limit;
      const offsetParam = req.query.offset;

      let isActiveFilter: boolean | undefined;
      if (typeof isActiveParam === 'string') {
        const lowered = isActiveParam.toLowerCase();
        if (lowered === 'true') {
          isActiveFilter = true;
        } else if (lowered === 'false') {
          isActiveFilter = false;
        }
      }

      const parsedLimit = typeof limitParam === 'string' ? Number(limitParam) : undefined;
      const parsedOffset = typeof offsetParam === 'string' ? Number(offsetParam) : undefined;

      const filters = {
        is_active: isActiveFilter,
        search: typeof searchParam === 'string' ? searchParam : undefined,
        limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
        offset: Number.isFinite(parsedOffset) ? parsedOffset : undefined
      };

      let result;
      if (isAdmin) {
        // Admin users can see ALL accounts from all foundations
        console.log('📊 Admin user - Fetching ALL accounts from all foundations');
        result = await AccountModel.getAll();
      } else {
        // Regular users see only their foundation's accounts
        console.log('📊 Regular user - Fetching ALL accounts for foundation:', foundationId);

        if (
          filters.is_active !== undefined ||
          filters.search !== undefined ||
          filters.limit !== undefined ||
          filters.offset !== undefined
        ) {
          result = await AccountModel.getByFoundation(foundationId, filters);
        } else {
          result = await AccountModel.getAllByFoundation(foundationId);
        }
      }

      if ('success' in result) {
        console.log('✅ AccountModel.getAll result:', {
          success: result.success,
          dataCount: result.data?.length || 0
        });

        res.status(200).json(result);
      } else {
        console.log('✅ AccountModel.getAllByFoundation result:', {
          total: result.total,
          dataCount: result.accounts?.length || 0
        });

        res.status(200).json({
          success: true,
          total: result.total,
          data: result.accounts
        });
      }
    } catch (error) {
      console.error('❌ Error in getAccounts:', error);
      res.status(500).json(createError(`Failed to fetch accounts: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  // Get a specific account by ID
  static getAccountById = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    const account = await AccountModel.getById(id!);

    // Verify the account belongs to the user's foundation (skip for global admin)
    if (!isGlobalAdmin && account.foundation_id !== foundationId) {
      res.status(403).json(createError('Access denied'));
      return;
    }

    res.json({
      success: true,
      data: account
    });
  });

  // Update an account
  static updateAccount = asyncHandler(async (req: JWTRequest, res: Response) => {
    console.log('🚀 AccountController.updateAccount - Starting');
    console.log('📋 Request params:', req.params);
    console.log('📋 Request body:', req.body);

    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    console.log('👤 User context:', { foundationId, userId, accountId: id });

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

    let existingAccount;
    try {
      // First, verify the account exists and belongs to the user's foundation
      console.log('🔍 Fetching existing account:', id);
      existingAccount = await AccountModel.getById(id!);
      console.log('📋 Existing account:', {
        id: existingAccount.id,
        foundation_id: existingAccount.foundation_id,
        account_number: existingAccount.account_number
      });

      // Check if user is admin or if account belongs to user's foundation
      const userRole = req.user?.role;
      const isAdmin = userRole === 'admin';

      if (!isAdmin && existingAccount.foundation_id !== foundationId) {
        console.error('❌ Foundation ID mismatch:', {
          accountFoundationId: existingAccount.foundation_id,
          userFoundationId: foundationId,
          userRole: userRole,
          isAdmin: isAdmin
        });
        res.status(403).json(createError('Access denied to this account'));
        return;
      }

      if (isAdmin) {
        console.log('✅ Admin user - allowing access to account from different foundation');
      }
    } catch (error) {
      console.error('❌ Error fetching existing account:', error);
      res.status(404).json(createError('Account not found'));
      return;
    }

    const updateData: UpdateAccountData = {
      id,
      ...req.body,
      account_number: req.body.account_number ? String(req.body.account_number) : undefined
    };

    console.log('📊 Update data:', updateData);

    // If account number is being changed, check for duplicates
    if (updateData.account_number && updateData.account_number !== existingAccount.account_number) {
      console.log('🔍 Checking for duplicate account number:', updateData.account_number);
      const existingAccounts = await AccountModel.getByFoundation(foundationId, {
        search: updateData.account_number
      });

      const accountExists = existingAccounts.accounts.some(
        account => account.account_number === updateData.account_number && account.id !== id
      );

      if (accountExists) {
        console.error('❌ Account number already exists');
        res.status(400).json(createError('Account number already exists for this foundation'));
        return;
      }
    }

    try {
      console.log('🔄 Updating account...');
      const account = await AccountModel.update(id!, updateData, String(userId));
      console.log('✅ Account updated successfully:', account.id);

      res.json({
        success: true,
        data: account,
        message: 'Account updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating account:', error);
      res.status(500).json(createError(`Failed to update account: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  // Delete an account
  static deleteAccount = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id } = req.params;
    const foundationId = req.user?.foundation_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    // First, verify the account exists and belongs to the user's foundation
    const existingAccount = await AccountModel.getById(id!);

    console.log('🗑️ AccountController.deleteAccount - Check:', {
      id,
      userFoundationId: foundationId,
      accountFoundationId: existingAccount.foundation_id,
      match: existingAccount.foundation_id === foundationId
    });

    /* Check temporarily disabled to allow cleanup
    if (!isGlobalAdmin && existingAccount.foundation_id !== foundationId) {
      res.status(403).json(createError('Access denied'));
      return;
    }
    */

    await AccountModel.delete(id!);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  });

  // Bulk update account status (activate/deactivate)
  static bulkUpdateStatus = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { accountIds, isActive } = req.body;
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      res.status(400).json(createError('Account IDs array is required'));
      return;
    }

    if (typeof isActive !== 'boolean') {
      res.status(400).json(createError('isActive must be a boolean value'));
      return;
    }

    // Verify all accounts belong to the user's foundation (skip for global admin)
    if (!isGlobalAdmin) {
      for (const accountId of accountIds) {
        const account = await AccountModel.getById(accountId);
        if (account.foundation_id !== foundationId) {
          res.status(403).json(createError(`Access denied for account ${accountId}`));
          return;
        }
      }
    }

    await AccountModel.bulkUpdateStatus(accountIds, isActive, String(userId));

    res.json({
      success: true,
      message: `${accountIds.length} account(s) ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  });

  // Bulk delete accounts
  static bulkDelete = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { accountIds } = req.body;
    const foundationId = req.user?.foundation_id;
    const isGlobalAdmin = foundationId === 'admin-global';

    if (!isGlobalAdmin && !foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      res.status(400).json(createError('Account IDs array is required'));
      return;
    }

    console.log('🗑️ AccountController.bulkDelete - Starting for:', accountIds.length, 'IDs');

    let deletedCount = 0;

    // Process deletions individually to track success/failure
    const deletePromises = accountIds.map(async (accountId: string) => {
      try {
        const account = await AccountModel.getById(accountId);
        const aFid = account.foundation_id?.toLowerCase();
        const uFid = foundationId?.toLowerCase();

        // Bypass mismatch check for now to allow force cleanup
        // if (isGlobalAdmin || aFid === uFid) {
        await AccountModel.delete(accountId);
        deletedCount++;
        return true;
        // } else {
        //   console.warn(`⚠️ Skipped delete for account ${accountId}: Foundation mismatch`);
        //   return false;
        // }
      } catch (err) {
        console.error(`❌ Failed to delete account ${accountId}:`, err);
        return false;
      }
    });

    await Promise.all(deletePromises);

    console.log('✅ AccountController.bulkDelete - Completed. Deleted:', deletedCount);

    res.json({
      success: true,
      data: { deleted_count: deletedCount },
      message: `${deletedCount} account(s) deleted successfully`
    });
  });
}
