// This mock contains:
// - 2 variants adults and children, each variant has:
//   - 2 resources: seat and food
// - the food has enough availability
// - the seat has enough availability with some locker
// all the availability is fullfillable

import { parseISO } from 'date-fns'

export default [
  {
    id: 'tavolara-boat-excursion-adults',
    name: 'adults',
    prices: [],
    resources: [
      {
        id: 'tavolara-boat-excursion-seat',
        name: 'seat',
        // 50 units available
        resourceAmount: [
          {
            id: 'tavolara-boat-excursion-seat-amount-sup',
            amount: 100,
            priority: 100,
            resourceAmountLocker: [
              {
                id: 'l',
                amount: 20,
                reservationID: '123',
                sellerId: 'asdsadi',
                reservationId: 'aaa',
                resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
              },
              {
                id: 'l1',
                amount: 30,
                reservationID: '123',
                sellerId: 'asdsadi',
                reservationId: 'aaa',
                resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
              },
            ],
            date: new Date(),
            shift: {
              id: 'tavolara-boat-excursion-morning',
              name: 'morning',
              serviceId: 'tavolara-boat-excursion',
              time: parseISO('1970-01-01T07:30:44.067Z'),
            },
            isAllotment: false,
          },
        ],
      },
      {
        id: 'tavolara-boat-excursion-lunch',
        name: 'lunch',
        resourceAmount: [
          {
            priority: 100,
            //20 pax available
            id: 'tavolara-boat-excursion-lunch-amount-sup',
            amount: 10,
            resourceAmountLocker: [],
            date: new Date(),
            shift: {
              id: 'tavolara-boat-excursion-morning',
              name: 'morning',
              serviceId: 'tavolara-boat-excursion',
              time: parseISO('1970-01-01T07:30:44.067Z'),
            },
            isAllotment: false,
          },
        ],
      },
    ],
  },
  {
    id: 'tavolara-boat-excursion-children',
    name: 'children',
    prices: [],
    resources: [
      {
        // 50 available but shared with adults
        id: 'tavolara-boat-excursion-seat',
        name: 'seat',
        resourceAmount: [
          {
            id: 'tavolara-boat-excursion-seat-amount-sup',
            amount: 100,
            priority: 100,
            resourceAmountLocker: [
              {
                id: 'l',
                amount: 20,
                reservationID: '123',
                sellerId: 'asdsadi',
                reservationId: 'aaa',
                resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
              },
              {
                id: 'l1',
                amount: 30,
                reservationID: '123',
                sellerId: 'asdsadi',
                reservationId: 'aaa',
                resourceAmountId: 'tavolara-boat-excursion-seat-amount-sup',
              },
            ],
            date: new Date(),
            shift: {
              id: 'tavolara-boat-excursion-morning',
              name: 'morning',
              serviceId: 'tavolara-boat-excursion',
              time: parseISO('1970-01-01T07:30:44.067Z'),
            },
            isAllotment: false,
          },
        ],
      },
      {
        // 20 units available to share with others
        id: 'tavolara-boat-excursion-lunch',
        name: 'lunch',
        resourceAmount: [
          {
            id: 'tavolara-boat-excursion-lunch-amount-sup',
            amount: 10,
            priority: 100,
            resourceAmountLocker: [],
            date: new Date(),
            shift: {
              id: 'tavolara-boat-excursion-morning',
              name: 'morning',
              serviceId: 'tavolara-boat-excursion',
              time: parseISO('1970-01-01T07:30:44.067Z'),
            },
            isAllotment: false,
          },
        ],
      },
    ],
  },
]
