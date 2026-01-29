import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

// JWT Payload Interface
export interface JWTPayload {
  user_id: string;
  foundation_id: string;
  role_id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Role ID mapping
export const ROLE_IDS = {
  member: 1,
  admin: 2,
  authenticator: 3,
  superadmin: 4
} as const;

export type RoleType = keyof typeof ROLE_IDS;

/**
 * Generate a JWT token with user information
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'sfms-api',
    audience: 'sfms-client'
  } as jwt.SignOptions);
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  console.log('=== 🔍 VERIFY TOKEN FUNCTION START ===');
  console.log('Token length:', token.length);
  console.log('JWT_SECRET being used:', JWT_SECRET.substring(0, 20) + '...');
  console.log('Expected issuer:', 'sfms-api');
  console.log('Expected audience:', 'sfms-client');
  
  try {
    console.log('Attempting JWT verification...');
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sfms-api',
      audience: 'sfms-client'
    }) as JWTPayload;
    
    console.log('✅ JWT VERIFICATION SUCCESSFUL');
    console.log('Decoded payload:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ JWT VERIFICATION FAILED');
    console.error('Verification error:', {
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_name: error?.constructor?.name || 'Unknown',
      token_provided: !!token,
      secret_used: JWT_SECRET ? 'Yes' : 'No'
    });
    
    // Log the raw error
    console.error('Raw verification error:', error);
    
    throw new Error('Invalid or expired token');
  } finally {
    console.log('=== 🔍 VERIFY TOKEN FUNCTION END ===');
  }
};

/**
 * Generate a unique foundation ID
 */
export const generateFoundationId = (): string => {
  return uuidv4();
};

/**
 * Get role ID from role name
 */
export const getRoleId = (role: string): number => {
  const roleId = ROLE_IDS[role as RoleType];
  if (!roleId) {
    throw new Error(`Invalid role: ${role}`);
  }
  return roleId;
};

/**
 * Get role name from role ID
 */
export const getRoleName = (roleId: number): string => {
  const roleEntry = Object.entries(ROLE_IDS).find(([_, id]) => id === roleId);
  if (!roleEntry) {
    throw new Error(`Invalid role ID: ${roleId}`);
  }
  return roleEntry[0];
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1] || null;
};
