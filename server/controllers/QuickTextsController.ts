import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { supabase } from '../config/database';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class QuickTextsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quick_texts')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by text_type
      const verificationDescriptions = (data || [])
        .filter(item => item.text_type === 'verification_descriptions')
        .map(item => ({
          id: item.id,
          code: item.code,
          text: item.text
        }));

      const transactionInformation = (data || [])
        .filter(item => item.text_type === 'transaction_information')
        .map(item => ({
          id: item.id,
          code: item.code,
          text: item.text
        }));

      res.status(200).json({
        success: true,
        data: {
          verificationDescriptions,
          transactionInformation
        }
      });
    } catch (error) {
      console.error('❌ Error fetching quick texts:', error);
      res.status(500).json(createError(`Failed to fetch quick texts: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static addEntry = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const { type, code, text } = req.body;

      if (!type || !code || !text) {
        res.status(400).json(createError('Type, code, and text are required'));
        return;
      }

      const textType = type === 'verificationDescriptions' 
        ? 'verification_descriptions' 
        : 'transaction_information';

      const { data, error } = await supabase
        .from('quick_texts')
        .insert({
          foundation_id: foundationId,
          text_type: textType,
          code,
          text,
          created_by: userId,
          updated_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data: {
          id: data.id,
          code: data.code,
          text: data.text
        },
        message: 'Quick text added successfully'
      });
    } catch (error) {
      console.error('❌ Error adding quick text:', error);
      res.status(500).json(createError(`Failed to add quick text: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static deleteEntry = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json(createError('Entry ID is required'));
        return;
      }

      const { error } = await supabase
        .from('quick_texts')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundationId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Quick text deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting quick text:', error);
      res.status(500).json(createError(`Failed to delete quick text: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static upsertSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    try {
      const { verificationDescriptions, transactionInformation } = req.body;

      // Delete existing entries
      await supabase
        .from('quick_texts')
        .delete()
        .eq('foundation_id', foundationId);

      // Insert new entries
      const entriesToInsert: any[] = [];

      if (verificationDescriptions && Array.isArray(verificationDescriptions)) {
        verificationDescriptions.forEach((entry: any) => {
          entriesToInsert.push({
            foundation_id: foundationId,
            text_type: 'verification_descriptions',
            code: entry.code,
            text: entry.text,
            created_by: userId,
            updated_by: userId
          });
        });
      }

      if (transactionInformation && Array.isArray(transactionInformation)) {
        transactionInformation.forEach((entry: any) => {
          entriesToInsert.push({
            foundation_id: foundationId,
            text_type: 'transaction_information',
            code: entry.code,
            text: entry.text,
            created_by: userId,
            updated_by: userId
          });
        });
      }

      if (entriesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('quick_texts')
          .insert(entriesToInsert);

        if (insertError) throw insertError;
      }

      // Fetch updated data
      const { data } = await supabase
        .from('quick_texts')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true });

      const verificationDescriptionsFormatted = (data || [])
        .filter(item => item.text_type === 'verification_descriptions')
        .map(item => ({
          id: item.id,
          code: item.code,
          text: item.text
        }));

      const transactionInformationFormatted = (data || [])
        .filter(item => item.text_type === 'transaction_information')
        .map(item => ({
          id: item.id,
          code: item.code,
          text: item.text
        }));

      res.status(200).json({
        success: true,
        data: {
          verificationDescriptions: verificationDescriptionsFormatted,
          transactionInformation: transactionInformationFormatted
        },
        message: 'Quick texts saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving quick texts:', error);
      res.status(500).json(createError(`Failed to save quick texts: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}




























