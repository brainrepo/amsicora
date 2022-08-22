import { FastifyInstance } from 'fastify'

export default async (server: FastifyInstance) => {
  server.get<{
    Params: {
      serviceID: string
    }
  }>('/services/:serviceID', {
    onRequest: [server.authenticate, server.isSeller],
    schema: {
      params: {
        type: 'object',
        properties: {
          serviceID: { type: 'string' },
        },
        required: ['serviceID'],
      },
    },
    handler: async (req) =>
      (await server.booking.repository.service.getByIdIfSellable(
        req.params.serviceID,
        req.user.id,
      )) || server.httpErrors.notFound('service not found'),
  })
}
