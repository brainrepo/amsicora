import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

export type RequestType = { sellerId: string }

// ACTION
export async function action({
  server,
  payload,
}: {
  server: FastifyInstance
  payload: RequestType
}) {
  return await server.prisma.services.findMany({
    where: {
      sellers: {
        some: {
          id: payload.sellerId,
        },
      },
    },
  })
}
