import type { PrismaClient, User } from '@prisma/client'
import ServiceRepository from './src/modules/booking/repository/service'
import UserRepository from './src/modules/user/repository/user'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; user: Partial<User> }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
    isSeller: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    bcrypt: {
      hash: (pwd: string) => Promise<string>
      compare: (data: string, hash: string) => Promise<boolean>
    }
    prisma: PrismaClient
    config: {
      JWT_SECRET: string
    }
  }
}
