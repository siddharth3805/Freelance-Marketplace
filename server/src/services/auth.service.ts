import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository'
import { ApiError } from '../utils/ApiError'
import { RegisterInput, LoginInput } from '../validations/auth.validation'

const SALT_ROUNDS = 10

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

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
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

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}