import { FastifyInstance } from 'fastify'
import ServiceRepository from './repository/service'
import ResourceRepository from './repository/resource'
import autoload from '@fastify/autoload'
import path from 'path'

declare module 'fastify' {
  interface FastifyInstance {
    booking: {
      repository: {
        service: ReturnType<typeof ServiceRepository>
        resource: ReturnType<typeof ResourceRepository>
      }
    }
  }
}

export default async (server: FastifyInstance) => {
  server.decorate('booking', {
    repository: {
      service: ServiceRepository(server.prisma),
      resource: ResourceRepository(server.prisma),
    },
  })

  server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })
}
