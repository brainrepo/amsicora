import { FastifyInstance } from 'fastify'

export default async (server: FastifyInstance) => {
  server.get('/services', {
    schema: {
      tags: ['booking'] as string[],
    },
    onRequest: [server.authenticate, server.isSeller],
    handler: async (req) =>
      await server.booking.repository.service.getSellablesBySeller(req.user.id),
  })
}
