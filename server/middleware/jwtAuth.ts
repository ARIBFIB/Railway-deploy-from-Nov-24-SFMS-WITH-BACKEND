import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { createError } from '../utils/errorHandler';

export interface JWTRequest extends Request {
  // keep broad to avoid express User type conflicts
  user?: any;
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user context to request
 */
export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔐 JWT Auth Middleware - Processing request:', {
      method: req.method,
      path: req.path,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [REDACTED]' : 'No authorization header',
        'content-type': req.headers['content-type'],
        'x-foundation-id': req.headers['x-foundation-id']
      }
    });

    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      console.error('❌ No access token provided');
      throw createError('Access token is required', 401);
    }

    console.log('🔑 Token extracted, verifying...');

    // Verify and decode the token
    const decoded = verifyToken(token);
    
    console.log('✅ Token verified successfully:', {
      user_id: decoded.user_id,
      foundation_id: decoded.foundation_id,
      role: decoded.role,
      email: decoded.email
    });
    
    // Attach user context to request
    (req as JWTRequest).user = decoded;
    
    // Log user action for audit trail
    console.log(`🔐 User Action: ${req.method} ${req.path}`, {
      user_id: decoded.user_id,
      foundation_id: decoded.foundation_id,
      role_id: decoded.role_id,
      role: decoded.role,
      timestamp: new Date().toISOString()
    });
    
    next();
  } catch (error) {
    console.error('❌ JWT Authentication Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method: req.method,
      path: req.path
    });
    res.status(401).json({
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Invalid token'
    });
  }
};

/**
 * Optional JWT Authentication Middleware
 * Verifies JWT token if present, but doesn't require it
 */
export const optionalJwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      (req as JWTRequest).user = decoded;
      
      console.log(`🔐 Optional Auth: ${req.method} ${req.path}`, {
        user_id: decoded.user_id,
        foundation_id: decoded.foundation_id,
        role_id: decoded.role_id,
        role: decoded.role,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  } catch (error) {
    // For optional auth, we continue even if token is invalid
    console.warn('Optional JWT Authentication Warning:', error);
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const jwtReq = req as JWTRequest;
    if (!jwtReq.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(jwtReq.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
};

/**
 * Foundation-based authorization middleware
 */
export const requireFoundation = (req: Request, res: Response, next: NextFunction): void => {
  const jwtReq = req as JWTRequest;
  if (!jwtReq.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
    return;
  }

  const foundationId = req.params.foundation_id || req.body.foundation_id;
  
  if (foundationId && jwtReq.user.foundation_id !== foundationId) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied to this foundation'
    });
    return;
  }

  next();
};

/**
 * Admin or Super Admin authorization middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const jwtReq = req as JWTRequest;
  if (!jwtReq.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
    return;
  }

  const adminRoles = ['admin', 'superadmin'];
  if (!adminRoles.includes(jwtReq.user.role)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
    return;
  }

  next();
};

