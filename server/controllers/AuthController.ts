import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError as createAppError } from '../middleware/errorHandler';
import { generateToken, generateFoundationId, getRoleId, JWTPayload } from '../utils/jwt';

// Helper function to create application errors
const createError = (message: string, statusCode: number = 500) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, full_name, role, foundation_id, admin_id, governance_role_id } = req.body;

    // Validate role if provided - check against database constraint
    const validRoles = ['member', 'admin', 'authenticator']; // superadmin not allowed in current DB constraint
    if (role && !validRoles.includes(role)) {
      throw createError(`Invalid role. Valid roles are: ${validRoles.join(', ')}. Note: 'superadmin' requires database constraint update.`, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: role || 'member'
      }
    });

    if (authError) {
      throw createError(authError.message, 400);
    }

    if (!authData.user) {
      throw createError('Failed to create user', 500);
    }

    // Check if profile already exists (might be created automatically by trigger)
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is expected if profile doesn't exist
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw createError('Failed to check user profile', 500);
    }

    if (existingProfile) {
      // Profile exists, update it with the specified role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name,
          email,
          role: role || 'member',
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (updateError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw createError('Failed to update user profile', 500);
      }
    } else {
      // Profile doesn't exist, create it using upsert to handle race conditions with triggers
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name,
          email,
          role: role || 'member',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        console.error('❌ Profile error details:', JSON.stringify(profileError, null, 2));
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw createError(`Failed to create user profile: ${profileError.message || JSON.stringify(profileError)}`, 500);
      }
    }

    // Assign user to governance role if provided
    if (governance_role_id) {
      const { error: roleAssignmentError } = await supabase
        .from('user_governance_roles')
        .insert({
          user_id: authData.user.id,
          role_id: governance_role_id,
          assigned_at: new Date().toISOString()
        });

      if (roleAssignmentError) {
        console.warn('Failed to assign governance role:', roleAssignmentError.message);
        // Don't fail registration if role assignment fails
      }
    }

    // Generate foundation_id if not provided (for admin users)
    const userFoundationId = foundation_id || (role === 'admin' ? generateFoundationId() : null);

    // If foundation_id is provided or generated, create foundation and add user to it
    if (userFoundationId) {
      // First, check if foundation exists, if not create it (for admin users)
      if (role === 'admin' && !foundation_id) {
        const { error: foundationError } = await supabase
          .from('foundations')
          .insert({
            id: userFoundationId,
            name: `${full_name}'s Foundation`,
            description: `Foundation created for ${full_name}`,
            owner_user_id: authData.user.id,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (foundationError) {
          console.warn('Failed to create foundation:', foundationError.message);
        }
      }

      // Add user to foundation
      const { error: memberError } = await supabase
        .from('foundation_members')
        .insert({
          foundation_id: userFoundationId,
          user_id: authData.user.id,
          role: role || 'member', // Use the specified role for foundation membership
          permissions: {},
          invited_by: admin_id || null,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (memberError) {
        console.warn('Failed to add user to foundation:', memberError.message);
        // Don't fail registration if foundation membership fails
      }
    }

    // Generate JWT token
    const userRole = role || 'member';
    const roleId = getRoleId(userRole);

    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      user_id: authData.user.id,
      foundation_id: userFoundationId || '',
      role_id: roleId,
      email: authData.user.email!,
      role: userRole
    };

    const token = generateToken(tokenPayload);

    // Console logging for admin registration
    if (userRole === 'admin') {
      console.log('🎯 Admin Registration Successful:');
      console.log('📋 Registration Details:', {
        user_id: authData.user.id,
        foundation_id: userFoundationId,
        role_id: roleId,
        email: authData.user.email,
        role: userRole,
        timestamp: new Date().toISOString()
      });
      console.log('🔑 JWT Token:', token);
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        role: userRole,
        foundation_id: userFoundationId,
        role_id: roleId,
        admin_id: admin_id || null
      }
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw createError('Invalid credentials', 401);
    }

    if (!data.user || !data.session) {
      throw createError('Login failed', 401);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw createError('User profile not found', 404);
    }

    // Get user's governance role and permissions
    const { data: governanceRoles, error: governanceError } = await supabase
      .from('user_governance_roles')
      .select(`
        role_id,
        roles!inner(
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('user_id', data.user.id);

    let userPermissions: string[] = [];
    let governanceRoleName: string | null = null;

    if (!governanceError && governanceRoles && governanceRoles.length > 0) {
      // User has governance role(s), use the first one's permissions
      const firstRole = governanceRoles[0]?.roles;
      if (firstRole) {
        userPermissions = (firstRole as any).permissions || [];
        governanceRoleName = (firstRole as any).name || null;
        console.log('🔐 User governance role:', governanceRoleName);
        console.log('🔐 User permissions:', userPermissions);
      }
    } else {
      console.warn('⚠️ User has no governance role assigned');
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
      .eq('user_id', data.user.id) as { data: any[] | null, error: any };

    if (membershipError) {
      console.warn('Failed to fetch foundation memberships:', membershipError.message);
    }

    // Debug logging
    console.log('🔍 Debug - Foundation Memberships:', foundationMemberships);
    console.log('🔍 Debug - User ID:', data.user.id);

    // Get user's role from profile
    const primaryRole = profile.role || 'member';
    const roleId = getRoleId(primaryRole);

    // Get primary foundation_id - check multiple sources
    let primaryFoundationId = '';

    if (foundationMemberships && foundationMemberships.length > 0) {
      // First, try to get from foundation memberships
      primaryFoundationId = foundationMemberships[0]?.foundation_id || '';
    } else {
      // If no foundation memberships found, check if user has any foundation associations
      // This handles cases where the user was created as admin but foundation_members entry failed
      const { data: userFoundations, error: foundationError } = await supabase
        .from('foundation_members')
        .select('foundation_id')
        .eq('user_id', data.user.id)
        .limit(1);

      if (!foundationError && userFoundations && userFoundations.length > 0) {
        primaryFoundationId = userFoundations[0]?.foundation_id || '';
      }
    }

    // For admin users, if no foundation_id is found, create or get a default admin foundation
    if (primaryRole === 'admin' && !primaryFoundationId) {
      try {
        // Try to find or create a default admin foundation
        const { data: adminFoundation, error: adminFoundationError } = await supabase
          .from('foundations')
          .select('id')
          .eq('name', 'System Administration')
          .eq('status', 'active')
          .single();

        if (adminFoundationError && adminFoundationError.code === 'PGRST116') {
          // Foundation doesn't exist, create it
          console.log('🔧 Creating default admin foundation...');
          const { data: newFoundation, error: createError } = await supabase
            .from('foundations')
            .insert({
              name: 'System Administration',
              registration_number: 'ADMIN-001',
              status: 'active',
              owner_user_id: data.user.id,
              description: 'Default foundation for system administrators',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (createError) {
            console.error('❌ Failed to create admin foundation:', createError);
            throw createError;
          }

          primaryFoundationId = newFoundation.id;
          console.log('✅ Created default admin foundation:', primaryFoundationId);

          // Add user as admin member of this foundation
          await supabase
            .from('foundation_members')
            .insert({
              foundation_id: primaryFoundationId,
              user_id: data.user.id,
              role: 'admin',
              permissions: { can_manage_all: true },
              joined_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            });

        } else if (adminFoundation) {
          primaryFoundationId = adminFoundation.id;
          console.log('✅ Using existing admin foundation:', primaryFoundationId);
        } else {
          console.error('❌ Failed to get admin foundation:', adminFoundationError);
          throw new Error('Failed to setup admin foundation access');
        }
      } catch (error) {
        console.error('❌ Error setting up admin foundation:', error);
        throw new Error('Failed to setup admin access');
      }
    }

    // Generate JWT token
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      user_id: data.user.id,
      foundation_id: primaryFoundationId,
      role_id: roleId,
      email: data.user.email!,
      role: primaryRole
    };

    const token = generateToken(tokenPayload);

    // Console logging for login details
    console.log('🔐 User Login Successful:');
    console.log('📋 Login Details:', {
      user_id: data.user.id,
      foundation_id: primaryFoundationId,
      role_id: roleId,
      role: primaryRole,
      email: data.user.email,
      timestamp: new Date().toISOString()
    });
    console.log('🔑 JWT Token:', token);

    // Build authorization context
    const authorizationContext = {
      user_id: data.user.id,
      admin_id: data.user.id, // User is their own admin initially
      foundation_ids: foundationMemberships?.map(m => m.foundation_id) || [],
      foundation_roles: foundationMemberships?.reduce((acc, m) => {
        acc[m.foundation_id] = {
          role: m.role,
          permissions: m.permissions,
          foundation_name: m.foundations?.name,
          foundation_status: m.foundations?.status,
          is_owner: m.foundations?.owner_user_id === data.user.id
        };
        return acc;
      }, {} as Record<string, any>) || {},
      primary_role: primaryRole,
      all_roles: [primaryRole, ...(foundationMemberships?.map(m => m.role) || [])]
    };

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: primaryRole,
        role_id: roleId,
        foundation_id: primaryFoundationId,
        roles: [primaryRole, ...(foundationMemberships?.map(m => m.role) || [])],
        governance_role: governanceRoleName,
        permissions: userPermissions
      },
      authorization_context: authorizationContext,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await supabase.auth.admin.signOut(token);
    }

    res.json({ message: 'Logout successful' });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw createError('Refresh token is required', 400);
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      throw createError('Invalid refresh token', 401);
    }

    res.json({
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    });
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({ message: 'Password reset email sent' });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({ message: 'Password reset successful' });
  });

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({ message: 'Email verified successfully' });
  });

  static getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No valid authorization token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw createError('Invalid or expired token', 401);
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw createError('User profile not found', 404);
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

    // Get user's role from profile
    const primaryRole = profile.role || 'member';

    // Build authorization context
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
      all_roles: [primaryRole, ...(foundationMemberships?.map(m => m.role) || [])]
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: primaryRole,
        roles: [primaryRole, ...(foundationMemberships?.map(m => m.role) || [])]
      },
      authorization_context: authorizationContext
    });
  });

  // Temporary endpoint to fix existing user foundation
  static fixUserFoundation = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
      // Check if user already has foundation
      const { data: existingMemberships, error: checkError } = await supabase
        .from('foundation_members')
        .select('foundation_id')
        .eq('user_id', user_id)
        .limit(1);

      if (checkError) {
        throw createError('Failed to check existing memberships', 500);
      }

      if (existingMemberships && existingMemberships.length > 0) {
        return res.json({
          message: 'User already has foundation',
          foundation_id: existingMemberships[0]?.foundation_id || ''
        });
      }

      // Create foundation for user
      const foundationId = generateFoundationId();
      const { error: foundationError } = await supabase
        .from('foundations')
        .insert({
          id: foundationId,
          name: 'User Foundation',
          description: 'Foundation created for user',
          owner_user_id: user_id,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (foundationError) {
        throw createError('Failed to create foundation', 500);
      }

      // Add user to foundation
      const { error: memberError } = await supabase
        .from('foundation_members')
        .insert({
          foundation_id: foundationId,
          user_id: user_id,
          role: 'admin',
          permissions: {},
          invited_by: null,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (memberError) {
        throw createError('Failed to add user to foundation', 500);
      }

      return res.json({
        message: 'Foundation created and user added successfully',
        foundation_id: foundationId
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw createError(errorMessage, 500);
    }
  });

  static createAdminUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, full_name } = req.body;

    // Check if the requesting user is admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Authorization required', 401);
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      throw createError('Invalid token', 401);
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      throw createError('Admin access required', 403);
    }

    // Create user with Supabase Auth
    const { data: authData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name
      }
    });

    if (createUserError) {
      throw createError(createUserError.message, 400);
    }

    if (!authData.user) {
      throw createError('Failed to create user', 500);
    }

    // Create profile
    const { error: profileCreateError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name,
        email,
        role: 'member', // Default role, can be changed later
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileCreateError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw createError('Failed to create user profile', 500);
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name
      }
    });
  });
}