import { PrismaClient, User } from '@prisma/client'

export default (prisma: PrismaClient) => ({
  async create(data: {
    id: string
    name: string
    email: string
    password: string
  }) {
    return await prisma.user.create({
      data,
    })
  },
})
