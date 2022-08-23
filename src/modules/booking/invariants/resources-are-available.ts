import VariantRepository from '../repository/variant'

export default async function resourcesAvailable({
  request,
  variantRepository,
}: {
  request: {
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
  variantRepository: ReturnType<typeof VariantRepository>
}) {
  const variants =
    await variantRepository.getWithResourcesAndAmountsByIDsAndSeller(
      request.variants.map((e) => e.id),
      request.seller.id,
      request.date,
      request.shift,
    )

  for (const variant of variants) {
    // requested resource under limit

    console.log(variant.name, variant)
  }

  return variants
}
