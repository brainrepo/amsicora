import { FastifyInstance } from 'fastify'
import * as GetSellableServices from '../../modules/booking/actions/get-services'
import * as GetSellableService from '../../modules/booking/actions/get-service'

export default async (server: FastifyInstance) => {
  server.get('/services', {
    onRequest: [server.authenticate, server.isSeller],
    handler: async (req) =>
      await GetSellableServices.action({
        server,
        payload: { sellerID: req.user.id },
      }),
  })

  server.get<{
    Params: {
      serviceID: string
    }
  }>('/services/:serviceID', {
    onRequest: [server.authenticate, server.isSeller],
    schema: { params: GetSellableService.requestSchema },
    handler: async (req) =>
      await GetSellableService.action({
        server,
        payload: { sellerID: req.user.id, serviceID: req.params.serviceID },
      }),
  })
}
