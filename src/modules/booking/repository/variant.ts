import { PrismaClient } from '@prisma/client'
import { parseISO } from 'date-fns'
// to do get resource with usable resources amount
export default (prisma: PrismaClient) => ({
  //add elapse date
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
              },
              where: {
                date: parseISO(date),
                shiftId: shift,
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
      where: {
        id: {
          in: variantIDs,
        },
      },
    })
  },
})
