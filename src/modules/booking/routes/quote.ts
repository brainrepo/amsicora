import { FastifyInstance, FastifyRequest } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { stringify } from 'querystring'
import shiftExist from '../invariants/shift-exist'
import variantsExist from '../invariants/variants-exist'
import resourcesAreAvailable from '../invariants/resources-are-available'

const RequestSchema = {
  params: {
    type: 'object',
    properties: {
      serviceID: { type: 'string' },
    },
    required: ['serviceID'],
  },
  body: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        format: 'date-time',
      },
      shift: {
        type: 'string',
      },
      variants: {
        type: 'array',
        items: {
          id: 'string',
          amount: 'string',
        },
      },
    },
    required: ['date', 'shift', 'variants'],
  },
} as const

export default async (server: FastifyInstance) => {
  server.post<{
    Body: {
      date: string
      shift: string
      variants: { id: string; amount: number }[]
    }
    Params: FromSchema<typeof RequestSchema.params>
  }>('/services/:serviceID/quotes', {
    onRequest: [server.authenticate, server.isSeller],
    handler: async (req) => {
      const service = await server.booking.repository.service.getByIdIfSellable(
        req.params.serviceID,
        req.user.id,
      )

      if (!service) return server.httpErrors.notFound('service not found')

      if (!variantsExist(service, req.body.variants)) {
        return server.httpErrors.notFound('variant not found')
      }

      if (!shiftExist(service, req.body.shift)) {
        return server.httpErrors.notFound('shift not found')
      }

      return await resourcesAreAvailable({
        request: { ...req.body, seller: { id: req.user.id } },
        variantRepository: server.booking.repository.variant,
      })

      // iterate on variants
      // get resources
      // iterate on resources amount for the select shift and date
      // reduce from lockers
      // throw if no disp
      // --- return lockers
      // price calc

      // return { ...(req.body as object), ...req.params }
    },
  })
}
