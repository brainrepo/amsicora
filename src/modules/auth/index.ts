import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import UserRepository from './repository/user'
declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      repository: {
        user: ReturnType<typeof UserRepository>
      }
    }
  }
}

export default async (server: FastifyInstance) => {
  server.decorate('auth', {
    repository: {
      user: UserRepository(server.prisma),
    },
  })

  server.post<{ Body: { email: string; password: string } }>('/token', {
    schema: {
      tags: ['auth'] as string[],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
    },
    handler: async (req) => {
      const users = await server.auth.repository.user.userByEmail(
        req.body.email,
      )

      if (!users.length) {
        return server.httpErrors.unauthorized()
      }

      const [user, ..._] = users

      const isValid = await server.bcrypt.compare(
        req.body.password,
        user.password,
      )

      if (!isValid) {
        return server.httpErrors.unauthorized()
      }

      const { password, ...visibleUserInfo } = user

      const token = server.jwt.sign({ id: user.id, user: visibleUserInfo })
      return { token }
    },
  })
}
