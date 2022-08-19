import { FastifyInstance } from 'fastify'
import * as GetToken from '../../modules/auth/actions/get-token'

export default async (server: FastifyInstance) => {
  server.post<{ Body: GetToken.RequestType }>('/token', {
    schema: { body: GetToken.requestSchema },
    handler: async (req) =>
      await GetToken.action({ server, payload: req.body }),
  })
}
