import multer from 'multer';
import { createError } from './errorHandler';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  console.log('📁 File Filter - Processing file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File type accepted:', file.mimetype);
    cb(null, true);
  } else {
    console.error('❌ File type rejected:', file.mimetype, 'Allowed types:', allowedTypes);
    cb(createError('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.', 400), false);
  }
};

// Middleware to ensure file size is properly captured
const ensureFileSize = (req: any, res: any, next: any) => {
  if (req.file) {
    // If file size is undefined, try to get it from buffer
    if (req.file.size === undefined && req.file.buffer) {
      req.file.size = req.file.buffer.length;
      console.log('📏 File size corrected from buffer:', req.file.size);
    }
    
    console.log('📁 Final file info:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length
    });
  }
  next();
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// Export the ensureFileSize middleware
export { ensureFileSize };

// Middleware for handling upload errors
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  console.error('❌ Upload Error Handler - Processing error:', {
    error: error.message,
    code: error.code,
    stack: error.stack
  });

  if (error instanceof multer.MulterError) {
    console.error('❌ Multer Error:', error.code, error.message);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File Too Large',
        message: 'File size cannot exceed 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too Many Files',
        message: 'Only one file can be uploaded at a time'
      });
    }
  }
  
  console.error('❌ Unhandled upload error, passing to next middleware');
  next(error);
};