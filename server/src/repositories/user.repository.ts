import prisma from '../utils/prismaClient'
import { Role } from '@prisma/client'

export const userRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
  },

  findByRefreshToken: async (token: string) => {
    return prisma.user.findFirst({
      where: { refreshToken: token },
      include: { profile: true },
    })
  },

  create: async (data: {
    email: string
    password: string
    role: Role
    firstName: string
    lastName: string
  }) => {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: { profile: true },
    })
  },

  updateRefreshToken: async (userId: string, token: string | null) => {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    })
  },
}
