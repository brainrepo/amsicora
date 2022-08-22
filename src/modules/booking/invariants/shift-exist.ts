import { Service } from '@prisma/client'

export default function shiftExist(
  service: { shifts: { id: string }[] },
  requestedShift: string,
) {
  const serviceShifts = service.shifts.map((v) => v.id)
  return serviceShifts.includes(requestedShift)
}
