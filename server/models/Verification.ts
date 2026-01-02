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
  comment?: string;
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
        comment: verificationData.comment,
        amount: verificationData.amount || 0,
        total_debit: verificationData.total_debit || 0,
        total_credit: verificationData.total_credit || 0,
        difference: verificationData.difference || 0,
        status: verificationData.status || 'draft',
        has_person: verificationData.has_person || false,
        has_comment: verificationData.has_comment || false,
        has_gallery: (verificationData.images && verificationData.images.length > 0) || verificationData.has_gallery || false,
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
        .select('*, entries:verification_entries(*)', { count: 'exact' })
        .eq('foundation_id', foundationId);

      console.log('📋 Base query created for foundation_id:', foundationId);

      // Apply filters
      if (filters.search) {
        query = query.or(`verification_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.verification_number) {
        query = query.eq('verification_number', filters.verification_number);
      }

      if (filters.description) {
        query = query.ilike('description', `%${filters.description}%`);
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

      // Get verification IDs to check for images
      const verificationIds = verifications?.map(v => v.id) || [];
      
      // Fetch image counts for each verification
      let imagesData: { verification_id: string }[] = [];
      if (verificationIds.length > 0) {
        const { data: verificationImages, error: imagesError } = await supabase
          .from('verification_images')
          .select('verification_id')
          .in('verification_id', verificationIds);
          
        if (imagesError) {
          console.error('❌ Error fetching verification images:', imagesError);
          // Continue without image data
          imagesData = [];
        } else {
          imagesData = verificationImages || [];
        }
      }
      
      // Create a map of verification IDs to image existence
      const hasImageMap: { [key: string]: boolean } = {};
      imagesData.forEach(image => {
        if (image.verification_id) {
          hasImageMap[image.verification_id] = true;
        }
      });
      
      // Update verifications with correct has_gallery value
      const updatedVerifications = (verifications || []).map(verification => ({
        ...verification,
        has_gallery: Boolean(hasImageMap[verification.id || ''])
      }));
      
      const total = count || 0;
      const pages = Math.ceil(total / limit);

      console.log('✅ Query executed successfully:', {
        verificationsCount: updatedVerifications?.length || 0,
        total,
        pages,
        page,
        limit
      });

      return {
        success: true,
        data: updatedVerifications,
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
        .select('*, entries:verification_entries(*)')
        .eq('foundation_id', foundationId)
        .order('accounting_date', { ascending: false })
        .order('verification_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all verifications:', error);
        throw new Error(`Failed to fetch verifications: ${error.message}`);
      }

      // Get verification IDs to check for images
      const verificationIds = verifications?.map(v => v.id) || [];
      
      // Fetch image counts for each verification
      let imagesData: { verification_id: string }[] = [];
      if (verificationIds.length > 0) {
        const { data: verificationImages, error: imagesError } = await supabase
          .from('verification_images')
          .select('verification_id')
          .in('verification_id', verificationIds);
          
        if (imagesError) {
          console.error('❌ Error fetching verification images:', imagesError);
          // Continue without image data
          imagesData = [];
        } else {
          imagesData = verificationImages || [];
        }
      }
      
      // Create a map of verification IDs to image existence
      const hasImageMap: { [key: string]: boolean } = {};
      imagesData.forEach(image => {
        if (image.verification_id) {
          hasImageMap[image.verification_id] = true;
        }
      });
      
      // Update verifications with correct has_gallery value
      const updatedVerifications = (verifications || []).map(verification => ({
        ...verification,
        has_gallery: Boolean(hasImageMap[verification.id || ''])
      }));
      
      console.log('✅ Successfully fetched all verifications:', {
        count: updatedVerifications?.length || 0,
        verificationNumbers: updatedVerifications?.map(v => v.verification_number) || []
      });

      return {
        success: true,
        data: updatedVerifications
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
        .select('*, entries:verification_entries(*)')
        .order('accounting_date', { ascending: false })
        .order('verification_number', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all verifications:', error);
        throw new Error(`Failed to fetch verifications: ${error.message}`);
      }

      // Get verification IDs to check for images
      const verificationIds = verifications?.map(v => v.id) || [];
      
      // Fetch image counts for each verification
      let imagesData: { verification_id: string }[] = [];
      if (verificationIds.length > 0) {
        const { data: verificationImages, error: imagesError } = await supabase
          .from('verification_images')
          .select('verification_id')
          .in('verification_id', verificationIds);
          
        if (imagesError) {
          console.error('❌ Error fetching verification images:', imagesError);
          // Continue without image data
          imagesData = [];
        } else {
          imagesData = verificationImages || [];
        }
      }
      
      // Create a map of verification IDs to image existence
      const hasImageMap: { [key: string]: boolean } = {};
      imagesData.forEach(image => {
        if (image.verification_id) {
          hasImageMap[image.verification_id] = true;
        }
      });
      
      // Update verifications with correct has_gallery value
      const updatedVerifications = (verifications || []).map(verification => ({
        ...verification,
        has_gallery: Boolean(hasImageMap[verification.id || ''])
      }));
      
      console.log('✅ Successfully fetched all verifications (Admin):', {
        count: updatedVerifications?.length || 0,
        verificationNumbers: updatedVerifications?.map(v => v.verification_number) || []
      });

      return {
        success: true,
        data: updatedVerifications
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
      if (verificationData.images !== undefined) { // Check if images field was provided in the update
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
        
        // Update has_gallery field based on whether images exist after the update
        const hasGallery = verificationData.images.length > 0;
        const { error: updateGalleryError } = await supabase
          .from('verifications')
          .update({ has_gallery: hasGallery })
          .eq('id', id);
          
        if (updateGalleryError) {
          console.error('❌ Error updating has_gallery field:', updateGalleryError);
          throw new Error(`Failed to update has_gallery field: ${updateGalleryError.message}`);
        }
      } else {
        // If images were not provided in the update, check if images exist in the database and update has_gallery accordingly
        const { count, error: countError } = await supabase
          .from('verification_images')
          .select('*', { count: 'exact', head: true })
          .eq('verification_id', id);
          
        if (countError) {
          console.error('❌ Error counting verification images:', countError);
          throw new Error(`Failed to count verification images: ${countError.message}`);
        }
        
        const hasGallery = (count || 0) > 0;
        const { error: updateGalleryError } = await supabase
          .from('verifications')
          .update({ has_gallery: hasGallery })
          .eq('id', id);
          
        if (updateGalleryError) {
          console.error('❌ Error updating has_gallery field:', updateGalleryError);
          throw new Error(`Failed to update has_gallery field: ${updateGalleryError.message}`);
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
        .order('verification_number'); // Get all in ascending order to process properly

      if (error) {
        throw new Error(`Failed to get next verification number: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return `${series}1`;
      }

      // Find the highest numeric value among existing verification numbers
      let maxNumber = 0;
      
      for (const record of data) {
        const verificationNumber = record.verification_number;
        if (verificationNumber) {
          // Extract the numeric part after the series prefix
          const numberPart = verificationNumber.replace(series, '');
          const numericValue = parseInt(numberPart);
          
          if (!isNaN(numericValue) && numericValue > maxNumber) {
            maxNumber = numericValue;
          }
        }
      }
      
      const nextNumber = maxNumber + 1;
      
      return `${series}${nextNumber}`;
    } catch (error) {
      console.error('Error in VerificationModel.getNextVerificationNumber:', error);
      throw error;
    }
  }

  static async getUniqueDescriptionsByFoundation(foundationId: string): Promise<string[]> {
    try {
      console.log('🔍 VerificationModel.getUniqueDescriptionsByFoundation - Starting for foundation:', foundationId);

      const { data, error } = await supabase
        .from('verifications')
        .select('description')
        .eq('foundation_id', foundationId)
        .not('description', 'is', null)
        .order('description', { ascending: true });

      if (error) {
        console.error('❌ Error fetching unique descriptions:', error);
        throw new Error(`Failed to fetch unique descriptions: ${error.message}`);
      }

      // Extract descriptions and remove duplicates
      const descriptions = Array.from(new Set(data.map(item => item.description).filter(desc => desc && desc.trim() !== '')));

      console.log('✅ Fetched unique descriptions:', descriptions.length);
      return descriptions;
    } catch (error) {
      console.error('Error in VerificationModel.getUniqueDescriptionsByFoundation:', error);
      throw error;
    }
  }

  static async getAllUniqueDescriptions(): Promise<string[]> {
    try {
      console.log('🔍 VerificationModel.getAllUniqueDescriptions - Starting');

      const { data, error } = await supabase
        .from('verifications')
        .select('description')
        .not('description', 'is', null)
        .order('description', { ascending: true });

      if (error) {
        console.error('❌ Error fetching all unique descriptions:', error);
        throw new Error(`Failed to fetch all unique descriptions: ${error.message}`);
      }

      // Extract descriptions and remove duplicates
      const descriptions = Array.from(new Set(data.map(item => item.description).filter(desc => desc && desc.trim() !== '')));

      console.log('✅ Fetched all unique descriptions:', descriptions.length);
      return descriptions;
    } catch (error) {
      console.error('Error in VerificationModel.getAllUniqueDescriptions:', error);
      throw error;
    }
  }

  static async searchEntries(foundationId: string, filters: {
    min_amount?: number;
    max_amount?: number;
    verification_series?: string;
    date_from?: string;
    date_to?: string;
    account_number?: string;
  }): Promise<any[]> {
    try {
      console.log('🚀 VerificationModel.searchEntries - Starting with filters:', filters);

      let query = supabase
        .from('verification_entries')
        .select(`
          id,
          account_number,
          account_name,
          transaction_info,
          debit,
          credit,
          verifications!inner (
            id,
            verification_number,
            accounting_date,
            description,
            verification_series,
            foundation_id
          )
        `)
        .eq('verifications.foundation_id', foundationId);

      const min = filters.min_amount;
      const max = filters.max_amount;

      if (min !== undefined && max !== undefined) {
        // Range check for either debit or credit: (min <= debit <= max) OR (min <= credit <= max)
        query = query.or(`and(debit.gte.${min},debit.lte.${max}),and(credit.gte.${min},credit.lte.${max})`);
      } else if (min !== undefined) {
        // Only min threshold: (debit >= min) OR (credit >= min)
        query = query.or(`debit.gte.${min},credit.gte.${min}`);
      } else if (max !== undefined) {
        // Only max threshold: (debit <= max) OR (credit <= max)
        query = query.or(`debit.lte.${max},credit.lte.${max}`);
      }

      if (filters.verification_series && filters.verification_series !== 'all') {
        query = query.eq('verifications.verification_series', filters.verification_series);
      }

      if (filters.date_from) {
        query = query.gte('verifications.accounting_date', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('verifications.accounting_date', filters.date_to);
      }

      if (filters.account_number) {
        query = query.eq('account_number', filters.account_number);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error in searchEntries:', error);
        throw new Error(`Failed to search verification entries: ${error.message}`);
      }

      // Flatten the results for easier frontend consumption
      const results = (data || []).map(entry => {
        // PostgREST/Supabase might return joined objects as an array even if it's a many-to-one relationship
        const v = Array.isArray(entry.verifications) ? entry.verifications[0] : entry.verifications;

        return {
          id: entry.id,
          verification_id: v?.id,
          verification_number: v?.verification_number,
          accounting_date: v?.accounting_date,
          description: v?.description,
          account_number: entry.account_number,
          account_name: entry.account_name,
          transaction_info: entry.transaction_info,
          debit: entry.debit,
          credit: entry.credit
        };
      });

      console.log('✅ searchEntries returned results:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Error in VerificationModel.searchEntries:', error);
      throw error;
    }
  }
}
