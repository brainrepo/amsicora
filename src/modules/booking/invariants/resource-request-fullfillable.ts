import { ResourceAmountLocker } from '@prisma/client'
import VariantRepository from '../repository/variant'
import { sum } from '../../../utils/array'

//TODO: Clear exported interfaces for in and out
//TODO: Map for errors
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
            el.amount - sum(el.resourceAmountLocker, 'amount')

          const isAvailabilityAmountEnough =
            availableAmount >= acc.residualAmount

          return {
            residualAmount: isAvailabilityAmountEnough
              ? 0
              : acc.residualAmount - availableAmount,
            lockers: [
              ...acc.lockers,
              {
                amount: isAvailabilityAmountEnough
                  ? acc.residualAmount
                  : availableAmount,
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
