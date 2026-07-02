import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body)

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, accessToken },
      })
    } catch (error) {
      next(error)
    }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken
      const { accessToken, refreshToken } = await authService.refresh(token)

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: { accessToken },
      })
    } catch (error) {
      next(error)
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken
      await authService.logout(token)

      res.clearCookie('refreshToken', COOKIE_OPTIONS)

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      next(error)
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getMe(req.user!.userId)
      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },
}
