import { ResourceAmountLocker } from '@prisma/client'
import VariantRepository from '../repository/variant'

export default async function resourcesAvailable({
  request,
  variantRepository,
}: {
  request: {
    shift: string
    variants: {
      id: string
      amount: number
    }[]
    date: string
    seller: {
      id: string
    }
  }
  variantRepository: ReturnType<typeof VariantRepository>
}) {
  const variants =
    await variantRepository.getWithResourcesAndAmountsByIDsAndSeller(
      request.variants.map((e) => e.id),
      request.seller.id,
      request.date,
      request.shift,
    )

  //TODO: improve the iterate result
  //TODO: create an error map
  return variants.map((variant) => {
    const resourceReturn = variant.resources.map((resource) => {
      const requestedAmount = request.variants.find(
        (variantReq) => (variantReq.id = variant.id),
      )?.amount

      if (typeof requestedAmount === 'undefined') {
        return 'error'
      }

      type resultT = {
        residualAmount: number
        lockers: Partial<ResourceAmountLocker>[]
      }

      const result = resource.resourceAmount.reduce(
        (acc, el) => {
          const availableAmount =
            el.amount -
            /* move the sum to an helper function*/
            el.resourceAmountLocker
              .map((e) => e.amount)
              .reduce((a, e) => a + e, 0)

          if (availableAmount >= acc.residualAmount) {
            return {
              residualAmount: 0,
              lockers: [
                ...acc.lockers,
                {
                  amount: acc.residualAmount,
                  resourceAmountId: el.id,
                  sellerId: request.seller.id,
                },
              ],
            }
          }

          return {
            residualAmount: acc.residualAmount - availableAmount,
            lockers: [
              ...acc.lockers,
              {
                amount: availableAmount,
                resourceAmountId: el.id,
                sellerId: request.seller.id,
              },
            ],
          }
        },
        {
          residualAmount: requestedAmount,
          lockers: [],
        } as resultT,
      )

      if (result.residualAmount > 0) {
        // return no enough availability
        // TODO: Improving error returning
        return {
          resource,
          response: `no enough availability for ${variant.name} and ${resource.name}`,
        }
      }
      // TODO: improve return values
      return { resource, response: result.lockers }
    })
    // TODO: improve return values
    return { variant, response: resourceReturn }
  })
}
