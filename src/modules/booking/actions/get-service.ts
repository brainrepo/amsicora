import { FastifyInstance } from 'fastify'

// VALIDATION
export const requestSchema = {
  type: 'object',
  properties: {
    serviceID: { type: 'string' },
  },
  required: ['serviceID'],
} as const

export type RequestType = { sellerID: string; serviceID: string }

export async function action({
  server,
  payload,
}: {
  server: FastifyInstance
  payload: RequestType
}) {
  const service = await server.prisma.service.findFirst({
    select: {
      id: true,
      name: true,
      shifts: true,
      variants: true,
    },
    where: {
      OR: [
        {
          sellers: {
            some: {
              id: payload.sellerID,
            },
          },
        },
        {
          owner: {
            id: payload.sellerID,
          },
        },
      ],
      id: payload.serviceID,
      published: true,
    },
  })

  if (!service) return server.httpErrors.notFound('service not found')

  return service
}
