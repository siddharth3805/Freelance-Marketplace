import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import { ApiError } from '../utils/ApiError'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token required')
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      next(error)
      return
    }
    next(new ApiError(401, 'Invalid or expired access token'))
  }
}
