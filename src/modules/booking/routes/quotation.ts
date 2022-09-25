import {
  BookingServiceNotFound,
  BookingShiftNotFound,
  BookingVariantNotFound,
  BOOKING_MALFORMED_REQUEST,
  BOOKING_NOT_AVAILABLE_RESOURCE,
  BOOKING_VARIANT_WITHOUT_PRICE,
  SERVICE_NOT_FOUND,
  SHIFT_NOT_FOUND,
  VARIANT_NOT_FOUND,
} from './../errors'
import { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import shiftExist from '../invariants/shift-exist'
import getNotValidVariants from '../invariants/get-not-valid-variants'
import getAvailabilityLockers from '../workflows/get-availability-lockers'
import getPrice from '../workflows/get-price'

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
      type: 'object',
      properties: {
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                enum: [SERVICE_NOT_FOUND, VARIANT_NOT_FOUND, SHIFT_NOT_FOUND],
              },
              serviceID: {
                type: 'string',
              },
              shiftID: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    200: {
      status: {
        type: 'boolean',
      },
      prices: {
        type: 'object',
        properties: {
          costs: {
            type: 'object',
            additionalProperties: true,
          },
          fees: {
            type: 'object',
            additionalProperties: true,
          },
          totals: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
      availabilityErrors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            variantID: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
            name: {
              type: 'string',
              enum: [BOOKING_MALFORMED_REQUEST, BOOKING_NOT_AVAILABLE_RESOURCE],
            },
          },
        },
      },
      priceErrors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            variantID: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
            name: {
              type: 'string',
              enum: [BOOKING_VARIANT_WITHOUT_PRICE],
            },
          },
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
    handler: async (req, res) => {
      const service = await server.booking.repository.service.getByIdIfSellable(
        req.params.serviceID,
        req.user.id,
      )

      const variantRepository = server.booking.repository.variant
      if (!service)
        return res.status(404).send({
          errors: [
            new BookingServiceNotFound(
              `The service '${req.params.serviceID}' is not found`,
              req.params.serviceID,
            ),
          ],
        })

      const notValidVariants = getNotValidVariants(req.body.variants, service)
      if (notValidVariants.length) {
        return res.status(404).send({
          errors: notValidVariants.map(
            (e) =>
              new BookingVariantNotFound(
                `The variant '${e}' is not found`,
                notValidVariants as string[],
              ),
          ),
        })
      }

      if (!shiftExist(service, req.body.shift)) {
        return res.status(404).send({
          errors: [
            new BookingShiftNotFound(
              `The shift '${req.body.shift}' is not found`,
              req.body.shift,
            ),
          ],
        })
      }

      const variants =
        await variantRepository.getWithResourcesAndAmountsByIDsAndSeller(
          req.body.variants.map((e) => e.id),
          req.user.id,
          req.body.date,
          req.body.shift,
        )

      const { errors: availabilityErrors } = await getAvailabilityLockers({
        request: {
          ...req.body,
          seller: { id: req.user.id },
        },
        variants,
      })

      const { prices, errors: priceErrors } = await getPrice({
        request: {
          ...req.body,
          seller: { id: req.user.id },
        },
        variants,
      })

      const status =
        !(priceErrors && priceErrors.length) &&
        !(availabilityErrors && availabilityErrors.length)

      return { status, prices, availabilityErrors, priceErrors }
    },
  })
}
