import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { JWTRequest } from './jwtAuth';

/**
 * Middleware to set Supabase context for RLS policies
 * This ensures that RLS policies can access the current user's information
 */
export const setSupabaseContext = (
  req: JWTRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      // Set the JWT token in Supabase context so RLS policies can access it
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        // Set the auth context in Supabase (async but don't await)
        supabase.auth.setSession({
          access_token: token,
          refresh_token: '' // We don't need refresh token for this
        }).then(() => {
          console.log('🔐 Supabase context set for user:', {
            user_id: req.user?.user_id,
            foundation_id: req.user?.foundation_id,
            role: req.user?.role
          });
        }).catch(error => {
          console.error('❌ Error setting Supabase context:', error);
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Error setting Supabase context:', error);
    // Don't fail the request, just log the error
    next();
  }
};

/**
 * Alternative approach: Create a Supabase client with the user's JWT token
 * This ensures all queries use the user's context
 */
export const createUserSupabaseClient = (req: JWTRequest) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    // Create a new Supabase client with the user's token
    return supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
  }
  
  return supabase;
};
