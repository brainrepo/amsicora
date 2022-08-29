import { ResourceAmountLocker } from '@prisma/client'
import VariantRepository from '../repository/variant'
import { sum } from '../../../utils/array'
import { BookingMalformedRequest, BookingNotAvailableResource } from '../errors'
import variant from '../repository/variant'
import { ArrayItemType } from '../../../utils/types'

//TODO: Clear exported interfaces for in and out
// **IMPORTANT!** the function is considering the in-reservation lockers, since the
//                reservation can have resources shared by multiple variants, we can
//                face a situation when the same reservation can have two different variants
//                that uses the same resource, then when we book the second variant we
//                consider the resourceAmountLocked from the previous variant.

interface Request {
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

interface Response {
  lockers?: Partial<ResourceAmountLocker>[]
  errors?: Array<BookingMalformedRequest | BookingNotAvailableResource>
}

type Variants = Awaited<
  ReturnType<
    ReturnType<
      typeof VariantRepository
    >['getWithResourcesAndAmountsByIDsAndSeller']
  >
>

export default async function resourcesAvailable({
  request,
  variants,
}: {
  request: Request
  variants: Variants
}): Promise<Response> {
  if (
    variants.length !== request.variants.length ||
    request.variants.length === 0
  ) {
    return {
      errors: [new BookingMalformedRequest('Duplicate or not known variant')],
    }
  }

  let lockers: Partial<ResourceAmountLocker>[] = []
  let errors: Array<BookingMalformedRequest | BookingNotAvailableResource> = []

  for (const variant of variants) {
    const requestedAmount =
      (
        request.variants.find(
          (variantReq) => variantReq.id === variant.id,
        ) as ArrayItemType<Request['variants']>
      ).amount ?? 0

    for (const variantResource of variant.resources) {
      let residualAmount = requestedAmount

      for (const resourceAmount of variantResource.resourceAmount) {
        const lockedAmountInThisRequest = sum(
          lockers.filter((l) => l.resourceAmountId === resourceAmount.id),
          'amount',
        )
        const lockedAmountInOtherReservations = sum(
          resourceAmount.resourceAmountLocker,
          'amount',
        )
        const availableAmount =
          resourceAmount.amount -
          lockedAmountInOtherReservations -
          lockedAmountInThisRequest

        const isAvailabileAmountEnough = availableAmount >= residualAmount
        // Update lockers
        lockers = [
          ...lockers,
          {
            amount: isAvailabileAmountEnough ? residualAmount : availableAmount,
            resourceAmountId: resourceAmount.id,
            sellerId: request.seller.id,
          },
        ]
        // Update residual amount
        residualAmount = isAvailabileAmountEnough
          ? 0
          : residualAmount - availableAmount
      }

      if (residualAmount > 0) {
        errors = [
          ...errors.flat(3),
          new BookingNotAvailableResource(
            'Not enough availability',
            variant.id,
            variantResource.id,
            residualAmount,
          ),
        ]
      }
    }
  }

  return { lockers, errors }
}
