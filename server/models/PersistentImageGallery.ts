import { supabase } from '../config/database';

export interface PersistentImageGallery {
  id?: string;
  foundation_id: string;
  image_url: string;
  image_name: string;
  image_size?: number;
  mime_type?: string;
  file_path: string;
  uploaded_at?: string;
  uploaded_by?: string;
  is_linked?: boolean;
  linked_verification_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePersistentImageGalleryData {
  foundation_id: string;
  image_url: string;
  image_name: string;
  image_size?: number;
  mime_type?: string;
  file_path: string;
  uploaded_by?: string;
  is_linked?: boolean;
  linked_verification_id?: string;
}

export interface UpdatePersistentImageGalleryData {
  is_linked?: boolean;
  linked_verification_id?: string;
}

export interface PersistentImageGalleryFilters {
  foundation_id?: string;
  is_linked?: boolean;
  linked_verification_id?: string;
}

export interface PersistentImageGalleryResponse {
  success: boolean;
  data: PersistentImageGallery;
  message?: string;
}

export interface PersistentImageGalleriesResponse {
  success: boolean;
  data: PersistentImageGallery[];
  message?: string;
}

export class PersistentImageGalleryModel {
  static async create(imageData: CreatePersistentImageGalleryData): Promise<PersistentImageGallery> {
    try {
      console.log('🚀 PersistentImageGalleryModel.create - Starting');
      console.log('📊 Input data:', imageData);

      const { data: image, error } = await supabase
        .from('persistent_image_gallery')
        .insert(imageData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating persistent image gallery:', error);
        throw new Error(`Failed to create persistent image gallery: ${error.message}`);
      }

      console.log('✅ Persistent image gallery created successfully:', image);
      return image;
    } catch (error) {
      console.error('❌ Error in PersistentImageGalleryModel.create:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<PersistentImageGallery> {
    try {
      const { data: image, error } = await supabase
        .from('persistent_image_gallery')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to get persistent image gallery: ${error.message}`);
      }

      return image;
    } catch (error) {
      console.error('Error in PersistentImageGalleryModel.getById:', error);
      throw error;
    }
  }

  static async getByFoundation(foundationId: string, filters: PersistentImageGalleryFilters = {}): Promise<PersistentImageGalleriesResponse> {
    try {
      console.log('🚀 PersistentImageGalleryModel.getByFoundation - Starting');
      console.log('📊 Input:', { foundationId, filters });

      let query = supabase
        .from('persistent_image_gallery')
        .select('*')
        .eq('foundation_id', foundationId);

      if (filters.is_linked !== undefined) {
        query = query.eq('is_linked', filters.is_linked);
      }

      if (filters.linked_verification_id) {
        query = query.eq('linked_verification_id', filters.linked_verification_id);
      }

      const { data: images, error } = await query
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching persistent images:', error);
        throw new Error(`Failed to fetch persistent images: ${error.message}`);
      }

      console.log('✅ Successfully fetched persistent images:', {
        count: images?.length || 0
      });

      return {
        success: true,
        data: images || [],
        message: images ? `Found ${images.length} images` : 'No images found'
      };
    } catch (error) {
      console.error('Error in PersistentImageGalleryModel.getByFoundation:', error);
      throw error;
    }
  }

  static async update(id: string, imageData: UpdatePersistentImageGalleryData): Promise<PersistentImageGallery> {
    try {
      console.log('🚀 PersistentImageGalleryModel.update - Starting');
      console.log('📊 Input data:', { id, imageData });

      const { data: image, error } = await supabase
        .from('persistent_image_gallery')
        .update({
          ...imageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating persistent image gallery:', error);
        throw new Error(`Failed to update persistent image gallery: ${error.message}`);
      }

      console.log('✅ Persistent image gallery updated successfully:', image);
      return image;
    } catch (error) {
      console.error('Error in PersistentImageGalleryModel.update:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ PersistentImageGalleryModel.delete - Starting delete for:', id);

      const { error } = await supabase
        .from('persistent_image_gallery')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting persistent image gallery:', error);
        throw new Error(`Failed to delete persistent image gallery: ${error.message}`);
      }

      console.log('✅ Persistent image gallery deleted successfully');
    } catch (error) {
      console.error('Error in PersistentImageGalleryModel.delete:', error);
      throw error;
    }
  }

  static async deleteByFilePath(filePath: string): Promise<void> {
    try {
      console.log('🗑️ PersistentImageGalleryModel.deleteByFilePath - Starting delete for:', filePath);

      const { error } = await supabase
        .from('persistent_image_gallery')
        .delete()
        .eq('file_path', filePath);

      if (error) {
        console.error('❌ Error deleting persistent image gallery by file path:', error);
        throw new Error(`Failed to delete persistent image gallery by file path: ${error.message}`);
      }

      console.log('✅ Persistent image gallery deleted successfully by file path');
    } catch (error) {
      console.error('Error in PersistentImageGalleryModel.deleteByFilePath:', error);
      throw error;
    }
  }
}