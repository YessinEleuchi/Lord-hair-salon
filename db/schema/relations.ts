import { relations } from "drizzle-orm";

import { serviceCategories, services } from "./services";
import { staff, staffServices } from "./staff";
import {
  workingHours,
  staffBreaks,
  timeOff,
  scheduleOverrides,
} from "./schedules";
import { customers } from "./customers";
import { appointments } from "./appointments";

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export const serviceCategoriesRelations = relations(
  serviceCategories,
  ({ many }) => ({
    services: many(services),
  }),
);

export const servicesRelations = relations(
  services,
  ({ one, many }) => ({
    category: one(serviceCategories, {
      fields: [services.categoryId],
      references: [serviceCategories.id],
    }),

    staffServices: many(staffServices),

    appointments: many(appointments),
  }),
);

// ─────────────────────────────────────────────
// STAFF
// ─────────────────────────────────────────────

export const staffRelations = relations(
  staff,
  ({ many }) => ({
    services: many(staffServices),

    workingHours: many(workingHours),

    breaks: many(staffBreaks),

    timeOff: many(timeOff),

    scheduleOverrides: many(scheduleOverrides),

    appointments: many(appointments),
  }),
);

// ─────────────────────────────────────────────
// STAFF ↔ SERVICES
// ─────────────────────────────────────────────

export const staffServicesRelations = relations(
  staffServices,
  ({ one }) => ({
    staff: one(staff, {
      fields: [staffServices.staffId],
      references: [staff.id],
    }),

    service: one(services, {
      fields: [staffServices.serviceId],
      references: [services.id],
    }),
  }),
);

// ─────────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────────

export const workingHoursRelations = relations(
  workingHours,
  ({ one }) => ({
    staff: one(staff, {
      fields: [workingHours.staffId],
      references: [staff.id],
    }),
  }),
);

export const staffBreaksRelations = relations(
  staffBreaks,
  ({ one }) => ({
    staff: one(staff, {
      fields: [staffBreaks.staffId],
      references: [staff.id],
    }),
  }),
);

export const timeOffRelations = relations(
  timeOff,
  ({ one }) => ({
    staff: one(staff, {
      fields: [timeOff.staffId],
      references: [staff.id],
    }),
  }),
);

export const scheduleOverridesRelations = relations(
  scheduleOverrides,
  ({ one }) => ({
    staff: one(staff, {
      fields: [scheduleOverrides.staffId],
      references: [staff.id],
    }),
  }),
);

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────

export const customersRelations = relations(
  customers,
  ({ many }) => ({
    appointments: many(appointments),
  }),
);

// ─────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────

export const appointmentsRelations = relations(
  appointments,
  ({ one }) => ({
    customer: one(customers, {
      fields: [appointments.customerId],
      references: [customers.id],
    }),

    staff: one(staff, {
      fields: [appointments.staffId],
      references: [staff.id],
    }),

    service: one(services, {
      fields: [appointments.serviceId],
      references: [services.id],
    }),
  }),
);