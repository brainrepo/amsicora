import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.services.deleteMany()
  await prisma.user.deleteMany()

  const seller = await prisma.user.upsert({
    where: { email: 'seller@amsicora.io' },
    update: {},
    create: {
      email: 'seller@amsicora.io',
      name: 'Amsicora seller',
      role: 'SELLER',
      password: '$2a$12$w6tnM/wjZcBRzpMQdJaivejlVuAxYStAlmF1HNTu.A00FW2KR/UHO',
    },
  })

  const service = await prisma.services.upsert({
    where: { id: 'test-service' },
    update: {},
    create: {
      name: 'Test Service',
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
