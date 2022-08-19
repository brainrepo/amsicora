import fastify, { FastifyInstance } from 'fastify'
import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import userModule from './modules/user'
import authModule from './modules/auth'
import sensiblePlugin from '@fastify/sensible'
import envPlugin from '@fastify/env'
import { configSchema } from './config'

const server: FastifyInstance = fastify({ logger: true })

server.register(envPlugin, { schema: configSchema })
server.register(sensiblePlugin)
server.register(prismaPlugin)
server.register(authPlugin)

server.register(userModule, { prefix: '/user' })
server.register(authModule, { prefix: '/auth' })

const start = async () => {
  try {
    await server.listen({ port: 3001 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
