import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  staff,
  staffServices,
} from "@/db/schema";

export async function getActiveStaffWithServices() {
  const rows = await db
    .select({
      id: staff.id,
      name: staff.name,
      slug: staff.slug,
      bio: staff.bio,
      avatarUrl: staff.avatarUrl,
      position: staff.position,

      serviceId: staffServices.serviceId,
    })
    .from(staff)
    .innerJoin(
      staffServices,
      eq(staffServices.staffId, staff.id),
    )
    .where(eq(staff.active, true))
    .orderBy(asc(staff.position));

  const staffMap = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      bio: string | null;
      avatarUrl: string | null;
      position: number;
      serviceIds: string[];
    }
  >();

  for (const row of rows) {
    const existing = staffMap.get(row.id);

    if (existing) {
      existing.serviceIds.push(row.serviceId);
      continue;
    }

    staffMap.set(row.id, {
      id: row.id,
      name: row.name,
      slug: row.slug,
      bio: row.bio,
      avatarUrl: row.avatarUrl,
      position: row.position,
      serviceIds: [row.serviceId],
    });
  }

  return Array.from(staffMap.values());
}

export type StaffItem =
  Awaited<
    ReturnType<typeof getActiveStaffWithServices>
  >[number];