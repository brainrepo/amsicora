import { PrismaClient } from '@prisma/client'
import { parseISO } from 'date-fns'

export default (prisma: PrismaClient) => ({
  async getWithResourcesAndAmountsByIDsAndSeller(
    variantIDs: string[],
    sellerID: string,
    date: string,
    shift: string,
  ) {
    return await prisma.variant.findMany({
      select: {
        id: true,
        name: true,
        resources: {
          select: {
            id: true,
            name: true,
            resourceAmount: {
              select: {
                id: true,
                amount: true,
                resourceAmountLocker: true,
                date: true,
                shift: true,
                priority: true,
              },
              orderBy: {
                priority: 'desc',
              },
              where: {
                date: parseISO(date),
                shiftId: shift,
                elapseDate: {
                  gte: new Date(),
                },
                OR: {
                  isAllotment: false,
                  sellers: {
                    some: {
                      id: sellerID,
                    },
                  },
                },
              },
            },
          },
        },
        prices: {
          where: {
            shiftId: shift,
            from: {
              lte: parseISO(date),
            },
            to: {
              gte: parseISO(date),
            },
            sellers: {
              some: {
                id: sellerID,
              },
            },
          },
        },
      },
      where: {
        id: {
          in: variantIDs,
        },
      },
    })
  },
})
