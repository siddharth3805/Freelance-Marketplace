import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository'
import { ApiError } from '../utils/ApiError'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { RegisterInput, LoginInput } from '../validations/auth.validation'

const SALT_ROUNDS = 10

const sanitizeUser = (user: any) => {
  const { password, refreshToken, ...rest } = user
  return rest
}

export const authService = {
  register: async (input: RegisterInput) => {
    const existingUser = await userRepository.findByEmail(input.email)

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
    })

    return sanitizeUser(user)
  },

  login: async (input: LoginInput) => {
    const user = await userRepository.findByEmail(input.email)

    if (!user) {
      throw new ApiError(401, 'Invalid email or password')
    }

    if (user.isBanned) {
      throw new ApiError(403, 'This account has been banned')
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const payload = { userId: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    await userRepository.updateRefreshToken(user.id, refreshToken)

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  },

  refresh: async (token: string) => {
    if (!token) {
      throw new ApiError(401, 'Refresh token required')
    }

    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token')
    }

    const user = await userRepository.findByRefreshToken(token)

    if (!user) {
      throw new ApiError(401, 'Refresh token not recognised')
    }

    const newPayload = { userId: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(newPayload)
    const newRefreshToken = generateRefreshToken(newPayload)

    await userRepository.updateRefreshToken(user.id, newRefreshToken)

    return { accessToken, refreshToken: newRefreshToken }
  },

  logout: async (token: string) => {
    if (!token) return

    const user = await userRepository.findByRefreshToken(token)
    if (user) {
      await userRepository.updateRefreshToken(user.id, null)
    }
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    return sanitizeUser(user)
  },
}
