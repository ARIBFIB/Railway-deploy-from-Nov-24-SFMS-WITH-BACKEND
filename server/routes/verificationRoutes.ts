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

// Image upload route
router.post('/upload-image', upload.single('image'), VerificationController.uploadImage);

// Attach image to existing verification
router.post('/:id/attach-image', upload.single('image'), VerificationController.attachImageToVerification);

// Persistent image gallery routes
router.get('/gallery/unlinked', VerificationController.getUnlinkedImages);
router.post('/gallery/:imageId/link', VerificationController.linkImageToVerification);
router.delete('/gallery/:imageId', VerificationController.deleteUnlinkedImage);

// Bulk operations
router.patch('/bulk/status', VerificationController.bulkUpdateStatus);
router.delete('/bulk', VerificationController.bulkDelete);

// Verification CRUD routes
router.post('/', VerificationController.createVerification);
router.get('/', VerificationController.getVerifications);
router.get('/next-number', VerificationController.getNextVerificationNumber);
router.get('/descriptions', VerificationController.getUniqueDescriptions);
router.get('/search-entries', VerificationController.searchEntries);
router.get('/unique-series', VerificationController.getUniqueVerificationSeries);
router.get('/:id', VerificationController.getVerificationById);
router.get('/:id/images', VerificationController.getVerificationImages);
router.put('/:id', VerificationController.updateVerification);
router.delete('/:id', VerificationController.deleteVerification);

export default router;

