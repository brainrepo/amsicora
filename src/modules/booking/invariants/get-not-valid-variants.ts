export default function getNotValidVariants(
  requestedVariants: { id: string }[],
  service: { variants: { id: string }[] },
) {
  const serviceVariantIDs = service.variants.map((v) => v.id)
  const requestedVariantIDs = requestedVariants.map((v) => v.id)

  return requestedVariantIDs.filter((rv) => !serviceVariantIDs.includes(rv))
}
