import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

// VALIDATION
export const requestSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['name', 'email', 'password'],
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
  const { name, email } = await server.prisma.user.create({
    data: {
      ...payload,
      id: randomUUID(),
      password: await server.bcrypt.hash(payload.password),
    },
  })
  return { name, email }
}
