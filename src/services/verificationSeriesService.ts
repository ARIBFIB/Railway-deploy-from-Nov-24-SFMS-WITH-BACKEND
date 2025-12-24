import { apiFetch } from '../utils/api';

export interface VerificationSeriesItem {
  id: string;
  code: string;
  name: string;
  manualAccounting: boolean;
  position: number;
}

export interface VerificationSeriesSettings {
  series: VerificationSeriesItem[];
  dropdownSelections: Record<string, string>;
}

export interface SelectedVerificationSeriesItem {
  id: string;
  code: string;
  name: string;
  manualAccounting: boolean;
  position: number;
}

export interface VerificationSeriesResponse {
  success: boolean;
  data: Record<string, VerificationSeriesSettings>;
  message?: string;
}

export interface SaveVerificationSeriesRequest {
  category: string;
  series: {
    id?: string;
    code: string;
    name: string;
    manualAccounting: boolean;
    position: number;
  }[];
  dropdownSelections: Record<string, string>;
}

export interface SaveVerificationSeriesResponse {
  success: boolean;
  data: {
    category: string;
    series: VerificationSeriesItem[];
    dropdownSelections: Record<string, string>;
  };
  message?: string;
}

export const verificationSeriesService = {
  getSettings: async (category?: string): Promise<VerificationSeriesResponse> => {
    try {
      let url = '/api/settings/verification-series';
      if (category) {
        url += `?category=${category}`;
      }
      
      const response = await apiFetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch verification series settings: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching verification series settings:', error);
      throw error;
    }
  },

  saveSettings: async (request: SaveVerificationSeriesRequest): Promise<SaveVerificationSeriesResponse> => {
    try {
      const response = await apiFetch('/api/settings/verification-series', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save verification series settings: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving verification series settings:', error);
      throw error;
    }
  },

  getSelectedSeries: async (category: string = 'accounting'): Promise<SelectedVerificationSeriesItem[]> => {
    try {
      const response = await apiFetch(`/api/settings/verification-series?category=${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch verification series settings: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success || !data.data?.[category]?.series) {
        return [];
      }
      
      const allSeries = data.data[category].series;
      
      // Filter to only include series where manualAccounting is true (i.e., checked/selected)
      return allSeries.filter((series: VerificationSeriesItem) => series.manualAccounting === true);
    } catch (error) {
      console.error('Error fetching selected verification series:', error);
      // Return empty array if there's an error
      return [];
    }
  }
};