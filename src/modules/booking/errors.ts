const BOOKING_MALFORMED_REQUEST = 'BOOKING_MALFORMED_REQUEST'
const BOOKING_NOT_AVAILABLE_RESOURCE = 'BOOKING_NOT_AVAILABLE_RESOURCE'

export class BookingMalformedRequest extends Error {
  constructor(message: string) {
    super(message)
    this.name = BOOKING_MALFORMED_REQUEST
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
    this.name = BOOKING_MALFORMED_REQUEST
  }
}
