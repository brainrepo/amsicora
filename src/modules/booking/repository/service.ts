import { PrismaClient } from '@prisma/client'

export default (prisma: PrismaClient) => ({
  async getSellablesBySeller(sellerID: string) {
    return await prisma.service.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        OR: [
          {
            sellers: {
              some: {
                id: sellerID,
              },
            },
          },
          {
            owner: {
              id: sellerID,
            },
          },
        ],
        published: true,
      },
    })
  },

  async getByIdIfSellable(serviceID: string, sellerID: string) {
    return await prisma.service.findFirst({
      select: {
        id: true,
        name: true,
        shifts: true,
        variants: true,
      },
      where: {
        OR: [
          {
            sellers: {
              some: {
                id: sellerID,
              },
            },
          },
          {
            owner: {
              id: sellerID,
            },
          },
        ],
        id: serviceID,
        published: true,
      },
    })
  },
})
