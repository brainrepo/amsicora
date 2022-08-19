import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

// VALIDATION
export const requestSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
} as const

// TYPES
export type RequestType = FromSchema<typeof requestSchema>

// ACTION
export async function action({
  server,
  payload,
}: {
  server: FastifyInstance
  payload: RequestType
}) {
  const users = await server.prisma.user.findMany({
    where: { email: payload.email },
  })

  if (!users.length) {
    return server.httpErrors.unauthorized()
  }

  const [user, ..._] = users

  const isValid = await server.bcrypt.compare(payload.password, user.password)

  if (!isValid) {
    return server.httpErrors.unauthorized()
  }

  const { password, ...visibleUserInfo } = user

  const token = server.jwt.sign({ id: user.id, user: visibleUserInfo })
  return { token }
}
