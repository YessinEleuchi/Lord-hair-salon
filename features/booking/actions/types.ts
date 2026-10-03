export type CreateBookingResult =
  | {
      success: true;
      appointmentId: string;
      status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"| "NO_SHOW";
    }
  | {
      success: false;
      code:
        | "VALIDATION_ERROR"
        | "SLOT_UNAVAILABLE"
        | "BOOKING_DISABLED"
        | "DATABASE_CONFLICT"
        | "UNKNOWN_ERROR";
      message: string;
    };