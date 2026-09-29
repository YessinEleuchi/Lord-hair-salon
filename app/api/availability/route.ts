import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAvailableSlots } from "@/features/availability/engine/get-available-slots";

const availabilityQuerySchema = z.object({
  staffId: z.uuid(),
  serviceId: z.uuid(),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must use YYYY-MM-DD format",
    ),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const parsed = availabilityQuerySchema.safeParse({
      staffId: searchParams.get("staffId"),
      serviceId: searchParams.get("serviceId"),
      date: searchParams.get("date"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_QUERY",
          message: "Invalid availability query",
          issues: parsed.error.issues,
        },
        {
          status: 400,
        },
      );
    }

    const result = await getAvailableSlots({
      staffId: parsed.data.staffId,
      serviceId: parsed.data.serviceId,
      date: parsed.data.date,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "[GET /api/availability]",
      error,
    );

    if (error instanceof Error) {
      if (
        error.message === "Staff not found" ||
        error.message === "Service not found"
      ) {
        return NextResponse.json(
          {
            error: "NOT_FOUND",
            message: error.message,
          },
          {
            status: 404,
          },
        );
      }

      if (
        error.message ===
        "This service is not available for the selected staff member"
      ) {
        return NextResponse.json(
          {
            error: "SERVICE_NOT_AVAILABLE_FOR_STAFF",
            message: error.message,
          },
          {
            status: 400,
          },
        );
      }
    }

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message:
          "Unable to calculate availability",
      },
      {
        status: 500,
      },
    );
  }
}