import ResourceRepository from '../repository/resource'

export default async function resourcesAvailable({
  request,
  resourceRepository,
}: {
  request: {
    shift: string
    variants: {
      id: string
      amount: number
    }[]
    date: string
  }
  resourceRepository: ReturnType<typeof ResourceRepository>
}) {
  const resources = await resourceRepository.getByVariantIDs(
    request.variants.map((e) => e.id),
  )

  for (const resource of resources) {
    // requested resource under limit

    console.log(resource.name, resource)
  }
}
