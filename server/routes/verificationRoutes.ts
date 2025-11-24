import { Router } from 'express';
import { VerificationController } from '../controllers/VerificationController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import multer from 'multer';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware);
router.use(setSupabaseContext as any);

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Verification CRUD routes
router.post('/', VerificationController.createVerification);
router.get('/', VerificationController.getVerifications);
router.get('/next-number', VerificationController.getNextVerificationNumber);
router.get('/:id', VerificationController.getVerificationById);
router.put('/:id', VerificationController.updateVerification);
router.delete('/:id', VerificationController.deleteVerification);

// Image upload route
router.post('/upload-image', upload.single('image'), VerificationController.uploadImage);

// Bulk operations
router.patch('/bulk/status', VerificationController.bulkUpdateStatus);
router.delete('/bulk', VerificationController.bulkDelete);

export default router;

