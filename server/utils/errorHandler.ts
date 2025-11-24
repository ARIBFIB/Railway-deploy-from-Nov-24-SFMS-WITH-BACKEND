export interface HttpError extends Error {
  status?: number;
  details?: unknown;
}

export function createError(message: string, status: number = 500, details?: unknown): HttpError {
  const err = new Error(message) as HttpError;
  err.status = status;
  if (details !== undefined) err.details = details;
  return err;
}


