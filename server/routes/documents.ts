import express from 'express';
import { body, param, query } from 'express-validator';
import { DocumentController } from '../controllers/DocumentController';
import { validateRequest } from '../middleware/validation';
import { jwtAuthMiddleware, requireFoundation } from '../middleware/jwtAuth';
import { upload, handleUploadError, ensureFileSize } from '../middleware/upload';

const router = express.Router();

// Apply JWT authentication middleware to all routes
router.use(jwtAuthMiddleware);

// Get documents with filters
router.get('/',
  [
    query('foundation_id').optional().isUUID(),
    query('document_type').optional().isString(),
    query('status').optional().isIn(['uploaded', 'pending_approval', 'approved', 'rejected'])
  ],
  validateRequest,
  DocumentController.getDocuments
);

// Get document by ID
router.get('/:id',
  [param('id').isUUID()],
  validateRequest,
  DocumentController.getDocumentById
);

// Upload new document
router.post('/',
  upload.single('document'),
  ensureFileSize,
  handleUploadError,
  [
    body('foundation_id').isString().isLength({ min: 1 }),
    body('document_type').isString().isLength({ min: 1, max: 255 }),
    body('notes').optional().trim()
  ],
  validateRequest,
  requireFoundation,
  DocumentController.uploadDocument
);

// Update document
router.put('/:id',
  [
    param('id').isUUID(),
    body('status').optional().isIn(['uploaded', 'pending_approval', 'approved', 'rejected']),
    body('approval_notes').optional().trim()
  ],
  validateRequest,
  DocumentController.updateDocument
);

// Delete document
router.delete('/:id',
  [param('id').isUUID()],
  validateRequest,
  DocumentController.deleteDocument
);

// Download document
router.get('/:id/download',
  [param('id').isUUID()],
  validateRequest,
  DocumentController.downloadDocument
);

// Get document versions
router.get('/:id/versions',
  [param('id').isUUID()],
  validateRequest,
  DocumentController.getDocumentVersions
);

// Upload new document version
router.post('/:id/versions',
  upload.single('document'),
  ensureFileSize,
  [
    param('id').isUUID(),
    body('change_notes').optional().trim()
  ],
  validateRequest,
  DocumentController.uploadDocumentVersion
);

// Document Types Routes
// Get available document types
router.get('/types', DocumentController.getDocumentTypes);

// Create default document types for foundation
router.post('/types/create-defaults',
  [
    body('foundation_id').optional().isUUID()
  ],
  validateRequest,
  DocumentController.createDefaultDocumentTypes
);

export default router;