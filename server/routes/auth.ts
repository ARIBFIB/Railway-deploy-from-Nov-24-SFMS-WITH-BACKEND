import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validation';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().isLength({ min: 2 }),
    body('role').optional().isIn(['member', 'admin', 'authenticator']),
    body('foundation_id').optional().isUUID(),
    body('admin_id').optional().isUUID()
  ],
  validateRequest,
  AuthController.register
);

// Login user
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validateRequest,
  AuthController.login
);

// Logout user
router.post('/logout', AuthController.logout);

// Refresh token
router.post('/refresh', AuthController.refreshToken);

// Forgot password
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validateRequest,
  AuthController.forgotPassword
);

// Reset password
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 })
  ],
  validateRequest,
  AuthController.resetPassword
);

// Verify email
router.post('/verify-email',
  [body('token').notEmpty()],
  validateRequest,
  AuthController.verifyEmail
);

// Get current user with authorization context (protected route)
router.get('/me', jwtAuthMiddleware, AuthController.getCurrentUser);

// Temporary endpoint to fix user foundation (for existing users)
router.post('/fix-foundation/:user_id', AuthController.fixUserFoundation);

export default router;