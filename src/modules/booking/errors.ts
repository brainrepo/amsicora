export const BOOKING_MALFORMED_REQUEST = 'BOOKING_MALFORMED_REQUEST'
export const BOOKING_NOT_AVAILABLE_RESOURCE = 'BOOKING_NOT_AVAILABLE_RESOURCE'
export const BOOKING_VARIANT_WITHOUT_PRICE = 'BOOKING_VARIANT_WITHOUT_PRICE'
export const SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND'
export const VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND'
export const SHIFT_NOT_FOUND = 'SHIFT_NOT_FOUND'

export class BookingServiceNotFound extends Error {
  constructor(message: string, public serviceID: string) {
    super(message)
    this.name = SERVICE_NOT_FOUND
  }
}

export class BookingVariantNotFound extends Error {
  constructor(message: string, public variantsIDs: string[]) {
    super(message)
    this.name = VARIANT_NOT_FOUND
  }
}

export class BookingShiftNotFound extends Error {
  constructor(message: string, public shiftID: string) {
    super(message)
    this.name = SHIFT_NOT_FOUND
  }
}

export class BookingMalformedRequest extends Error {
  constructor(message: string) {
    super(message)
    this.name = BOOKING_MALFORMED_REQUEST
  }
}

export class BookingVariantWithoutPrice extends Error {
  constructor(message: string, public variantID: string) {
    super(message)
    this.name = BOOKING_VARIANT_WITHOUT_PRICE
  }
}

export class BookingNotAvailableResource extends Error {
  constructor(
    public message: string,
    public variantID: string,
    public resourceID: string,
    public residualAmount: number,
  ) {
    super(message)
    this.name = BOOKING_NOT_AVAILABLE_RESOURCE
  }
}
