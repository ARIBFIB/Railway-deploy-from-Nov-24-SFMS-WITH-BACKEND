import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { JWTRequest } from '../middleware/jwtAuth';

const DAY_OPTIONS: Record<number, string> = {
  1: '1 day',
  2: '2 days',
  3: '3 days',
  5: '5 days',
  7: '7 days'
};

const normalizeMaxDaysDifference = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(1, Math.min(30, Math.trunc(value)));
  }

  if (typeof value === 'string') {
    const match = value.match(/\d+/);
    if (match) {
      return normalizeMaxDaysDifference(Number(match[0]));
    }
  }

  return 1;
};

const mapDaysToLabel = (value: number | null | undefined): string => {
  if (!value) {
    return DAY_OPTIONS[1] ?? '1 day';
  }

  const label = DAY_OPTIONS[value];
  if (label !== undefined) {
    return label;
  }

  return `${value} day${value === 1 ? '' : 's'}`;
};

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const fetchReconcileSettings = async (foundationId: string) => {
  const [{ data: settingsRow, error: settingsError }, { data: openingBalances, error: balancesError }] =
    await Promise.all([
      supabase
        .from('reconcile_account_settings')
        .select('*')
        .eq('foundation_id', foundationId)
        .maybeSingle(),
      supabase
        .from('reconcile_account_opening_balances')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('created_at', { ascending: true })
    ]);

  if (settingsError) {
    throw settingsError;
  }

  if (balancesError) {
    throw balancesError;
  }

  return {
    activateDifferenceWarning: settingsRow?.activate_difference_warning ?? true,
    maxDaysDifference: mapDaysToLabel(settingsRow?.max_days_difference ?? 1),
    openingAccountBalance: (openingBalances || []).map((balance) => ({
      id: balance.id,
      account: balance.account || '',
      financialYear: balance.financial_year || '',
      balance: balance.balance || ''
    }))
  };
};

export class ReconcileAccountSettingsController {
  static getSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    const data = await fetchReconcileSettings(foundationId);

    res.status(200).json({
      success: true,
      data
    });
  });

  static saveSettings = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    const activateDifferenceWarning =
      req.body?.activateDifferenceWarning !== undefined
        ? !!req.body.activateDifferenceWarning
        : true;

    const maxDaysDifference = normalizeMaxDaysDifference(req.body?.maxDaysDifference);

    const openingBalancesInput = Array.isArray(req.body?.openingAccountBalance)
      ? req.body.openingAccountBalance
      : [];

    const sanitizedOpeningBalances = openingBalancesInput
      .map((item: any) => {
        const account = typeof item?.account === 'string' ? item.account.trim() : '';
        const financialYear = typeof item?.financialYear === 'string' ? item.financialYear.trim() : '';
        const balance = typeof item?.balance === 'string' ? item.balance.trim() : '';

        if (!account && !financialYear && !balance) {
          return null;
        }

        const payload: Record<string, unknown> = {
          foundation_id: foundationId,
          account,
          financial_year: financialYear,
          balance
        };

        if (isUuid(item?.id)) {
          payload.id = item.id;
        }

        return payload;
      })
      .filter(
        (entry: Record<string, unknown> | null): entry is Record<string, unknown> =>
          entry !== null
      );

    const { error: upsertError } = await supabase
      .from('reconcile_account_settings')
      .upsert({
        foundation_id: foundationId,
        activate_difference_warning: activateDifferenceWarning,
        max_days_difference: maxDaysDifference,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    const { error: deleteBalancesError } = await supabase
      .from('reconcile_account_opening_balances')
      .delete()
      .eq('foundation_id', foundationId);

    if (deleteBalancesError) {
      throw deleteBalancesError;
    }

    if (sanitizedOpeningBalances.length > 0) {
      const { error: insertBalancesError } = await supabase
        .from('reconcile_account_opening_balances')
        .insert(sanitizedOpeningBalances);

      if (insertBalancesError) {
        throw insertBalancesError;
      }
    }

    const data = await fetchReconcileSettings(foundationId);

    res.status(200).json({
      success: true,
      message: 'Reconcile account settings saved successfully',
      data
    });
  });
}

