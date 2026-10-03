import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date invalide",
    ),

  time: z
    .string()
    .regex(
      /^\d{2}:\d{2}$/,
      "Heure invalide",
    ),

  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom est obligatoire")
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2, "Le nom est obligatoire")
    .max(50),

  phone: z
  .string()
  .trim()
  .min(
    8,
    "Le numéro de téléphone est obligatoire",
  )
  .max(
    30,
    "Numéro de téléphone invalide",
  ),
});

export type CreateBookingInput =
  z.infer<typeof createBookingSchema>;