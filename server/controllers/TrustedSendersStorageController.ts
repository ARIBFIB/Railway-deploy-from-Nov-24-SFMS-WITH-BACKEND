import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';
import type { SettingsScope } from '../types';

export class TrustedSendersStorageController {
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
   * Get trusted senders storage settings for the current foundation
   */
  static getSettings(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      console.log('🚀 TrustedSendersStorageController.getSettings - Starting');

      const foundationId = this.ensureFoundationId(req, res);
      const userId = req.user?.user_id;

      console.log('👤 User context:', { foundationId, userId, scope: resolvedScope });

      if (!foundationId) {
        return;
      }

      try {
        const { data: settings, error: settingsError } = await supabase
          .from('trusted_senders_storage')
          .select('*')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        const { data: domains, error: domainsError } = await supabase
          .from('trusted_domains')
          .select('*')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .order('created_at', { ascending: true });

        if (domainsError) throw domainsError;

        const { data: trustedEmails, error: trustedEmailsError } = await supabase
          .from('trusted_email_addresses')
          .select('*')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .order('created_at', { ascending: true });

        if (trustedEmailsError) throw trustedEmailsError;

        const { data: rejectedEmails, error: rejectedEmailsError } = await supabase
          .from('rejected_email_addresses')
          .select('*')
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope)
          .order('created_at', { ascending: true });

        if (rejectedEmailsError) throw rejectedEmailsError;

        console.log('✅ Trusted senders storage fetched successfully');

        res.status(200).json({
          success: true,
          data: {
            settings: settings || {
              foundation_id: foundationId,
              scope: resolvedScope,
              email_function_enabled: true,
              storage_used_mb: 0,
              storage_total_mb: 10240
            },
            trustedDomains: domains || [],
            trustedEmailAddresses: trustedEmails || [],
            rejectedEmailAddresses: rejectedEmails || []
          }
        });
      } catch (error) {
        console.error('❌ Error fetching trusted senders storage:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch trusted senders storage',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Upsert trusted senders storage settings
   */
  static upsertSettings(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);

      if (!foundationId || !userId) {
        return;
      }

      try {
        const {
          email_function_enabled,
          storage_used_mb,
          storage_total_mb,
          trusted_domains,
          trusted_email_addresses,
          rejected_email_addresses
        } = req.body;

        const { data: settings, error } = await supabase
          .from('trusted_senders_storage')
          .upsert(
            {
              foundation_id: foundationId,
              scope: resolvedScope,
              email_function_enabled: email_function_enabled ?? true,
              storage_used_mb: storage_used_mb ?? 0,
              storage_total_mb: storage_total_mb ?? 10240,
              updated_by: userId,
              updated_at: new Date().toISOString()
            },
            {
              onConflict: 'foundation_id,scope'
            }
          )
          .select()
          .single();

        if (error) throw error;

        const sanitizeList = (values: any) => {
          if (!Array.isArray(values)) return [];
          return Array.from(
            new Set(
              values
                .map((value) => (typeof value === 'string' ? value.trim() : ''))
                .filter((value): value is string => value.length > 0)
            )
          );
        };

        if (Object.prototype.hasOwnProperty.call(req.body, 'trusted_domains')) {
          const domains = sanitizeList(trusted_domains);

          const { error: deleteDomainsError } = await supabase
            .from('trusted_domains')
            .delete()
            .eq('foundation_id', foundationId)
            .eq('scope', resolvedScope);

          if (deleteDomainsError) throw deleteDomainsError;

          if (domains.length > 0) {
            const { error: insertDomainsError } = await supabase
              .from('trusted_domains')
              .insert(
                domains.map((domain) => ({
                  foundation_id: foundationId,
                  scope: resolvedScope,
                  domain,
                  created_by: userId
                }))
              );

            if (insertDomainsError) throw insertDomainsError;
          }
        }

        if (Object.prototype.hasOwnProperty.call(req.body, 'trusted_email_addresses')) {
          const emails = sanitizeList(trusted_email_addresses);

          const { error: deleteEmailsError } = await supabase
            .from('trusted_email_addresses')
            .delete()
            .eq('foundation_id', foundationId)
            .eq('scope', resolvedScope);

          if (deleteEmailsError) throw deleteEmailsError;

          if (emails.length > 0) {
            const { error: insertEmailsError } = await supabase
              .from('trusted_email_addresses')
              .insert(
                emails.map((email) => ({
                  foundation_id: foundationId,
                  scope: resolvedScope,
                  email,
                  created_by: userId
                }))
              );

            if (insertEmailsError) throw insertEmailsError;
          }
        }

        if (Object.prototype.hasOwnProperty.call(req.body, 'rejected_email_addresses')) {
          const emails = sanitizeList(rejected_email_addresses);

          const { error: deleteRejectedError } = await supabase
            .from('rejected_email_addresses')
            .delete()
            .eq('foundation_id', foundationId)
            .eq('scope', resolvedScope);

          if (deleteRejectedError) throw deleteRejectedError;

          if (emails.length > 0) {
            const { error: insertRejectedError } = await supabase
              .from('rejected_email_addresses')
              .insert(
                emails.map((email) => ({
                  foundation_id: foundationId,
                  scope: resolvedScope,
                  email,
                  created_by: userId
                }))
              );

            if (insertRejectedError) throw insertRejectedError;
          }
        }

        const [{ data: domains }, { data: trustedEmails }, { data: rejectedEmails }] =
          await Promise.all([
            supabase
              .from('trusted_domains')
              .select('*')
              .eq('foundation_id', foundationId)
              .eq('scope', resolvedScope)
              .order('created_at', { ascending: true }),
            supabase
              .from('trusted_email_addresses')
              .select('*')
              .eq('foundation_id', foundationId)
              .eq('scope', resolvedScope)
              .order('created_at', { ascending: true }),
            supabase
              .from('rejected_email_addresses')
              .select('*')
              .eq('foundation_id', foundationId)
              .eq('scope', resolvedScope)
              .order('created_at', { ascending: true })
          ]);

        res.status(200).json({
          success: true,
          data: {
            settings,
            trustedDomains: domains || [],
            trustedEmailAddresses: trustedEmails || [],
            rejectedEmailAddresses: rejectedEmails || []
          },
          message: 'Trusted senders storage settings saved successfully'
        });
      } catch (error) {
        console.error('❌ Error saving trusted senders storage:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to save trusted senders storage: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
      }
    });
  }

  /**
   * Add trusted domain
   */
  static addTrustedDomain(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);

      if (!foundationId || !userId) {
        return;
      }

      try {
        const { domain } = req.body;

        if (!domain) {
          res.status(400).json(createError('Domain is required'));
          return;
        }

        const { data, error } = await supabase
          .from('trusted_domains')
          .insert({
            foundation_id: foundationId,
            scope: resolvedScope,
            domain,
            created_by: userId
          })
          .select()
          .single();

        if (error) throw error;

        res.status(201).json({
          success: true,
          data,
          message: 'Trusted domain added successfully'
        });
      } catch (error) {
        console.error('❌ Error adding trusted domain:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to add trusted domain: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }

  /**
   * Delete trusted domain
   */
  static deleteTrustedDomain(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const { id } = req.params;

      if (!foundationId || !id) {
        res.status(400).json(createError('Foundation ID and Domain ID are required'));
        return;
      }

      try {
        const { error } = await supabase
          .from('trusted_domains')
          .delete()
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope);

        if (error) throw error;

        res.status(200).json({
          success: true,
          message: 'Trusted domain deleted successfully'
        });
      } catch (error) {
        console.error('❌ Error deleting trusted domain:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to delete trusted domain: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }

  /**
   * Add trusted email address
   */
  static addTrustedEmail(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);

      if (!foundationId || !userId) {
        return;
      }

      try {
        const { email } = req.body;

        if (!email) {
          res.status(400).json(createError('Email is required'));
          return;
        }

        const { data, error } = await supabase
          .from('trusted_email_addresses')
          .insert({
            foundation_id: foundationId,
            scope: resolvedScope,
            email,
            created_by: userId
          })
          .select()
          .single();

        if (error) throw error;

        res.status(201).json({
          success: true,
          data,
          message: 'Trusted email address added successfully'
        });
      } catch (error) {
        console.error('❌ Error adding trusted email:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to add trusted email: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }

  /**
   * Delete trusted email address
   */
  static deleteTrustedEmail(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const { id } = req.params;

      if (!foundationId || !id) {
        res.status(400).json(createError('Foundation ID and Email ID are required'));
        return;
      }

      try {
        const { error } = await supabase
          .from('trusted_email_addresses')
          .delete()
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope);

        if (error) throw error;

        res.status(200).json({
          success: true,
          message: 'Trusted email address deleted successfully'
        });
      } catch (error) {
        console.error('❌ Error deleting trusted email:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to delete trusted email: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }

  /**
   * Add rejected email address
   */
  static addRejectedEmail(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const userId = this.ensureUserId(req, res);

      if (!foundationId || !userId) {
        return;
      }

      try {
        const { email } = req.body;

        if (!email) {
          res.status(400).json(createError('Email is required'));
          return;
        }

        const { data, error } = await supabase
          .from('rejected_email_addresses')
          .insert({
            foundation_id: foundationId,
            scope: resolvedScope,
            email,
            created_by: userId
          })
          .select()
          .single();

        if (error) throw error;

        res.status(201).json({
          success: true,
          data,
          message: 'Rejected email address added successfully'
        });
      } catch (error) {
        console.error('❌ Error adding rejected email:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to add rejected email: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }

  /**
   * Delete rejected email address
   */
  static deleteRejectedEmail(scope?: SettingsScope): RequestHandler {
    const resolvedScope = this.resolveScope(scope);

    return asyncHandler(async (req: JWTRequest, res: Response) => {
      const foundationId = this.ensureFoundationId(req, res);
      const { id } = req.params;

      if (!foundationId || !id) {
        res.status(400).json(createError('Foundation ID and Email ID are required'));
        return;
      }

      try {
        const { error } = await supabase
          .from('rejected_email_addresses')
          .delete()
          .eq('id', id)
          .eq('foundation_id', foundationId)
          .eq('scope', resolvedScope);

        if (error) throw error;

        res.status(200).json({
          success: true,
          message: 'Rejected email address deleted successfully'
        });
      } catch (error) {
        console.error('❌ Error deleting rejected email:', error);
        res
          .status(500)
          .json(
            createError(
              `Failed to delete rejected email: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
      }
    });
  }
}

