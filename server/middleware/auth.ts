import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { verifyToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  // Keep flexible to avoid type conflicts with Express' built-in User type
  user?: any;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authorization token provided'
      });
    }

    const token = authHeader.substring(7);

    // Try custom JWT verification first
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        (req as AuthenticatedRequest).user = {
          id: decoded.user_id,
          user_id: decoded.user_id,
          email: decoded.email,
          role: decoded.role,
          foundation_id: decoded.foundation_id,
          role_id: decoded.role_id,
          // Build minimal auth context for compatibility
          foundation_ids: decoded.foundation_id ? [decoded.foundation_id] : [],
          foundation_roles: decoded.foundation_id ? {
            [decoded.foundation_id]: {
              role: decoded.role,
              permissions: {}
            }
          } : {},
          all_roles: [decoded.role]
        };
        return next();
      }
    } catch (e) {
      // Fallback to Supabase verification
    }

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User profile not found'
      });
    }

    // Get user's foundation memberships with roles and permissions
    const { data: foundationMemberships, error: membershipError } = await supabase
      .from('foundation_members')
      .select(`
        foundation_id,
        role,
        permissions,
        joined_at,
        foundations!inner(
          id,
          name,
          status,
          owner_user_id
        )
      `)
      .eq('user_id', user.id) as { data: any[] | null, error: any };

    if (membershipError) {
      console.warn('Failed to fetch foundation memberships:', membershipError.message);
    }

    // Extract user role from profile
    const primaryRole = profile.role || 'member';
    const allRoles = [primaryRole, ...(foundationMemberships?.map(m => m.role) || [])];

    // Build comprehensive authorization context
    const authorizationContext = {
      user_id: user.id,
      admin_id: user.id, // User is their own admin initially
      foundation_ids: foundationMemberships?.map(m => m.foundation_id) || [],
      foundation_roles: foundationMemberships?.reduce((acc, m) => {
        acc[m.foundation_id] = {
          role: m.role,
          permissions: m.permissions,
          foundation_name: m.foundations?.name,
          foundation_status: m.foundations?.status,
          is_owner: m.foundations?.owner_user_id === user.id
        };
        return acc;
      }, {} as Record<string, any>) || {},
      primary_role: primaryRole,
      all_roles: allRoles
    };

    (req as AuthenticatedRequest).user = {
      id: String(user.id), // Explicitly convert id to string
      email: user.email || '', // Provide fallback for undefined email
      role: primaryRole,
      roles: allRoles,
      // Enhanced authorization context
      ...authorizationContext
    };

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication verification failed'
    });
  }
};

export const requireFoundationAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundationId =
      req.params.foundationId ||
      req.body.foundation_id ||
      req.query.foundation_id ||
      req.body.foundationId ||
      req.query.foundationId ||
      req.body.customer?.foundation_id ||
      req.body.customer?.foundationId;

    if (!foundationId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Foundation ID is required'
      });
    }

    const userId = (req as any).user?.user_id || (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    console.log('🛡️ requireFoundationAccess - checking access:', {
      foundationId,
      userId,
      tokenFoundationId: (req as any).user?.foundation_id,
      tokenFoundationIds: (req as any).user?.foundation_ids,
      path: req.path,
      method: req.method
    });

    // TRUST THE TOKEN BYPASS:
    // If the token was validly signed and contains the foundationId we're looking for,
    // we can trust it for basic access. This handles schema mismatches and is much faster.
    const user = (req as any).user;
    if (user && (user.foundation_id === foundationId || user.foundation_ids?.includes(foundationId))) {
      console.log('✅ Access granted via token match');

      // Populate foundationRole/Permissions from user context if available
      const currentUser = (req as AuthenticatedRequest).user || {};
      (req as AuthenticatedRequest).user = {
        ...currentUser,
        foundationRole: currentUser.role || 'member',
        foundationPermissions: currentUser.foundationPermissions || {}
      };

      return next();
    }

    // Fallback to database check if token doesn't have the foundation_id
    // Check if user has access to this foundation
    // Use select('*') to be resilient to missing columns like 'permissions'
    const { data: membership, error } = await supabase
      .from('foundation_members')
      .select('*')
      .eq('foundation_id', foundationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !membership) {
      console.error('❌ Access denied to foundation (DB check failed):', {
        foundationId,
        userId,
        error: error?.message,
        membershipExists: !!membership,
        errorCode: error?.code,
        userContext: (req as any).user
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this foundation'
      });
    }

    const currentUser = (req as AuthenticatedRequest).user || {};
    (req as AuthenticatedRequest).user = {
      ...currentUser,
      foundationRole: membership.role,
      foundationPermissions: (membership as any).permissions || {}
    };

    return next();
  } catch (error) {
    console.error('Foundation access middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Foundation access verification failed'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user?.role || !roles.includes(user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required roles: ${roles.join(', ')}`
      });
    } else {
      return next();
    }
  };
};

export const requireSuperAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (user?.role !== 'superadmin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Super admin access required'
      });
    } else {
      return next();
    }
  };
};

export const requireAdminOrSuperAdmin = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user?.role || !['admin', 'superadmin'].includes(user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin or Super admin access required'
      });
    } else {
      return next();
    }
  };
};

export const requireFoundationRole = (foundationId: string, roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    const foundationRole = user?.foundation_roles?.[foundationId];

    if (!foundationRole || !roles.includes(foundationRole.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient foundation permissions. Required roles: ${roles.join(', ')}`
      });
    }

    return next();
  };
};

export const requireAnyFoundationRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    const foundationRoles = user?.foundation_roles || {};
    const hasRequiredRole = Object.values(foundationRoles).some(
      (role: any) => roles.includes(role.role)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient foundation permissions. Required roles: ${roles.join(', ')}`
      });
    }

    return next();
  };
};

export const requireFoundationOwnership = (foundationId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    const foundationRole = user?.foundation_roles?.[foundationId];

    if (!foundationRole || !foundationRole.is_owner) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Foundation ownership required'
      });
    }

    return next();
  };
};

export const requireDocumentAccess = (documentId: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user has access to the document through foundation membership
      const { data: document, error } = await supabase
        .from('documents')
        .select(`
          id,
          foundation_id,
          created_by,
          documents_profiles_1!inner(profile_id)
        `)
        .eq('id', documentId)
        .single();

      if (error || !document) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Document not found'
        });
      }

      // Check if user has access to the foundation
      const user = (req as AuthenticatedRequest).user;
      const hasFoundationAccess = user?.foundation_ids?.includes(document.foundation_id);
      const isDocumentCreator = document.created_by === user?.id;
      const hasDirectAccess = document.documents_profiles_1?.some(
        (dp: any) => dp.profile_id === user?.id
      );

      if (!hasFoundationAccess && !isDocumentCreator && !hasDirectAccess) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Access denied to this document'
        });
      }

      return next();
    } catch (error) {
      console.error('Document access middleware error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Document access verification failed'
      });
    }
  };
};