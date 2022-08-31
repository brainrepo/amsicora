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
server.register(swaggerPlugin, {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Amsicora api',
      description: 'Headless booking application',
      version: '0.1.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'auth', description: 'Auth related end-points' },
      { name: 'booking', description: 'Booking related end-points' },
      { name: 'user', description: 'User related end-points' },
    ],
  },
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
