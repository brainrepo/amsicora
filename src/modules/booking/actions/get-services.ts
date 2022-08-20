import { FastifyInstance } from 'fastify'

export type RequestType = { sellerId: string }

export async function action({
  server,
  payload,
}: {
  server: FastifyInstance
  payload: RequestType
}) {
  return await server.prisma.service.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      OR: [
        {
          sellers: {
            some: {
              id: payload.sellerId,
            },
          },
        },
        {
          owner: {
            id: payload.sellerId,
          },
        },
      ],
      published: true,
    },
  })
}
