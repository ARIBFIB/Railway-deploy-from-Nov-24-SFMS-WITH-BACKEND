import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { createError } from '../utils/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class ArticlesController {
  // Get all articles for a foundation
  static async getArticles(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { page = 1, limit = 50, search = '', filter = 'active' } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      let query = supabase
        .from('articles')
        .select('*')
        .eq('foundation_id', foundation_id);

      // Apply search filter
      if (search) {
        query = query.or(`item_no.ilike.%${search}%,name.ilike.%${search}%`);
      }

      // Apply status filter
      if (filter === 'active') {
        query = query.eq('is_active', true);
      } else if (filter === 'inactive') {
        query = query.eq('is_active', false);
      }

      // Apply pagination
      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data: articles, error } = await query;

      if (error) {
        throw createError('Failed to fetch articles', 500);
      }

      // Get total count for pagination
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('foundation_id', foundation_id);

      res.json({
        success: true,
        data: articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / Number(limit))
        }
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get article by ID
  static async getArticleById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .single();

      if (error) {
        throw createError('Article not found', 404);
      }

      res.json({
        success: true,
        data: article
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new article
  static async createArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const {
        item_no,
        name,
        starting_price,
        estimated_cost,
        in_stock,
        reserved,
        disposable,
        storage_location,
        stock_value,
        is_active = true
      } = req.body;

      // Generate next item number if not provided
      let finalItemNo = item_no;
      if (!finalItemNo) {
        const { data: lastArticle } = await supabase
          .from('articles')
          .select('item_no')
          .eq('foundation_id', foundation_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextNumber = lastArticle ? parseInt(lastArticle.item_no.split('-').pop() || '0') + 1 : 1;
        finalItemNo = `ART${nextNumber.toString().padStart(3, '0')}`;
      }

      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          foundation_id,
          item_no: finalItemNo,
          name,
          starting_price: parseFloat(starting_price),
          estimated_cost: parseFloat(estimated_cost),
          in_stock: parseInt(in_stock),
          reserved: parseInt(reserved),
          disposable: parseInt(disposable),
          storage_location,
          stock_value: parseFloat(stock_value),
          is_active,
          created_by: user_id
        })
        .select()
        .single();

      if (error) {
        throw createError('Failed to create article', 500);
      }

      res.status(201).json({
        success: true,
        data: article,
        message: 'Article created successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update article
  static async updateArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      const updateData = { ...req.body, updated_by: user_id };

      const { data: article, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .eq('foundation_id', foundation_id)
        .select()
        .single();

      if (error) {
        throw createError('Failed to update article', 500);
      }

      res.json({
        success: true,
        data: article,
        message: 'Article updated successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete article
  static async deleteArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const foundation_id = req.headers['x-foundation-id'] as string;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
        .eq('foundation_id', foundation_id);

      if (error) {
        throw createError('Failed to delete article', 500);
      }

      res.json({
        success: true,
        message: 'Article deleted successfully'
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Bulk operations
  static async bulkUpdateArticles(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const user_id = req.user?.id;
      const { article_ids, action, data } = req.body;

      if (!foundation_id || !user_id) {
        throw createError('Foundation ID and user ID are required', 400);
      }

      let updateData: any = { updated_by: user_id };

      switch (action) {
        case 'activate':
          updateData.is_active = true;
          break;
        case 'deactivate':
          updateData.is_active = false;
          break;
        case 'update_prices':
          if (data.starting_price !== undefined) updateData.starting_price = parseFloat(data.starting_price);
          if (data.estimated_cost !== undefined) updateData.estimated_cost = parseFloat(data.estimated_cost);
          break;
        default:
          throw createError('Invalid action', 400);
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .in('id', article_ids)
        .eq('foundation_id', foundation_id);

      if (error) {
        throw createError('Failed to update articles', 500);
      }

      res.json({
        success: true,
        message: `${article_ids.length} articles updated successfully`
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Search articles
  static async searchArticles(req: AuthenticatedRequest, res: Response) {
    try {
      const foundation_id = req.headers['x-foundation-id'] as string;
      const { q } = req.query;

      if (!foundation_id) {
        throw createError('Foundation ID is required', 400);
      }

      if (!q) {
        throw createError('Search query is required', 400);
      }

      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('foundation_id', foundation_id)
        .or(`item_no.ilike.%${q}%,name.ilike.%${q}%,storage_location.ilike.%${q}%`)
        .limit(20);

      if (error) {
        throw createError('Failed to search articles', 500);
      }

      res.json({
        success: true,
        data: articles
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
