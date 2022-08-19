import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import user from '../modules/user'

const USER_ROLES = {
  SELLER: 'SELLER',
  SUPPLIER: 'SUPPLIER',
  CUSTOMER: 'CUSTOMER',
} as const

const authPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.decorate(
    'isSeller',
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (
        request.user.user.role !== USER_ROLES.SELLER &&
        request.user.user.role !== USER_ROLES.SUPPLIER
      ) {
        reply.unauthorized('No rights to see this area')
      }
    },
  )
})

export default authPlugin
