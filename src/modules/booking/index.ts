import { FastifyInstance } from 'fastify'
import ServiceRepository from './repository/service'
import VariantRepository from './repository/variant'
import autoload from '@fastify/autoload'
import path from 'path'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    booking: {
      repository: {
        service: ReturnType<typeof ServiceRepository>
        variant: ReturnType<typeof VariantRepository>
      }
    }
  }
}
export default async (server: FastifyInstance) => {
  server.decorate('booking', {
    repository: {
      service: ServiceRepository(server.prisma),
      variant: VariantRepository(server.prisma),
    },
  })

  server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  })
}
