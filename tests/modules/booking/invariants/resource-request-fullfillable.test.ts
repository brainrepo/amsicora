import VariantRepository from '../../../../src/modules/booking/repository/variant'
import resourcesAvailable from '../../../../src/modules/booking/invariants/resource-request-fullfillable'
import { BookingNotAvailableResource } from '../../../../src/modules/booking/errors'
import enoughAvailability from './mocks/enough-availability'
import type { PrismaClient } from '@prisma/client'

let fun = jest.fn()
jest.mock('../../../../src/modules/booking/repository/variant', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getWithResourcesAndAmountsByIDsAndSeller: fun,
    }
  })
})

// !IMPORTANT:
//
// This test doesn't cover unaccesssible allotments because in managed by prisma
// query and will be handled by e2e test.
// This test doesn't cover the elapsed availability case, it will be managed on
// the e2e tests

describe('resource-request-fullfillable', () => {
  const variantRepository = VariantRepository({} as PrismaClient) as ReturnType<
    typeof VariantRepository
  >

  it('succeeds when there is enough resource', async () => {
    const request = {
      shift: 'tavolara-boat-excursion-morning',
      date: '2022-08-26t21:14:31.315-02:00',
      seller: {
        id: 'amsicora-seller',
      },
      variants: [
        {
          id: 'tavolara-boat-excursion-adults',
          amount: 5,
        },
        {
          id: 'tavolara-boat-excursion-children',
          amount: 5,
        },
      ],
    }

    fun.mockResolvedValue(enoughAvailability)

    const res = await resourcesAvailable({ request, variantRepository })
    expect(res?.errors).toHaveLength(0)
    expect(res.lockers).toStrictEqual([
      {
        amount: 5,
        resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
        sellerId: 'amsicora-seller',
      },
      {
        amount: 5,
        resourceAmountId: 'tavolara-boat-excursion-lunch-amount-sup',
        sellerId: 'amsicora-seller',
      },
      {
        amount: 5,
        resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
        sellerId: 'amsicora-seller',
      },
      {
        amount: 5,
        resourceAmountId: 'tavolara-boat-excursion-lunch-amount-sup',
        sellerId: 'amsicora-seller',
      },
    ])
  })

  it('fails when there is not enough availability', async () => {
    const request = {
      shift: 'tavolara-boat-excursion-morning',
      date: '2022-08-26t21:14:31.315-02:00',
      seller: {
        id: 'amsicora-seller',
      },
      variants: [
        {
          id: 'tavolara-boat-excursion-adults',
          amount: 15,
        },
        {
          id: 'tavolara-boat-excursion-children',
          amount: 5,
        },
      ],
    }

    fun.mockResolvedValue(enoughAvailability)

    const res = await resourcesAvailable({ request, variantRepository })
    console.log(JSON.stringify(res))
    expect(res?.errors).toHaveLength(2)

    expect(res?.errors?.[0].name).toEqual('BOOKING_NOT_AVAILABLE_RESOURCE')
    expect(res?.errors?.[1].name).toEqual('BOOKING_NOT_AVAILABLE_RESOURCE')

    expect(
      (res?.errors?.[0] as any as BookingNotAvailableResource)?.residualAmount,
    ).toEqual(5)
    expect(
      (res?.errors?.[0] as any as BookingNotAvailableResource)?.residualAmount,
    ).toEqual(5)
  })

  it('fails when receives a request with a duplicate variant', async () => {
    const request = {
      shift: 'tavolara-boat-excursion-morning',
      date: '2022-08-26t21:14:31.315-02:00',
      seller: {
        id: 'amsicora-seller',
      },
      variants: [
        {
          id: 'tavolara-boat-excursion-adults',
          amount: 5,
        },
        {
          id: 'tavolara-boat-excursion-children',
          amount: 5,
        },
        {
          id: 'tavolara-boat-excursion-children',
          amount: 5,
        },
      ],
    }

    fun.mockResolvedValue(enoughAvailability)

    const res = await resourcesAvailable({ request, variantRepository })
    expect(res?.errors?.[0].name).toEqual('BOOKING_MALFORMED_REQUEST')
  })
})
