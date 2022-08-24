import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import shiftExist from '../invariants/shift-exist'
import variantsExist from '../invariants/variants-exist'
import resourcesRequestAreAvailable from '../invariants/resource-request-fullfillable'

const RequestSchema = {
  params: {
    type: 'object',
    properties: {
      serviceID: {
        type: 'string',
      },
    },
    required: ['serviceID'],
  },
  body: {
    type: 'object',
    required: ['variants', 'shift', 'date'],
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
          type: 'object',
          required: ['id', 'amount'],
          properties: {
            id: {
              type: 'string',
            },
            amount: {
              type: 'number',
            },
          },
          minItems: 1,
        },
      },
    },
  },
} as const

export default async (server: FastifyInstance) => {
  server.post<{
    Body: FromSchema<typeof RequestSchema.body>
    Params: FromSchema<typeof RequestSchema.params>
  }>('/services/:serviceID/quotation', {
    onRequest: [server.authenticate, server.isSeller],
    schema: RequestSchema,
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

      return await resourcesRequestAreAvailable({
        request: {
          ...req.body,
          seller: { id: req.user.id },
          shift: req.body.shift,
          date: req.body.date,
        },
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
