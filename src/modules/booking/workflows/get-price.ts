import { BookingVariantWithoutPrice } from './../errors'
import VariantRepository from '../repository/variant'
interface Request {
  shift: string
  variants: {
    id: string
    amount: number
  }[]
  date: string
  seller: {
    id: string
  }
}

interface QuotationPrice {
  costs: Record<string, number>
  fees: Record<string, number>
  totals: Record<string, number>
}
interface Response {
  prices?: QuotationPrice
  errors?: Array<BookingVariantWithoutPrice>
}

type VariantsWithPrices = Awaited<
  ReturnType<
    Awaited<
      ReturnType<
        Awaited<typeof VariantRepository>
      >['getWithResourcesAndAmountsByIDsAndSeller']
    >
  >
>

export default async function getPrice({
  request,
  variants,
}: {
  request: Request
  variants: VariantsWithPrices
}): Promise<Response> {
  //variants withou prices
  const variantsWithoutPrice = variants.filter((v) => v.prices.length === 0)

  if (variantsWithoutPrice.length) {
    return {
      errors: [
        ...variantsWithoutPrice.map(
          (v) =>
            new BookingVariantWithoutPrice(
              'Some variants have no price configured',
              v.id,
            ),
        ),
      ],
    }
  }

  const costs: Record<string, number> = {}
  const fees: Record<string, number> = {}
  const totals: Record<string, number> = {}

  for (const reqVariant of request.variants) {
    const variant = variants.find(
      (e) => e.id == reqVariant.id,
    ) as VariantsWithPrices[number]

    costs[variant.id] =
      Number(variant.prices[0].cost) * Number(reqVariant.amount)
    fees[variant.id] = Number(variant.prices[0].fee) * Number(reqVariant.amount)
    totals[variant.id] = Number(costs[variant.id]) + fees[variant.id]
  }

  return { prices: { costs, fees, totals }, errors: [] }
}
