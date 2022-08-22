import { PrismaClient, User } from '@prisma/client'

export default (prisma: PrismaClient) => ({
  async userByEmail(email: string) {
    return await prisma.user.findMany({
      where: { email },
    })
  },
})
