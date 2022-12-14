import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { addDays, setHours, setMinutes } from 'date-fns'
import subDays from 'date-fns/subDays'

const prisma = new PrismaClient()

async function main() {
  await prisma.price.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.resourceAmount.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.service.deleteMany()
  await prisma.user.deleteMany()

  const seller = await prisma.user.upsert({
    where: { email: 'seller@amsicora.io' },
    update: {},
    create: {
      id: 'amsicora-seller',
      email: 'seller@amsicora.io',
      name: 'Amsicora seller',
      role: 'SELLER',
      password: '$2a$12$w6tnM/wjZcBRzpMQdJaivejlVuAxYStAlmF1HNTu.A00FW2KR/UHO',
    },
  })

  const service = await prisma.service.upsert({
    where: { id: 'tavolara-boat-excursion' },
    update: {},
    create: {
      id: 'tavolara-boat-excursion',
      name: 'Tavolara, boat excursion',
      published: true,
      owner: {
        create: {
          email: 'supplier@amsicora.io',
          name: 'Amsicora supplier',
          role: 'SUPPLIER',
          password:
            '$2a$12$w6tnM/wjZcBRzpMQdJaivejlVuAxYStAlmF1HNTu.A00FW2KR/UHO',
        },
      },
      sellers: {
        connect: {
          id: seller.id,
        },
      },
      shifts: {
        createMany: {
          data: [
            {
              id: 'tavolara-boat-excursion-morning',
              name: 'morning',
              time: setMinutes(setHours(new Date(), 9), 30),
            },
            {
              id: 'tavolara-boat-excursion-afternoon',
              name: 'afternoon',
              time: setMinutes(setHours(new Date(), 14), 30),
            },
          ],
        },
      },
      variants: {
        createMany: {
          data: [
            {
              id: 'tavolara-boat-excursion-adults',
              name: 'adults',
            },
            {
              id: 'tavolara-boat-excursion-children',
              name: 'children',
            },
            {
              id: 'tavolara-boat-excursion-infant',
              name: 'infant',
            },
          ],
        },
      },
    },
  })

  const resourcesSeat = await prisma.resource.upsert({
    where: { id: 'tavolara-boat-excursion-seat' },
    update: {},
    create: {
      id: 'tavolara-boat-excursion-seat',
      name: 'seat',
      limit: 100,
      serviceId: service.id,
      variants: {
        connect: [
          {
            id: 'tavolara-boat-excursion-adults',
          },
          {
            id: 'tavolara-boat-excursion-children',
          },
        ],
      },
      resourceAmount: {
        createMany: {
          data: [],
        },
      },
    },
  })

  const resourceSeatAmount = await prisma.resourceAmount.create({
    data: {
      resourceId: 'tavolara-boat-excursion-seat',
      id: 'tavolara-boat-excursion-seat-amount-sup',
      elapseDate: addDays(new Date(), 1),
      amount: 100,
      date: addDays(new Date(), 1),
      shiftId: 'tavolara-boat-excursion-morning',
      sellers: {
        connect: {
          id: seller.id,
        },
      },
    },
  })

  const resourcesLunch = await prisma.resource.upsert({
    where: { id: 'tavolara-boat-excursion-lunch' },
    update: {},
    create: {
      id: 'tavolara-boat-excursion-lunch',
      name: 'lunch',
      limit: 50,
      serviceId: service.id,
      variants: {
        connect: [
          {
            id: 'tavolara-boat-excursion-adults',
          },
          {
            id: 'tavolara-boat-excursion-children',
          },
        ],
      },
    },
  })

  const resourceLunchAmount = await prisma.resourceAmount.create({
    data: {
      resourceId: 'tavolara-boat-excursion-lunch',
      id: 'tavolara-boat-excursion-lunch-amount-sup',
      elapseDate: addDays(new Date(), 1),
      amount: 100,
      date: addDays(new Date(), 1),
      shiftId: 'tavolara-boat-excursion-morning',
      sellers: {
        connect: {
          id: seller.id,
        },
      },
    },
  })

  const priceAdults = await prisma.price.create({
    data: {
      id: 'pa',
      cost: 10,
      fee: 5,
      from: subDays(setMinutes(setHours(new Date(), 0), 0), 1),
      to: addDays(setMinutes(setHours(new Date(), 0), 0), 2),
      shift: {
        connect: {
          id: 'tavolara-boat-excursion-morning',
        },
      },
      variants: {
        connect: {
          id: 'tavolara-boat-excursion-adults',
        },
      },
      sellers: {
        connect: [
          {
            id: seller.id,
          },
        ],
      },
    },
  })
  const priceChildren = await prisma.price.create({
    data: {
      id: 'pc',
      cost: 5,
      fee: 3,
      from: subDays(new Date(), 1),
      to: addDays(new Date(), 1),
      shift: {
        connect: {
          id: 'tavolara-boat-excursion-morning',
        },
      },
      variants: {
        connect: {
          id: 'tavolara-boat-excursion-children',
        },
      },
      sellers: {
        connect: [
          {
            id: seller.id,
          },
        ],
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
