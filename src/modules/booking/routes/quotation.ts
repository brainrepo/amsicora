import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import shiftExist from '../invariants/shift-exist'
import variantsExist from '../invariants/variants-exist'
import resourcesRequestAreAvailable from '../invariants/resource-request-fullfillable'

const RequestSchema = {
  tags: ['booking'] as string[],
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
  response: {
    404: {
      message: {
        type: 'string',
        enum: ['SERVICE_NOT_FOUND', 'VARIANT_NOT_FOUND', 'SHIFT_NOT_FOUND'],
      },
    },
    default: {
      status: {
        type: 'boolean',
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            variantId: {
              type: 'string',
            },
            errorType: {
              type: 'string',
              enum: ['RESOURCE_AVAILABILITY_NOT_ENOUGH', 'PRICE_NOT_FOUND'],
            },
          },
        },
      },
    },
  },
} as const

//TODO: Define a schema for serializing the output
export default async (server: FastifyInstance) => {
  server.post<{
    Body: FromSchema<typeof RequestSchema.body>
    Params: FromSchema<typeof RequestSchema.params>
  }>('/services/:serviceID/quotation', {
    onRequest: [server.authenticate, server.isSeller],
    schema: RequestSchema,
    handler: async (req, res) => {
      const service = await server.booking.repository.service.getByIdIfSellable(
        req.params.serviceID,
        req.user.id,
      )

      const variantRepository = server.booking.repository.variant
      if (!service) return server.httpErrors.notFound('service not found')

      if (!variantsExist(service, req.body.variants)) {
        return server.httpErrors.notFound('variant not found')
      }

      if (!shiftExist(service, req.body.shift)) {
        return server.httpErrors.notFound('shift not found')
      }

      const variants =
        await variantRepository.getWithResourcesAndAmountsByIDsAndSeller(
          req.body.variants.map((e) => e.id),
          req.user.id,
          req.body.date,
          req.body.shift,
        )

      //TODO: move from invariant to procedure
      const availability = await resourcesRequestAreAvailable({
        request: {
          ...req.body,
          seller: { id: req.user.id },
          shift: req.body.shift,
          date: req.body.date,
        },
        variants,
      })

      if (availability?.errors && availability.errors?.length > 0) {
        return res.status(200).send(availability?.errors)
      }

      //TODO: Extract this code to a procedure
      console.log(variants.map((v) => JSON.stringify(v.prices)))
      if (!variants.every((v) => v.prices.length !== 0)) {
        return server.httpErrors.notFound('prices not found')
      }

      const costs: Record<string, number> = {}
      const fees: Record<string, number> = {}
      const total: Record<string, number> = {}

      console.log(variants.map((v) => v.prices))
      for (const reqVariant of req.body.variants) {
        const variant = variants.find((e) => e.id == reqVariant.id)
        //TODO: already verified in line 37 find way to manage type guards
        if (!variant) {
          return server.httpErrors.notFound('variant not found')
        }

        if (!variant.prices.length) {
          return server.httpErrors.notFound('price not found' + variant.id)
        }

        costs[variant.id] =
          Number(variant.prices[0].cost) * Number(reqVariant.amount)
        fees[variant.id] =
          Number(variant.prices[0].fee) * Number(reqVariant.amount)
        total[variant.id] = Number(costs[variant.id]) + fees[variant.id]
      }

      //TODO: Define a either data structure
      return { costs, fees, total }
    },
  })
}
