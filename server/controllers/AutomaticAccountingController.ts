import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import {
  AutomaticAccountingModel,
  CreateAutomaticAccountingData,
  UpdateAutomaticAccountingData
} from '../models/AutomaticAccounting';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuditService } from '../services/AuditService';
import type { SettingsScope } from '../types';

export class AutomaticAccountingController {
  private static validateFoundationId(foundationId?: string): foundationId is string {
    if (!foundationId) {
      return false;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(foundationId);
  }

  private static resolveScope(scope?: SettingsScope): SettingsScope {
    return scope ?? 'accounting';
  }

  /**
   * Get all automatic accounting entries for the current foundation
   */
  static getAutomaticAccountingEntries(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 AutomaticAccountingController.getAutomaticAccountingEntries - Starting');

      const foundationId = req.user?.foundation_id;
      console.log('👤 User context:', {
        foundationId,
        userId: req.user?.user_id,
        scope: resolvedScope
      });

      if (!this.validateFoundationId(foundationId)) {
        console.error('❌ Invalid or missing foundation ID', { foundationId });
        res.status(400).json(createError('Valid foundation ID is required'));
        return;
      }

      try {
        const entries = await AutomaticAccountingModel.getByFoundation(foundationId, resolvedScope);
        console.log('✅ Automatic accounting entries fetched successfully:', entries.length);

        res.status(200).json({
          success: true,
          data: entries,
          message: 'Automatic accounting entries retrieved successfully'
        });
      } catch (error) {
        console.error('❌ Error fetching automatic accounting entries:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to fetch automatic accounting entries: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Get a specific automatic accounting entry by ID
   */
  static getAutomaticAccountingEntryById(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const { id } = req.params;
      const foundationId = req.user?.foundation_id;

      if (!this.validateFoundationId(foundationId)) {
        res.status(400).json(createError('Valid foundation ID is required'));
        return;
      }

      try {
        const entry = await AutomaticAccountingModel.getById(id!, resolvedScope);

        if (entry.foundation_id !== foundationId || entry.scope !== resolvedScope) {
          res.status(403).json(createError('Access denied'));
          return;
        }

        res.status(200).json({
          success: true,
          data: entry,
          message: 'Automatic accounting entry retrieved successfully'
        });
      } catch (error) {
        console.error('❌ Error fetching automatic accounting entry:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to fetch automatic accounting entry: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Create a new automatic accounting entry
   */
  static createAutomaticAccountingEntry(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 AutomaticAccountingController.createAutomaticAccountingEntry - Starting');
      console.log('📋 Request body:', req.body);

      const foundationId = req.user?.foundation_id;
      const userId = req.user?.user_id;

      console.log('👤 User context:', { foundationId, userId, scope: resolvedScope });

      if (!this.validateFoundationId(foundationId) || !userId) {
        console.error('❌ Missing foundation ID or user ID');
        res.status(400).json(createError('Valid foundation ID and User ID are required'));
        return;
      }

      if (!req.body.number || !req.body.name) {
        res.status(400).json(createError('Number and name are required'));
        return;
      }

      const entryData: CreateAutomaticAccountingData = {
        number: req.body.number,
        name: req.body.name,
        account: req.body.account,
        any_amount: req.body.any_amount ?? req.body.anyAmount,
        basic_accounts: req.body.basic_accounts ?? req.body.basicAccounts,
        formulas: req.body.formulas,
        transactions: req.body.transactions ?? req.body.automaticPostingLines
      };

      try {
        const entry = await AutomaticAccountingModel.create(
          foundationId,
          resolvedScope,
          entryData,
          userId
        );
        console.log('✅ Automatic accounting entry created successfully:', entry.id);

        await AuditService.log({
          user_id: userId,
          foundation_id: foundationId,
          action: 'CREATE',
          target_table: 'automatic_accounting',
          target_id: entry.id,
          new_values: { scope: resolvedScope, ...entryData } as unknown as Record<string, unknown>,
          ip_address: req.ip || req.socket.remoteAddress,
          user_agent: req.headers['user-agent']
        });

        res.status(201).json({
          success: true,
          data: entry,
          message: 'Automatic accounting entry created successfully'
        });
      } catch (error) {
        console.error('❌ Error creating automatic accounting entry:', error);
        if (error instanceof Error && (error.message.includes('duplicate') || error.message.includes('unique'))) {
          res
            .status(400)
            .json(
              createError(
                'An automatic accounting entry with this number already exists for this foundation and scope'
              )
            );
        } else {
          res
            .status(500)
            .json(
              createError(
                `Failed to create automatic accounting entry: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`
              )
            );
        }
      }
    });
  }

  /**
   * Update an automatic accounting entry
   */
  static updateAutomaticAccountingEntry(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 AutomaticAccountingController.updateAutomaticAccountingEntry - Starting');
      console.log('📋 Request params:', req.params);
      console.log('📋 Request body:', req.body);

      const { id } = req.params;
      const foundationId = req.user?.foundation_id;
      const userId = req.user?.user_id;

      console.log('👤 User context:', { foundationId, userId, entryId: id, scope: resolvedScope });

      if (!this.validateFoundationId(foundationId) || !userId) {
        console.error('❌ Missing foundation ID or user ID');
        res.status(400).json(createError('Valid foundation ID and User ID are required'));
        return;
      }

      try {
        const existingEntry = await AutomaticAccountingModel.getById(id!, resolvedScope);

        if (existingEntry.foundation_id !== foundationId || existingEntry.scope !== resolvedScope) {
          res.status(403).json(createError('Access denied'));
          return;
        }

        const updateData: UpdateAutomaticAccountingData = {
          number: req.body.number,
          name: req.body.name,
          account: req.body.account,
          any_amount: req.body.any_amount ?? req.body.anyAmount,
          basic_accounts: req.body.basic_accounts ?? req.body.basicAccounts,
          formulas: req.body.formulas,
          transactions: req.body.transactions ?? req.body.automaticPostingLines
        };

        const entry = await AutomaticAccountingModel.update(
          id!,
          resolvedScope,
          updateData,
          userId
        );
        console.log('✅ Automatic accounting entry updated successfully');

        const oldValues = {
          number: existingEntry.number,
          name: existingEntry.name,
          account: existingEntry.account,
          any_amount: existingEntry.any_amount,
          basic_accounts: existingEntry.basic_accounts,
          formulas: existingEntry.formulas,
          transactions: existingEntry.transactions,
          scope: existingEntry.scope
        };

        await AuditService.log({
          user_id: userId,
          foundation_id: foundationId,
          action: 'UPDATE',
          target_table: 'automatic_accounting',
          target_id: entry.id,
          old_values: oldValues as unknown as Record<string, unknown>,
          new_values: { scope: resolvedScope, ...updateData } as unknown as Record<string, unknown>,
          ip_address: req.ip || req.socket.remoteAddress,
          user_agent: req.headers['user-agent']
        });

        res.status(200).json({
          success: true,
          data: entry,
          message: 'Automatic accounting entry updated successfully'
        });
      } catch (error) {
        console.error('❌ Error updating automatic accounting entry:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to update automatic accounting entry: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Delete an automatic accounting entry
   */
  static deleteAutomaticAccountingEntry(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 AutomaticAccountingController.deleteAutomaticAccountingEntry - Starting');

      const { id } = req.params;
      const foundationId = req.user?.foundation_id;
      const userId = req.user?.user_id;

      console.log('👤 User context:', { foundationId, userId, entryId: id, scope: resolvedScope });

      if (!this.validateFoundationId(foundationId) || !userId) {
        console.error('❌ Missing foundation ID or user ID');
        res.status(400).json(createError('Valid foundation ID and User ID are required'));
        return;
      }

      try {
        const existingEntry = await AutomaticAccountingModel.getById(id!, resolvedScope);

        if (existingEntry.foundation_id !== foundationId || existingEntry.scope !== resolvedScope) {
          res.status(403).json(createError('Access denied'));
          return;
        }

        await AutomaticAccountingModel.delete(id!, resolvedScope);
        console.log('✅ Automatic accounting entry deleted successfully');

        await AuditService.log({
          user_id: userId,
          foundation_id: foundationId,
          action: 'DELETE',
          target_table: 'automatic_accounting',
          target_id: id,
          old_values: {
            number: existingEntry.number,
            name: existingEntry.name,
            account: existingEntry.account,
            scope: existingEntry.scope
          },
          ip_address: req.ip || req.socket.remoteAddress,
          user_agent: req.headers['user-agent']
        });

        res.status(200).json({
          success: true,
          message: 'Automatic accounting entry deleted successfully'
        });
      } catch (error) {
        console.error('❌ Error deleting automatic accounting entry:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to delete automatic accounting entry: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }
}

