import { Request, Response } from 'express';
import { supabase } from '../config/database';

interface PersonnelCategory {
  id: string;
  name: string;
  type: string;
  foundation_id: string;
  created_at: string;
  updated_at: string;
}

interface CreatePersonnelCategoryPayload {
  name: string;
  type: string;
  foundation_id: string;
}

export class PersonnelCategoriesController {
  // GET /api/personnel-categories?foundation_id=:id
  static async list(req: Request, res: Response) {
    try {
      const { foundation_id } = req.query;
      
      if (!foundation_id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'foundation_id is required'
        });
      }

      console.log('🔍 Querying personnel_categories for foundation:', foundation_id);
      
      const { data, error } = await supabase
        .from('personnel_categories')
        .select('*')
        .eq('foundation_id', foundation_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return res.status(500).json({
          error: 'Database Error',
          message: `Failed to fetch personnel categories: ${error.message}`,
          debug: {
            foundation_id,
            error_code: error.code
          }
        });
      }
      
      console.log('✅ Query successful, found', data?.length || 0, 'records');

      return res.status(200).json({
        data: data || [],
        count: data?.length || 0
      });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  // GET /api/personnel-categories/:id?foundation_id=:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { foundation_id } = req.query;
      
      if (!foundation_id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'foundation_id is required'
        });
      }

      const { data, error } = await supabase
        .from('personnel_categories')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(404).json({
          error: 'Not Found',
          message: 'Personnel category not found'
        });
      }

      return res.status(200).json({
        data
      });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  // POST /api/personnel-categories
  static async create(req: Request, res: Response) {
    try {
      const { name, type, foundation_id }: CreatePersonnelCategoryPayload = req.body;
      
      // Validate required fields
      if (!name || !type || !foundation_id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'name, type, and foundation_id are required'
        });
      }

      // Validate foundation exists and user has access
      const { data: foundationData, error: foundationError } = await supabase
        .from('foundations')
        .select('id')
        .eq('id', foundation_id)
        .single();

      if (foundationError || !foundationData) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid foundation_id'
        });
      }

      console.log('🔍 Creating personnel category:', { name, type, foundation_id });
      
      const { data, error } = await supabase
        .from('personnel_categories')
        .insert({
          name,
          type,
          foundation_id
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error on create:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
        return res.status(500).json({
          error: 'Database Error',
          message: `Failed to create personnel category: ${error.message}`,
          debug: {
            name,
            type,
            foundation_id,
            error_code: error.code
          }
        });
      }
      
      console.log('✅ Category created successfully:', data.id);

      return res.status(201).json({
        data,
        message: 'Personnel category created successfully'
      });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  // PUT /api/personnel-categories/:id?foundation_id=:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { foundation_id } = req.query;
      const { name, type } = req.body;
      
      if (!foundation_id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'foundation_id is required'
        });
      }

      // Check if category exists
      const { data: existingCategory, error: existingError } = await supabase
        .from('personnel_categories')
        .select('id')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (existingError || !existingCategory) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Personnel category not found'
        });
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (type) updateData.type = type;

      const { data, error } = await supabase
        .from('personnel_categories')
        .update(updateData)
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Failed to update personnel category'
        });
      }

      return res.status(200).json({
        data,
        message: 'Personnel category updated successfully'
      });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  // DELETE /api/personnel-categories/:id?foundation_id=:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { foundation_id } = req.query;
      
      if (!foundation_id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'foundation_id is required'
        });
      }

      // Check if category exists
      const { data: existingCategory, error: existingError } = await supabase
        .from('personnel_categories')
        .select('id')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (existingError || !existingCategory) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Personnel category not found'
        });
      }

      const { error } = await supabase
        .from('personnel_categories')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          error: 'Database Error',
          message: 'Failed to delete personnel category'
        });
      }

      return res.status(200).json({
        message: 'Personnel category deleted successfully'
      });
    } catch (error) {
      console.error('Controller error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }
}