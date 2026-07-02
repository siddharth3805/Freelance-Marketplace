import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'

export const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode}: ${message}`)

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : message,
  })
}