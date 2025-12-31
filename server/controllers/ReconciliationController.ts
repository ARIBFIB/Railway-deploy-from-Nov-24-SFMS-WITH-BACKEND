import { Response } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { supabase } from '../config/database';

export class ReconciliationController {
  static getLedgerEntries = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    const { account, start_date, end_date, verification_series } = req.query;

    if (!account) {
      res.status(400).json(createError('Account is required'));
      return;
    }

    if (!start_date || !end_date) {
      res.status(400).json(createError('Start date and end date are required'));
      return;
    }

    try {
      // First, get the verification IDs that match our criteria
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('verifications')
        .select('id, verification_number, verification_series, accounting_date, description, status')
        .eq('foundation_id', foundationId)
        .in('status', ['posted', 'draft']) // Include both posted and draft verifications for reconciliation
        .gte('accounting_date', String(start_date))
        .lte('accounting_date', String(end_date));

      if (verificationsError) {
        throw verificationsError;
      }

      if (!verificationsData || verificationsData.length === 0) {
        // No verifications found, return empty arrays
        res.status(200).json({
          success: true,
          data: {
            accountingTransactions: [],
            loadedTransactions: []
          }
        });
        return;
      }

      // Apply verification series filter if provided
      let filteredVerifications = verificationsData;
      console.log('Original verifications count:', verificationsData.length);
      console.log('Verification series filter:', verification_series);

      if (verification_series && String(verification_series).toLowerCase() !== 'all') {
        const seriesPart = String(verification_series).split(' - ')[0];
        const seriesCode = (seriesPart || '').trim().toUpperCase();
        console.log('Searching for series code:', seriesCode);

        filteredVerifications = verificationsData.filter(v => {
          const vSeriesPart = String(v.verification_series || '').split(' - ')[0];
          const vSeriesCode = (vSeriesPart || '').trim().toUpperCase();
          return vSeriesCode === seriesCode;
        });
        console.log('Filtered verifications count:', filteredVerifications.length);
      }

      // Extract verification IDs
      const verificationIds = filteredVerifications.map(v => v.id);

      if (verificationIds.length === 0) {
        // No matching verifications found
        res.status(200).json({
          success: true,
          data: {
            accountingTransactions: [],
            loadedTransactions: []
          }
        });
        return;
      }

      // Get the verification entries for those IDs
      const { data: entriesData, error: entriesError } = await supabase
        .from('verification_entries')
        .select('*')
        .in('verification_id', verificationIds)
        .eq('account_number', String(account));

      if (entriesError) {
        throw entriesError;
      }

      console.log('Found verifications:', filteredVerifications.length);
      console.log('Found entries:', entriesData.length);

      // Transform the data to match the frontend interface
      const ledgerEntries = entriesData.map(entry => {
        // Find the corresponding verification data
        const verification = filteredVerifications.find(v => v.id === entry.verification_id);

        console.log('Processing entry:', entry, 'with verification:', verification);

        return {
          id: entry.id,
          date: verification?.accounting_date || '',
          description: verification?.description || entry.transaction_info || '',
          // Formula: Debit - Credit (Debits positive, Credits negative)
          amount: (Number(entry.debit) || 0) - (Number(entry.credit) || 0),
          verification_series: verification?.verification_series || '',
          // Prepend series to number for full display (e.g. "F 13")
          voucher_number: `${verification?.verification_series || ''} ${verification?.verification_number || ''}`.trim(),
          comment: entry.comment || '',
          selected: false,
          matched: false
        };
      });

      console.log('Transformed ledger entries:', ledgerEntries);

      res.status(200).json({
        success: true,
        data: {
          accountingTransactions: ledgerEntries,
          loadedTransactions: [] // For now, loaded transactions would come from bank/cash files
        }
      });
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
      res.status(500).json(createError(`Failed to fetch ledger entries: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });

  static updateEntryComment = asyncHandler(async (req: JWTRequest, res: Response) => {
    const { id, comment } = req.body;

    if (!id) {
      res.status(400).json(createError('Entry ID is required'));
      return;
    }

    try {
      const { error } = await supabase
        .from('verification_entries')
        .update({ comment })
        .eq('id', id);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully'
      });
    } catch (error) {
      console.error('Error updating entry comment:', error);
      res.status(500).json(createError(`Failed to update comment: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}