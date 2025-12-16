import { supabase } from '../config/database';

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

export class VerificationModel {
  static async create(foundationId: string, verificationData: CreateVerificationData, userId: string): Promise<Verification> {
    try {
      console.log('🚀 VerificationModel.create - Starting');
      console.log('📊 Input data:', { foundationId, userId, verificationData });

      const insertData = {
        foundation_id: foundationId,
        verification_number: verificationData.verification_number,
        verification_series: verificationData.verification_series,
        accounting_date: verificationData.accounting_date,
        description: verificationData.description,
        accounting_template: verificationData.accounting_template,
        amount: verificationData.amount || 0,
        total_debit: verificationData.total_debit || 0,
        total_credit: verificationData.total_credit || 0,
        difference: verificationData.difference || 0,
        status: verificationData.status || 'draft',
        has_person: verificationData.has_person || false,
        has_comment: verificationData.has_comment || false,
        has_gallery: verificationData.has_gallery || false,
        created_by: userId,
        updated_by: userId
      };

      console.log('📋 Insert data for verifications table:', insertData);

      const { data: verification, error: verificationError } = await supabase
        .from('verifications')
        .insert(insertData)
        .select()
        .single();

      if (verificationError) {
        console.error('❌ Error creating verification:', verificationError);
        throw new Error(`Failed to create verification: ${verificationError.message}`);
      }

      console.log('✅ Verification created successfully:', verification);

      // Create verification entries if provided
      if (verificationData.entries && verificationData.entries.length > 0) {
        console.log('📋 Creating verification entries:', verificationData.entries.length);

        const entriesData = verificationData.entries.map(entry => ({
          verification_id: verification.id,
          account_id: entry.account_id,
          account_number: entry.account_number,
          account_name: entry.account_name,
          transaction_info: entry.transaction_info,
          debit: entry.debit || 0,
          credit: entry.credit || 0,
          balance: entry.balance || 0,
          created_by: userId,
          updated_by: userId
        }));

        console.log('📊 Entries data to insert:', entriesData);

        const { error: entriesError } = await supabase
          .from('verification_entries')
          .insert(entriesData);

        if (entriesError) {
          console.error('❌ Error creating verification entries:', entriesError);
          // Clean up verification if entries creation fails
          await supabase.from('verifications').delete().eq('id', verification.id);
          throw new Error(`Failed to create verification entries: ${entriesError.message}`);
        }

        console.log('✅ Verification entries created successfully');
      }

      // Create verification images if provided
      if (verificationData.images && verificationData.images.length > 0) {
        const imagesData = verificationData.images.map(image => ({
          verification_id: verification.id,
          verification_entry_id: image.verification_entry_id,
          image_url: image.image_url,
          image_name: image.image_name,
          image_size: image.image_size,
          mime_type: image.mime_type,
          uploaded_by: userId
        }));

        const { error: imagesError } = await supabase
          .from('verification_images')
          .insert(imagesData);

        if (imagesError) {
          throw new Error(`Failed to create verification images: ${imagesError.message}`);
        }
      }

      console.log('🔄 Fetching complete verification data...');
      const completeVerification = await this.getById(verification.id);
      console.log('✅ Complete verification data:', completeVerification);
      return completeVerification;
    } catch (error) {
      console.error('❌ Error in VerificationModel.create:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Verification> {
    try {
      const { data: verification, error: verificationError } = await supabase
        .from('verifications')
        .select('*')
        .eq('id', id)
        .single();

      if (verificationError) {
        throw new Error(`Failed to get verification: ${verificationError.message}`);
      }

      // Get verification entries
      const { data: entries, error: entriesError } = await supabase
        .from('verification_entries')
        .select('*')
        .eq('verification_id', id);

      if (entriesError) {
        throw new Error(`Failed to get verification entries: ${entriesError.message}`);
      }

      // Get verification images
      const { data: images, error: imagesError } = await supabase
        .from('verification_images')
        .select('*')
        .eq('verification_id', id);

      if (imagesError) {
        throw new Error(`Failed to get verification images: ${imagesError.message}`);
      }

      return {
        ...verification,
        entries: entries || [],
        images: images || []
      };
    } catch (error) {
      console.error('Error in VerificationModel.getById:', error);
      throw error;
    }
  }

  static async getByFoundation(foundationId: string, filters: VerificationFilters = {}): Promise<VerificationsResponse> {
    try {
      console.log('🚀 VerificationModel.getByFoundation - Starting');
      console.log('📊 Input:', { foundationId, filters });

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('verifications')
        .select('*', { count: 'exact' })
        .eq('foundation_id', foundationId);

      console.log('📋 Base query created for foundation_id:', foundationId);

      // Apply filters
      if (filters.search) {
        query = query.or(`verification_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.verification_series) {
        query = query.eq('verification_series', filters.verification_series);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.accounting_date_from) {
        query = query.gte('accounting_date', filters.accounting_date_from);
      }

      if (filters.accounting_date_to) {
        query = query.lte('accounting_date', filters.accounting_date_to);
      }

      if (filters.min_amount !== undefined) {
        query = query.gte('amount', filters.min_amount);
      }

      if (filters.max_amount !== undefined) {
        query = query.lte('amount', filters.max_amount);
      }

      // Apply pagination
      query = query
        .order('accounting_date', { ascending: false })
        .order('verification_number', { ascending: true })
        .range(offset, offset + limit - 1);

      console.log('📋 Executing query with pagination:', { offset, limit });

      // Debug: Also try a simple query without filters to see all records
      const { data: allVerifications, error: allError } = await supabase
        .from('verifications')
        .select('*')
        .eq('foundation_id', foundationId);

      console.log('🔍 Debug - All verifications for foundation:', {
        count: allVerifications?.length || 0,
        verificationNumbers: allVerifications?.map(v => v.verification_number) || []
      });

      const { data: verifications, error, count } = await query;

      if (error) {
        console.error('❌ Query error:', error);
        throw new Error(`Failed to get verifications: ${error.message}`);
      }

      const total = count || 0;
      const pages = Math.ceil(total / limit);

      console.log('✅ Query executed successfully:', {
        verificationsCount: verifications?.length || 0,
        total,
        pages,
        page,
        limit
      });

      return {
        success: true,
        data: verifications || [],
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      console.error('Error in VerificationModel.getByFoundation:', error);
      throw error;
    }
  }

  // New method to get ALL verifications without filters or pagination
  static async getAllByFoundation(foundationId: string): Promise<{ success: boolean; data: Verification[] }> {
    try {
      console.log('🚀 VerificationModel.getAllByFoundation - Starting');
      console.log('📊 Foundation ID:', foundationId);

      const { data: verifications, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('foundation_id', foundationId)
        .order('accounting_date', { ascending: false })
        .order('verification_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all verifications:', error);
        throw new Error(`Failed to fetch verifications: ${error.message}`);
      }

      console.log('✅ Successfully fetched all verifications:', {
        count: verifications?.length || 0,
        verificationNumbers: verifications?.map(v => v.verification_number) || []
      });

      return {
        success: true,
        data: verifications || []
      };
    } catch (error) {
      console.error('❌ Error in VerificationModel.getAllByFoundation:', error);
      throw error;
    }
  }

  // Method to get ALL verifications from all foundations (for admin users)
  static async getAll(): Promise<{ success: boolean; data: Verification[] }> {
    try {
      console.log('🚀 VerificationModel.getAll - Starting (Admin access)');

      const { data: verifications, error } = await supabase
        .from('verifications')
        .select('*')
        .order('accounting_date', { ascending: false })
        .order('verification_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all verifications:', error);
        throw new Error(`Failed to fetch verifications: ${error.message}`);
      }

      console.log('✅ Successfully fetched all verifications (Admin):', {
        count: verifications?.length || 0,
        verificationNumbers: verifications?.map(v => v.verification_number) || []
      });

      return {
        success: true,
        data: verifications || []
      };
    } catch (error) {
      console.error('❌ Error in VerificationModel.getAll:', error);
      throw error;
    }
  }

  static async update(id: string, verificationData: UpdateVerificationData, userId: string): Promise<Verification> {
    try {
      // Separate entries and images from the main verification data
      const { entries, images, ...mainData } = verificationData;

      const updateData = {
        ...mainData,
        updated_by: userId
      };

      const { data: verification, error: verificationError } = await supabase
        .from('verifications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (verificationError) {
        throw new Error(`Failed to update verification: ${verificationError.message}`);
      }

      // Update verification entries if provided
      if (verificationData.entries) {
        // Delete existing entries
        const { error: deleteError } = await supabase
          .from('verification_entries')
          .delete()
          .eq('verification_id', id);

        if (deleteError) {
          throw new Error(`Failed to delete existing verification entries: ${deleteError.message}`);
        }

        // Insert new entries
        if (verificationData.entries.length > 0) {
          const entriesData = verificationData.entries.map(entry => ({
            verification_id: id,
            account_id: entry.account_id,
            account_number: entry.account_number,
            account_name: entry.account_name,
            transaction_info: entry.transaction_info,
            debit: entry.debit || 0,
            credit: entry.credit || 0,
            balance: entry.balance || 0,
            created_by: userId,
            updated_by: userId
          }));

          const { error: entriesError } = await supabase
            .from('verification_entries')
            .insert(entriesData);

          if (entriesError) {
            throw new Error(`Failed to create verification entries: ${entriesError.message}`);
          }
        }
      }

      // Update verification images if provided
      if (verificationData.images) {
        // Delete existing images
        const { error: deleteError } = await supabase
          .from('verification_images')
          .delete()
          .eq('verification_id', id);

        if (deleteError) {
          throw new Error(`Failed to delete existing verification images: ${deleteError.message}`);
        }

        // Insert new images
        if (verificationData.images.length > 0) {
          const imagesData = verificationData.images.map(image => ({
            verification_id: id,
            verification_entry_id: image.verification_entry_id,
            image_url: image.image_url,
            image_name: image.image_name,
            image_size: image.image_size,
            mime_type: image.mime_type,
            uploaded_by: userId
          }));

          const { error: imagesError } = await supabase
            .from('verification_images')
            .insert(imagesData);

          if (imagesError) {
            throw new Error(`Failed to create verification images: ${imagesError.message}`);
          }
        }
      }

      return await this.getById(id);
    } catch (error) {
      console.error('Error in VerificationModel.update:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ VerificationModel.delete - Starting delete for:', id);

      // 1. Delete associated images
      const { error: imagesError } = await supabase
        .from('verification_images')
        .delete()
        .eq('verification_id', id);

      if (imagesError) {
        console.error('⚠️ Error deleting verification images (continuing):', imagesError);
      } else {
        console.log('✅ Deleted associated images');
      }

      // 2. Delete associated entries
      const { error: entriesError } = await supabase
        .from('verification_entries')
        .delete()
        .eq('verification_id', id);

      if (entriesError) {
        console.error('❌ Error deleting verification entries:', entriesError);
        throw new Error(`Failed to delete verification entries: ${entriesError.message}`);
      }
      console.log('✅ Deleted associated entries');

      // 3. Delete the verification itself
      const { error } = await supabase
        .from('verifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting verification:', error);
        throw new Error(`Failed to delete verification: ${error.message}`);
      }
      console.log('✅ Deleted verification record');
    } catch (error) {
      console.error('Error in VerificationModel.delete:', error);
      throw error;
    }
  }

  static async getNextVerificationNumber(foundationId: string, series: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('verification_number')
        .eq('foundation_id', foundationId)
        .eq('verification_series', series)
        .order('verification_number', { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(`Failed to get next verification number: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return `${series}1`;
      }

      const lastNumber = data[0]?.verification_number;
      if (!lastNumber) {
        return `${series}1`;
      }

      const numberPart = lastNumber.replace(series, '');
      const nextNumber = parseInt(numberPart) + 1;

      return `${series}${nextNumber}`;
    } catch (error) {
      console.error('Error in VerificationModel.getNextVerificationNumber:', error);
      throw error;
    }
  }
}
