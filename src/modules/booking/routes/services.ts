import { FastifyInstance } from 'fastify'

export default async (server: FastifyInstance) => {
  server.get('/services', {
    onRequest: [server.authenticate, server.isSeller],
    handler: async (req) =>
      await server.booking.repository.service.getSellablesBySeller(req.user.id),
  })
}
