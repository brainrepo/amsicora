import { ResourceAmountLocker } from '@prisma/client'
import VariantRepository from '../repository/variant'
import { sum } from '../../../utils/array'
import { BookingMalformedRequest, BookingNotAvailableResource } from '../errors'

//TODO: Clear exported interfaces for in and out
//TODO: Map for errors
//TODO: **IMPORTANT!** the function is not considering the in reservation lockers, since the 
//                     reservation can have resources shared by multiple variants, we can
//                     have a case when in the same reservation we have two different variants
//                     using the same resource, then when we book the second variant we need
//                     to consider the resourceAmountLocked from the previous variant.

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

  if (
    variants.length !== request.variants.length ||
    request.variants.length === 0
  ) {
    return new BookingMalformedRequest('Duplicate or not known variant')
  }

  //TODO: improve the iterate result
  return variants.map((variant) => {
    return variant.resources.map((resource) => {
      const requestedAmount =
        (
          request.variants.find(
            (variantReq) => (variantReq.id = variant.id),
          ) as /*TODO extract type to interfaces*/ {
            id: string
            amount: number
          }
        ).amount ?? 0

      type resultT = {
        residualAmount: number
        lockers: Partial<ResourceAmountLocker>[]
      }

      const result = resource.resourceAmount.reduce(
        (acc, el) => {
          const availableAmount =
            el.amount - sum(el.resourceAmountLocker, 'amount') /* TODO: subtract acc.lockers that matches with this resourceAmount */

          const isAvailabileAmountEnough = availableAmount >= acc.residualAmount

          return {
            residualAmount: isAvailabileAmountEnough
              ? 0
              : acc.residualAmount - availableAmount,
            lockers: [
              ...acc.lockers,
              {
                amount: isAvailabileAmountEnough
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
        return new BookingNotAvailableResource(
          'resource not available',
          variant.id,
          resource.id,
          result.residualAmount,
        )
      }
      // TODO: improve return values
     return result.lockers 
    })
  }).flat(3)
}
