import { FastifyInstance } from 'fastify'
import * as GetSellableServices from '../../modules/booking/actions/get-services'

export default async (server: FastifyInstance) => {
  server.get('/services', {
    onRequest: [server.authenticate, server.isSeller],
    handler: async (req) =>
      await GetSellableServices.action({
        server,
        payload: { sellerId: req.user.id },
      }),
  })
}
