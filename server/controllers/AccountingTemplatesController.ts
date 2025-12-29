import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { AuditService } from '../services/AuditService';
import type { SettingsScope } from '../types';

export class AccountingTemplatesController {
  private static readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  private static resolveScope(scope?: SettingsScope): SettingsScope {
    return scope ?? 'accounting';
  }

  private static ensureFoundationId(req: JWTRequest, res: Response): string | null {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json({
        success: false,
        error: 'Foundation ID is required',
        message: 'Foundation ID is required'
      });
      return null;
    }

    if (!this.uuidRegex.test(foundationId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid foundation ID format',
        message: 'Invalid foundation ID format. Please contact support.'
      });
      return null;
    }

    return foundationId;
  }

  private static ensureUserId(req: JWTRequest, res: Response): string | null {
    const userId = req.user?.user_id;

    if (!userId) {
      res.status(400).json(createError('User ID is required'));
      return null;
    }

    return userId;
  }
  /**
   * Get all accounting templates for the current foundation
   */
  static getTemplates(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 AccountingTemplatesController.getTemplates - Starting');

      const foundationId = this.ensureFoundationId(req, res);
      const userId = req.user?.user_id;

      console.log('👤 User context:', { foundationId, userId, scope: resolvedScope });

      if (!foundationId) {
        return;
      }

      try {
        const { data: templates, error } = await supabase
          .from('accounting_templates')
          .select(`
            *,
            transactions:accounting_template_transactions(
              *,
              account:chart_of_accounts(id, account_number, account_name)
            )
          `)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .order('code', { ascending: true });

        if (error) throw error;

        console.log('✅ Accounting templates fetched successfully:', templates?.length || 0);

        // Transform the data to use camelCase field names for the frontend
        const transformedTemplates = (templates || []).map(template => ({
          ...template,
          verificationSeries: template.verification_series,
          // Remove the snake_case field to avoid confusion
          verification_series: undefined
        }));

        res.status(200).json({
          success: true,
          data: transformedTemplates,
          message: 'Accounting templates retrieved successfully'
        });
      } catch (error) {
        console.error('❌ Error fetching accounting templates:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch accounting templates',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Get a specific accounting template by ID
   */
  static getTemplateById(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const { id } = req.params;

      if (!foundationId || !id) {
        if (!foundationId) {
          // ensureFoundationId already responded
        } else {
          res.status(400).json(createError('Template ID is required'));
        }
        return;
      }

      try {
        const { data: template, error } = await supabase
          .from('accounting_templates')
          .select(`
            *,
            transactions:accounting_template_transactions(
              *,
              account:chart_of_accounts(id, account_number, account_name)
            )
          `)
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .single();

        if (error) throw error;

        // Transform the data to use camelCase field names for the frontend
        const transformedTemplate = {
          ...template,
          verificationSeries: template.verification_series,
          // Remove the snake_case field to avoid confusion
          verification_series: undefined
        };

        res.status(200).json({
          success: true,
          data: transformedTemplate,
          message: 'Accounting template retrieved successfully'
        });
      } catch (error) {
        console.error('❌ Error fetching accounting template:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch accounting template',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Create a new accounting template
   */
  static createTemplate(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);

      if (!foundationId || !userId) {
        return;
      }

      try {
        const { code, name, type, verification_series, description, transactions } = req.body;

        if (!code || !name || !type) {
          res.status(400).json(createError('Code, name, and type are required'));
          return;
        }

        const { data: existing } = await supabase
          .from('accounting_templates')
          .select('id')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .eq('code', code)
          .maybeSingle();

        if (existing) {
          res.status(400).json(createError('Template code already exists for this foundation and scope'));
          return;
        }

        const { data: template, error: templateError } = await supabase
          .from('accounting_templates')
          .insert({
            foundation_id: foundationId,
            scope: resolvedScope,
            code,
            name,
            type,
            verification_series: verification_series || null,
            description: description || null,
            created_by: userId,
            updated_by: userId
          })
          .select()
          .single();

        if (templateError) throw templateError;

        if (transactions && Array.isArray(transactions) && transactions.length > 0) {
          const transactionsToInsert = await Promise.all(
            transactions.map(async (t: any, index: number) => {
              let accountId = t.account_id || null;

              if (t.account_number || t.account) {
                const accountNumber = t.account_number || t.account;
                const { data: account } = await supabase
                  .from('chart_of_accounts')
                  .select('id, account_name')
                  .eq('foundation_id', foundationId)
                  .eq('account_number', accountNumber)
                  .single();

                if (account) {
                  accountId = account.id;
                }
              }

              return {
                template_id: template.id,
                account_id: accountId,
                account_number: t.account_number || t.account || null,
                account_name: t.account_name || null,
                transaction_info: t.transaction_info || null,
                formula: t.formula || null,
                line_order: index
              };
            })
          );

          const { error: transactionsError } = await supabase
            .from('accounting_template_transactions')
            .insert(transactionsToInsert);

          if (transactionsError) throw transactionsError;
        }

        const { data: completeTemplate, error: fetchError } = await supabase
          .from('accounting_templates')
          .select(`
            *,
            transactions:accounting_template_transactions(
              *,
              account:chart_of_accounts(id, account_number, account_name)
            )
          `)
          .eq('id', template.id)
          .eq('scope', resolvedScope)
          .single();

        if (fetchError) throw fetchError;

        // Transform the data to use camelCase field names for the frontend
        const transformedTemplate = {
          ...completeTemplate,
          verificationSeries: completeTemplate.verification_series,
          // Remove the snake_case field to avoid confusion
          verification_series: undefined
        };

        res.status(201).json({
          success: true,
          data: transformedTemplate,
          message: 'Accounting template created successfully'
        });
      } catch (error) {
        console.error('❌ Error creating accounting template:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to create accounting template: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Update an accounting template
   */
  static updateTemplate(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);
      const { id } = req.params;

      if (!foundationId || !userId || !id) {
        return;
      }

      try {
        const { code, name, type, verification_series, description, transactions } = req.body;

        const { data: existingTemplate, error: checkError } = await supabase
          .from('accounting_templates')
          .select('id, code, scope')
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .single();

        if (checkError || !existingTemplate) {
          res.status(404).json(createError('Template not found'));
          return;
        }

        if (code && code !== existingTemplate.code) {
          const { data: codeExists } = await supabase
            .from('accounting_templates')
            .select('id')
            .eq('foundation_id', foundationId)
            .eq('scope', resolvedScope)
            .eq('code', code)
            .maybeSingle();

          if (codeExists) {
            res
              .status(400)
              .json(createError('Template code already exists for this foundation and scope'));
            return;
          }
        }

        const updateData: any = {
          updated_by: userId,
          updated_at: new Date().toISOString()
        };

        if (code !== undefined) updateData.code = code;
        if (name !== undefined) updateData.name = name;
        if (type !== undefined) updateData.type = type;
        if (verification_series !== undefined) updateData.verification_series = verification_series;
        if (description !== undefined) updateData.description = description;

        const { error: updateError } = await supabase
          .from('accounting_templates')
          .update(updateData)
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope);

        if (updateError) throw updateError;

        if (transactions !== undefined) {
          await supabase.from('accounting_template_transactions').delete().eq('template_id', id);

          if (Array.isArray(transactions) && transactions.length > 0) {
            const transactionsToInsert = await Promise.all(
              transactions.map(async (t: any, index: number) => {
                let accountId = t.account_id || null;

                if (t.account_number || t.account) {
                  const accountNumber = t.account_number || t.account;
                  const { data: account } = await supabase
                    .from('chart_of_accounts')
                    .select('id, account_name')
                    .eq('foundation_id', foundationId)
                    .eq('account_number', accountNumber)
                    .single();

                  if (account) {
                    accountId = account.id;
                  }
                }

                return {
                  template_id: id,
                  account_id: accountId,
                  account_number: t.account_number || t.account || null,
                  account_name: t.account_name || null,
                  transaction_info: t.transaction_info || null,
                  formula: t.formula || null,
                  line_order: index
                };
              })
            );

            const { error: transactionsError } = await supabase
              .from('accounting_template_transactions')
              .insert(transactionsToInsert);

            if (transactionsError) throw transactionsError;
          }
        }

        const { data: completeTemplate, error: fetchError } = await supabase
          .from('accounting_templates')
          .select(`
            *,
            transactions:accounting_template_transactions(
              *,
              account:chart_of_accounts(id, account_number, account_name)
            )
          `)
          .eq('id', id)
          .eq('scope', resolvedScope)
          .single();

        if (fetchError) throw fetchError;

        // Transform the data to use camelCase field names for the frontend
        const transformedTemplate = {
          ...completeTemplate,
          verificationSeries: completeTemplate.verification_series,
          // Remove the snake_case field to avoid confusion
          verification_series: undefined
        };

        res.status(200).json({
          success: true,
          data: transformedTemplate,
          message: 'Accounting template updated successfully'
        });
      } catch (error) {
        console.error('❌ Error updating accounting template:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to update accounting template: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Delete an accounting template
   */
  static deleteTemplate(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const { id } = req.params;

      if (!foundationId || !id) {
        if (!foundationId) {
          // error already sent
        } else {
          res.status(400).json(createError('Template ID is required'));
        }
        return;
      }

      try {
        const { data: existingTemplate, error: checkError } = await supabase
          .from('accounting_templates')
          .select('id')
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .single();

        if (checkError || !existingTemplate) {
          res.status(404).json(createError('Template not found'));
          return;
        }

        const { error } = await supabase
          .from('accounting_templates')
          .delete()
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope);

        if (error) throw error;

        res.status(200).json({
          success: true,
          message: 'Accounting template deleted successfully'
        });
      } catch (error) {
        console.error('❌ Error deleting accounting template:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to delete accounting template: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }
}

