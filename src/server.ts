import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import authzPlugin from './plugins/authz'
import userModule from './modules/user'
import authModule from './modules/auth'
import bookingModule from './modules/booking'
import sensiblePlugin from '@fastify/sensible'
import swaggerPlugin from '@fastify/swagger'
import envPlugin from '@fastify/env'
import { configSchema } from './config'

const server: FastifyInstance = fastify({ logger: true })

server.register(envPlugin, { schema: configSchema })
server.register(sensiblePlugin)
server.register(prismaPlugin)
server.register(authPlugin)
server.register(authzPlugin)

server.register(userModule, {
  prefix: '/user',
})
server.register(authModule, { prefix: '/auth' })
server.register(bookingModule, { prefix: '/booking' })

const start = async () => {
  try {
    await server.listen({ port: 3001 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
