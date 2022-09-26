import { Static, Type } from '@sinclair/typebox'

// VALUE OBJECTS
export const VariantIDSchema = Type.String()
export const ServiceIDSchema = Type.String()
export const ShiftIDSchema = Type.String()

// ERRORS
export const NotEnoughAvailabilityError = Type.Object({
  variantId: VariantIDSchema,
  error: Type.Literal('NOT_ENOUGH_RESOURCES'),
})
export const PriceNotFoundError = Type.Object({
  variantId: VariantIDSchema,
  error: Type.Literal('PRICE_NOT_FOUND'),
})
export const ServiceNotFoundError = Type.Object({
  serviceID: ServiceIDSchema,
  error: Type.Literal('SERVICE_NOT_FOUND'),
})
export const VariantNotFoundError = Type.Object({
  variantID: VariantIDSchema,
  error: Type.Literal('VARIANT_NOT_FOUND'),
})
export const ShiftNotFoundError = Type.Object({
  variantID: VariantIDSchema,
  error: Type.Literal('SHIFT_NOT_FOUND'),
})

// INPUT
export const QuotationRequestSchema = Type.Object({
  amount: Type.Number(),
  date: Type.String({
    format: 'date-time',
  }),
  shiftID: Type.String(),
  serviceID: Type.String(),
  sellerID: Type.String(),
  variantRequests: Type.Array(
    Type.Object({
      id: Type.String(),
      amount: Type.Number(),
    }),
    {
      minItems: 1,
    },
  ),
})

// OUTPUT
export const BaseQuotationSchema = Type.Object({
  totalPrice: Type.Number(),
  totalCost: Type.Number(),
  totalFee: Type.Number(),
  partial: Type.Record(
    VariantIDSchema,
    Type.Object({
      price: Type.Number(),
      cost: Type.Number(),
      fee: Type.Number(),
      unitPrice: Type.Number(),
      unitCost: Type.Number(),
      unitFee: Type.Number(),
    }),
  ),
})
export const FullfillableQuotationSchema = Type.Intersect([
  Type.Object({
    status: Type.Literal('FULLFILLABLE'),
  }),
  BaseQuotationSchema,
])
export const UnfullfillableQuotationSchema = Type.Intersect([
  Type.Object({
    status: Type.Literal('UNFULFILLABLE'),
    errors: Type.Array(NotEnoughAvailabilityError),
  }),
  BaseQuotationSchema,
])
export const FailedQuotationSchema = Type.Object({
  status: Type.Literal('FAILED'),
  errors: Type.Array(
    Type.Union([
      PriceNotFoundError,
      ServiceNotFoundError,
      VariantNotFoundError,
      ShiftNotFoundError,
    ]),
  ),
})
