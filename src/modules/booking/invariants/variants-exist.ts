export default function variantsExist(
  service: { variants: { id: string }[] },
  requestedVariants: { id: string }[],
) {
  const serviceVariantIDs = service.variants.map((v) => v.id)
  const requestedVariantIDs = requestedVariants.map((v) => v.id)
  return requestedVariantIDs.every((e) => serviceVariantIDs.includes(e))
}
