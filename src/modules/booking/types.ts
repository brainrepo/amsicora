import {
  QuotationRequestSchema,
  FullfillableQuotationSchema,
  UnfullfillableQuotationSchema,
  FailedQuotationSchema,
} from './schemas'
import { Static } from '@sinclair/typebox'

type QuotationRequest = Static<typeof QuotationRequestSchema>
type FullfillableQuotation = Static<typeof FullfillableQuotationSchema>
type UnfullfillableQuotation = Static<typeof UnfullfillableQuotationSchema>
type FailedQuotation = Static<typeof FailedQuotationSchema>
type Context = {}

// WORKFLOWS
type makeQuotation = (
  quotationRequest: QuotationRequest,
  context: Context,
) => FullfillableQuotation | UnfullfillableQuotation | FailedQuotation
