import { PrismaClient } from '@prisma/client'

// to do get resource with usable resources amount
export default (prisma: PrismaClient) => ({
  async getByVariantIDs(variantIDs: string[]) {
    return await prisma.resource.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        variants: {
          some: {
            id: {
              in: variantIDs,
            },
          },
        },
      },
    })
  },
})
