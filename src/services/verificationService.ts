import { apiFetch } from '../utils/api';

export interface AccountingTemplate {
  id: string;
  code: string;
  name: string;
  type: 'Verification' | 'Supplier invoice';
  verificationSeries: string;
  description: string;
  transactions: AccountingTransaction[];
}

export interface AccountingTransaction {
  id: string;
  account: string;
  transactionInfo: string;
  formula: string;
}

export interface VerificationEntry {
  id?: string;
  verification_id?: string;
  account_id?: string;
  account_number: string;
  account_name: string;
  transaction_info: string;
  debit: number;
  credit: number;
  balance: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface VerificationImage {
  id?: string;
  verification_id?: string;
  verification_entry_id?: string;
  image_url: string;
  image_name?: string;
  image_size?: number;
  mime_type?: string;
  uploaded_at?: string;
  uploaded_by?: string;
}

export interface Verification {
  id?: string;
  foundation_id?: string;
  verification_number: string;
  verification_series: string;
  accounting_date: string;
  description?: string;
  comment?: string;
  accounting_template?: string;
  amount: number;
  total_debit: number;
  total_credit: number;
  difference: number;
  status: 'draft' | 'posted' | 'cancelled';
  has_person: boolean;
  has_comment: boolean;
  has_gallery: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  entries?: VerificationEntry[];
  images?: VerificationImage[];
}

export interface CreateVerificationData {
  verification_number: string;
  verification_series: string;
  accounting_date: string;
  description?: string;
  comment?: string;
  accounting_template?: string;
  amount?: number;
  total_debit?: number;
  total_credit?: number;
  difference?: number;
  status?: 'draft' | 'posted' | 'cancelled';
  has_person?: boolean;
  has_comment?: boolean;
  has_gallery?: boolean;
  entries?: Omit<VerificationEntry, 'id' | 'verification_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>[];
  images?: Omit<VerificationImage, 'id' | 'verification_id' | 'uploaded_at' | 'uploaded_by'>[];
}

export interface UpdateVerificationData {
  verification_number?: string;
  verification_series?: string;
  accounting_date?: string;
  description?: string;
  accounting_template?: string;
  amount?: number;
  total_debit?: number;
  total_credit?: number;
  difference?: number;
  status?: 'draft' | 'posted' | 'cancelled';
  has_person?: boolean;
  has_comment?: boolean;
  has_gallery?: boolean;
  entries?: Omit<VerificationEntry, 'id' | 'verification_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>[];
  images?: Omit<VerificationImage, 'id' | 'verification_id' | 'uploaded_at' | 'uploaded_by'>[];
}

export interface VerificationFilters {
  search?: string;
  verification_series?: string;
  status?: string;
  accounting_date_from?: string;
  accounting_date_to?: string;
  verification_number?: string;
  description?: string;
  page?: number;
  limit?: number;
  min_amount?: number;
  max_amount?: number;
}

export interface VerificationResponse {
  success: boolean;
  data: Verification;
  message?: string;
}

export interface VerificationsResponse {
  success: boolean;
  data: Verification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export class VerificationService {
  static async createVerification(verificationData: CreateVerificationData): Promise<VerificationResponse> {
    console.log('🔄 VerificationService.createVerification - Starting with data:', verificationData);

    const response = await apiFetch('/api/verifications', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });

    console.log('📡 VerificationService.createVerification - Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create verification';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ VerificationService.createVerification - Error response:', errorData);
      } catch (parseError) {
        console.error('❌ VerificationService.createVerification - Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('✅ VerificationService.createVerification - Success:', result);
      return result;
    } catch (parseError) {
      console.error('❌ VerificationService.createVerification - Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  static async getVerifications(filters: VerificationFilters = {}): Promise<VerificationsResponse> {
    console.log('🔄 VerificationService.getVerifications - Starting with filters:', filters);

    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append('search', filters.search);
    if (filters.verification_series) queryParams.append('verification_series', filters.verification_series);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.accounting_date_from) queryParams.append('accounting_date_from', filters.accounting_date_from);
    if (filters.accounting_date_to) queryParams.append('accounting_date_to', filters.accounting_date_to);
    if (filters.verification_number) queryParams.append('verification_number', filters.verification_number);
    if (filters.description) queryParams.append('description', filters.description);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.min_amount !== undefined) queryParams.append('min_amount', filters.min_amount.toString());
    if (filters.max_amount !== undefined) queryParams.append('max_amount', filters.max_amount.toString());

    // Add cache busting timestamp to prevent stale data
    queryParams.append('_t', Date.now().toString());

    const response = await apiFetch(`/api/verifications?${queryParams.toString()}`);

    console.log('📡 VerificationService.getVerifications - Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch verifications';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ VerificationService.getVerifications - Error response:', errorData);
      } catch (parseError) {
        console.error('❌ VerificationService.getVerifications - Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('✅ VerificationService.getVerifications - Success:', {
        success: result.success,
        dataCount: result.data?.length || 0
      });
      return result;
    } catch (parseError) {
      console.error('❌ VerificationService.getVerifications - Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  static async getVerificationById(id: string): Promise<VerificationResponse> {
    const response = await apiFetch(`/api/verifications/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch verification');
    }

    return await response.json();
  }

  static async updateVerification(id: string, verificationData: UpdateVerificationData): Promise<VerificationResponse> {
    const response = await apiFetch(`/api/verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update verification');
    }

    return await response.json();
  }

  static async deleteVerification(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await apiFetch(`/api/verifications/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete verification');
    }

    return await response.json();
  }

  static async getNextVerificationNumber(series: string): Promise<{ success: boolean; data: { verification_number: string } }> {
    console.log('🔄 VerificationService.getNextVerificationNumber - Starting with series:', series);

    const response = await apiFetch(`/api/verifications/next-number?series=${series}`);

    console.log('📡 VerificationService.getNextVerificationNumber - Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get next verification number';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ VerificationService.getNextVerificationNumber - Error response:', errorData);
      } catch (parseError) {
        console.error('❌ VerificationService.getNextVerificationNumber - Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('✅ VerificationService.getNextVerificationNumber - Success:', result);
      return result;
    } catch (parseError) {
      console.error('❌ VerificationService.getNextVerificationNumber - Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  static async uploadImage(file: File): Promise<{ success: boolean; data: VerificationImage; message?: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiFetch('/api/verifications/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    return await response.json();
  }

  static async bulkUpdateStatus(verificationIds: string[], status: 'draft' | 'posted' | 'cancelled'): Promise<{ success: boolean; data: Verification[]; message?: string }> {
    const response = await apiFetch('/api/verifications/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({
        verification_ids: verificationIds,
        status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update verification status');
    }

    return await response.json();
  }

  static async getAccountingTemplates(): Promise<{ success: boolean; data: AccountingTemplate[]; message?: string }> {
    const response = await apiFetch('/api/settings/accounting-templates');

    if (!response.ok) {
      let errorMessage = 'Failed to fetch accounting templates';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ VerificationService.getAccountingTemplates - Error response:', errorData);
      } catch (parseError) {
        console.error('❌ VerificationService.getAccountingTemplates - Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('✅ VerificationService.getAccountingTemplates - Success:', result);
      return result;
    } catch (parseError) {
      console.error('❌ VerificationService.getAccountingTemplates - Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  static async bulkDelete(verificationIds: string[]): Promise<{ success: boolean; message?: string }> {
    const response = await apiFetch('/api/verifications/bulk', {
      method: 'DELETE',
      body: JSON.stringify({
        verification_ids: verificationIds
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete verifications');
    }

    return await response.json();
  }

  static async getUniqueDescriptions(): Promise<{ success: boolean; data: string[]; message?: string }> {
    const response = await apiFetch('/api/verifications/descriptions');

    if (!response.ok) {
      let errorMessage = 'Failed to fetch descriptions';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('❌ VerificationService.getUniqueDescriptions - Error response:', errorData);
      } catch (parseError) {
        console.error('❌ VerificationService.getUniqueDescriptions - Failed to parse error response:', parseError);
        const responseText = await response.text();
        console.error('❌ Raw error response:', responseText);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const result = await response.json();
      console.log('✅ VerificationService.getUniqueDescriptions - Success:', result);
      return result;
    } catch (parseError) {
      console.error('❌ VerificationService.getUniqueDescriptions - Failed to parse success response:', parseError);
      const responseText = await response.text();
      console.error('❌ Raw success response:', responseText);
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  static async searchEntries(filters: {
    min_amount?: number;
    max_amount?: number;
    verification_series?: string;
    date_from?: string;
    date_to?: string;
    account_number?: string;
  }): Promise<{ success: boolean; data: any[]; message?: string }> {
    const queryParams = new URLSearchParams();
    if (filters.min_amount !== undefined) queryParams.append('min_amount', filters.min_amount.toString());
    if (filters.max_amount !== undefined) queryParams.append('max_amount', filters.max_amount.toString());
    if (filters.verification_series) queryParams.append('verification_series', filters.verification_series);
    if (filters.date_from) queryParams.append('date_from', filters.date_from);
    if (filters.date_to) queryParams.append('date_to', filters.date_to);
    if (filters.account_number) queryParams.append('account_number', filters.account_number);

    const response = await apiFetch(`/api/verifications/search-entries?${queryParams.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search verification entries');
    }

    return await response.json();
  }

  static async attachImageToVerification(verificationId: string, file: File): Promise<{ success: boolean; data: VerificationImage; message?: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiFetch(`/api/verifications/${verificationId}/attach-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to attach image to verification');
    }
    
    return await response.json();
  }
}


