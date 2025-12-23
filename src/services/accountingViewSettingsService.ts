import { apiFetch } from '../utils/api';

export interface AccountingViewSettings {
  enable_transaction_info: boolean;
  include_transaction_info_when_tab_entering: boolean;
  show_account_balance_column_in_posting_view: boolean;
}

export const accountingViewSettingsService = {
  getSettings: async (): Promise<AccountingViewSettings> => {
    try {
      const response = await apiFetch('/api/settings/accounting-view');
      if (!response.ok) {
        throw new Error(`Failed to fetch accounting view settings: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.data || {
        enable_transaction_info: false,
        include_transaction_info_when_tab_entering: false,
        show_account_balance_column_in_posting_view: false
      };
    } catch (error) {
      console.error('Error fetching accounting view settings:', error);
      // Return default values in case of error
      return {
        enable_transaction_info: false,
        include_transaction_info_when_tab_entering: false,
        show_account_balance_column_in_posting_view: false
      };
    }
  },

  updateSettings: async (settings: Partial<AccountingViewSettings>): Promise<{ success: boolean; data?: AccountingViewSettings; message?: string }> => {
    try {
      const response = await apiFetch('/api/settings/accounting-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating accounting view settings:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};