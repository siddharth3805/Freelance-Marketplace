import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'

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
      const user = await authService.login(req.body)
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },
}