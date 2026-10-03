import { asc } from "drizzle-orm";

import { db } from "@/db";
import {
  salonSettings,
  workingHours,
} from "@/db/schema";

export async function getPublicSalonInfo() {
  const [salon] = await db
    .select()
    .from(salonSettings)
    .limit(1);

  if (!salon) {
    return null;
  }

  const hours = await db
    .select()
    .from(workingHours)
    .orderBy(asc(workingHours.dayOfWeek));

  return {
    salon,
    workingHours: hours,
  };
}

export type PublicSalonInfo =
  Awaited<ReturnType<typeof getPublicSalonInfo>>;