import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";
import {
  serviceCategories,
  services,
} from "@/db/schema";

export async function getActiveServices() {
  return db
    .select({
      id: services.id,
      name: services.name,
      slug: services.slug,
      description: services.description,
      durationMinutes: services.durationMinutes,
      price: services.price,
      position: services.position,

      category: {
        id: serviceCategories.id,
        name: serviceCategories.name,
        slug: serviceCategories.slug,
      },
    })
    .from(services)
    .leftJoin(
      serviceCategories,
      eq(
        services.categoryId,
        serviceCategories.id,
      ),
    )
    .where(eq(services.active, true))
    .orderBy(
      asc(serviceCategories.position),
      asc(services.position),
      asc(services.name),
    );
}

export async function getServiceCategories() {
  return db
    .select({
      id: serviceCategories.id,
      name: serviceCategories.name,
      slug: serviceCategories.slug,
      position: serviceCategories.position,
    })
    .from(serviceCategories)
    .orderBy(asc(serviceCategories.position));
}

export type ServiceItem =
  Awaited<
    ReturnType<typeof getActiveServices>
  >[number];

export type ServiceCategoryItem =
  Awaited<
    ReturnType<typeof getServiceCategories>
  >[number];