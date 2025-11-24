import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class RegistrationTemplatesController {
  static getTemplates = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data: templates, error: templatesError } = await supabase
        .from('registration_templates')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true });

      if (templatesError) throw templatesError;

      // Fetch sale entries for each template
      const templatesWithEntries = await Promise.all(
        (templates || []).map(async (template) => {
          const { data: saleEntries } = await supabase
            .from('registration_template_sale_entries')
            .select('*')
            .eq('template_id', template.id)
            .order('line_order', { ascending: true });

          return {
            id: template.id,
            name: template.name,
            description: template.description || '',
            verificationSeries: template.verification_series || '',
            type: template.type as 'Daily cash register' | 'Receipt',
            templateType: template.template_type as 'Daily cash register' | 'Receipt',
            verificationDescription: template.verification_description || '',
            headingSales: template.heading_sales || '',
            showPaymentMethodsAtTop: template.show_payment_methods_at_top || false,
            vatDeclaration: template.vat_declaration as 'Incl.' | 'Excl.' | undefined,
            importAccountBalance: template.import_account_balance || false,
            savePrintoutInArchiveLocation: template.save_printout_in_archive_location as 'Save' | 'Don\'t save' | undefined,
            headingPaymentMethod: template.heading_payment_method || '',
            accountForDifference: template.account_for_difference || '',
            headingWithdrawal: template.heading_withdrawal || '',
            saleEntries: (saleEntries || []).map(entry => ({
              id: entry.id,
              text: entry.text || '',
              account: entry.account || '',
              outputVat: entry.output_vat || ''
            }))
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          templates: templatesWithEntries,
          currentView: 'list' as const,
          editingTemplate: null,
          isCreating: false
        }
      });
    } catch (error) {
      console.error('❌ Error fetching registration templates:', error);
      res.status(500).json(createError(`Failed to fetch templates: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static getTemplate = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { id } = req.params;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Template ID is required'));
      return;
    }

    try {
      const { data: template, error: templateError } = await supabase
        .from('registration_templates')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundationId)
        .single();

      if (templateError) throw templateError;

      const { data: saleEntries } = await supabase
        .from('registration_template_sale_entries')
        .select('*')
        .eq('template_id', template.id)
        .order('line_order', { ascending: true });

      const templateWithEntries = {
        id: template.id,
        name: template.name,
        description: template.description || '',
        verificationSeries: template.verification_series || '',
        type: template.type as 'Daily cash register' | 'Receipt',
        templateType: template.template_type as 'Daily cash register' | 'Receipt',
        verificationDescription: template.verification_description || '',
        headingSales: template.heading_sales || '',
        showPaymentMethodsAtTop: template.show_payment_methods_at_top || false,
        vatDeclaration: template.vat_declaration as 'Incl.' | 'Excl.' | undefined,
        importAccountBalance: template.import_account_balance || false,
        savePrintoutInArchiveLocation: template.save_printout_in_archive_location as 'Save' | 'Don\'t save' | undefined,
        headingPaymentMethod: template.heading_payment_method || '',
        accountForDifference: template.account_for_difference || '',
        headingWithdrawal: template.heading_withdrawal || '',
        saleEntries: (saleEntries || []).map(entry => ({
          id: entry.id,
          text: entry.text || '',
          account: entry.account || '',
          outputVat: entry.output_vat || ''
        }))
      };

      res.status(200).json({
        success: true,
        data: templateWithEntries
      });
    } catch (error) {
      console.error('❌ Error fetching registration template:', error);
      res.status(500).json(createError(`Failed to fetch template: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static createTemplate = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const {
        name,
        description,
        verificationSeries,
        type,
        templateType,
        verificationDescription,
        headingSales,
        showPaymentMethodsAtTop,
        vatDeclaration,
        importAccountBalance,
        savePrintoutInArchiveLocation,
        headingPaymentMethod,
        accountForDifference,
        headingWithdrawal,
        saleEntries
      } = req.body;

      // Create template
      const { data: template, error: templateError } = await supabase
        .from('registration_templates')
        .insert({
          foundation_id: foundationId,
          name: name || '',
          description: description || null,
          verification_series: verificationSeries || null,
          type: type || 'Daily cash register',
          template_type: templateType || 'Daily cash register',
          verification_description: verificationDescription || null,
          heading_sales: headingSales || null,
          show_payment_methods_at_top: showPaymentMethodsAtTop || false,
          vat_declaration: vatDeclaration || null,
          import_account_balance: importAccountBalance || false,
          save_printout_in_archive_location: savePrintoutInArchiveLocation || null,
          heading_payment_method: headingPaymentMethod || null,
          account_for_difference: accountForDifference || null,
          heading_withdrawal: headingWithdrawal || null,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Insert sale entries
      if (saleEntries && Array.isArray(saleEntries) && saleEntries.length > 0) {
        const entriesToInsert = saleEntries.map((entry: any, index: number) => ({
          template_id: template.id,
          text: entry.text || null,
          account: entry.account || null,
          output_vat: entry.outputVat || null,
          line_order: index
        }));

        const { error: entriesError } = await supabase
          .from('registration_template_sale_entries')
          .insert(entriesToInsert);

        if (entriesError) throw entriesError;
      }

      res.status(201).json({
        success: true,
        data: template,
        message: 'Template created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating registration template:', error);
      res.status(500).json(createError(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static updateTemplate = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const { id } = req.params;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Template ID is required'));
      return;
    }

    try {
      const {
        name,
        description,
        verificationSeries,
        type,
        templateType,
        verificationDescription,
        headingSales,
        showPaymentMethodsAtTop,
        vatDeclaration,
        importAccountBalance,
        savePrintoutInArchiveLocation,
        headingPaymentMethod,
        accountForDifference,
        headingWithdrawal,
        saleEntries
      } = req.body;

      // Update template
      const updateData: any = {
        updated_by: userId,
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (verificationSeries !== undefined) updateData.verification_series = verificationSeries;
      if (type !== undefined) updateData.type = type;
      if (templateType !== undefined) updateData.template_type = templateType;
      if (verificationDescription !== undefined) updateData.verification_description = verificationDescription;
      if (headingSales !== undefined) updateData.heading_sales = headingSales;
      if (showPaymentMethodsAtTop !== undefined) updateData.show_payment_methods_at_top = showPaymentMethodsAtTop;
      if (vatDeclaration !== undefined) updateData.vat_declaration = vatDeclaration;
      if (importAccountBalance !== undefined) updateData.import_account_balance = importAccountBalance;
      if (savePrintoutInArchiveLocation !== undefined) updateData.save_printout_in_archive_location = savePrintoutInArchiveLocation;
      if (headingPaymentMethod !== undefined) updateData.heading_payment_method = headingPaymentMethod;
      if (accountForDifference !== undefined) updateData.account_for_difference = accountForDifference;
      if (headingWithdrawal !== undefined) updateData.heading_withdrawal = headingWithdrawal;

      const { data: template, error: templateError } = await supabase
        .from('registration_templates')
        .update(updateData)
        .eq('id', id)
        .eq('foundation_id', foundationId)
        .select()
        .single();

      if (templateError) throw templateError;

      // Update sale entries
      if (saleEntries !== undefined) {
        // Delete existing entries
        await supabase
          .from('registration_template_sale_entries')
          .delete()
          .eq('template_id', id);

        // Insert new entries
        if (Array.isArray(saleEntries) && saleEntries.length > 0) {
          const entriesToInsert = saleEntries.map((entry: any, index: number) => ({
            template_id: id,
            text: entry.text || null,
            account: entry.account || null,
            output_vat: entry.outputVat || null,
            line_order: index
          }));

          const { error: entriesError } = await supabase
            .from('registration_template_sale_entries')
            .insert(entriesToInsert);

          if (entriesError) throw entriesError;
        }
      }

      res.status(200).json({
        success: true,
        data: template,
        message: 'Template updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating registration template:', error);
      res.status(500).json(createError(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static deleteTemplate = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const { id } = req.params;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    if (!id) {
      res.status(400).json(createError('Template ID is required'));
      return;
    }

    try {
      // Delete sale entries first (cascade should handle this, but being explicit)
      await supabase
        .from('registration_template_sale_entries')
        .delete()
        .eq('template_id', id);

      // Delete template
      const { error } = await supabase
        .from('registration_templates')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundationId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting registration template:', error);
      res.status(500).json(createError(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}




























