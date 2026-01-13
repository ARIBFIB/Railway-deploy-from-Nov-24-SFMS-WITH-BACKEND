import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🚨 Global Error Handler - Processing error:', {
    message: error.message,
    name: error.name,
    statusCode: error.statusCode,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'Bearer [REDACTED]' : 'No authorization',
      'content-type': req.headers['content-type'],
      'x-foundation-id': req.headers['x-foundation-id']
    },
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Client Error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: (error as any).details,
      hint: (error as any).hint,
      code: (error as any).code
    })
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};