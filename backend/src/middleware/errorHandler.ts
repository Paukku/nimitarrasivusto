import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.issues,
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    error: 'Palvelinvirhe',
  });
}
