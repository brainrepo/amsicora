import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import jwtPlugin from '@fastify/jwt'
import bcryptPlugin from 'fastify-bcrypt'

const authPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.register(bcryptPlugin, {
    saltWorkFactor: 12,
  })
  server.register(jwtPlugin, {
    secret: server.config.JWT_SECRET,
  })

  server.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        const services = await server.prisma.user.findMany()
        console.log(services)
      } catch (err) {
        reply.send(err)
      }
    },
  )
})

export default authPlugin
