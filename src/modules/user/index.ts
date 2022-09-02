import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import UserRepository from './repository/user'

declare module 'fastify' {
  interface FastifyInstance {
    user: {
      repository: {
        user: ReturnType<typeof UserRepository>
      }
    }
  }
}

export default async (server: FastifyInstance) => {
  server.decorate('user', {
    repository: {
      user: UserRepository(server.prisma),
    },
  })

  const registerRequestSchema = {
    tags: ['user'] as string[],
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['name', 'email', 'password'],
    },
  } as const

  server.post<{ Body: FromSchema<typeof registerRequestSchema.body> }>(
    '/register',
    {
      schema: registerRequestSchema,
      handler: async (req) => {
        const { name, email } = await server.user.repository.user.create({
          ...req.body,
          id: randomUUID(),
          password: await server.bcrypt.hash(req.body.password),
        })
        return { name, email }
      },
    },
  )
}
