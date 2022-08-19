import { FastifyInstance } from 'fastify'
import * as GetToken from '../../modules/auth/actions/get-token'
import * as Register from '../../modules/user/actions/register'

export default async (server: FastifyInstance) => {
  server.post<{ Body: Register.RequestType }>('/register', {
    schema: { body: Register.requestSchema },
    handler: async (req) => Register.action({ server, payload: req.body }),
  })
}
