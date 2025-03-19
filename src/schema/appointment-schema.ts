import { z } from "zod";

export const appointmentSchema = z.object({
  id: z.number(),
  location: z.string(),
  status: z.string(),
  campaignId: z.number(),
  campaignName: z.string(),
  appointmentDate: z.string(),
  createdAt: z.string(),
})

export type AppointmentType = z.infer<typeof appointmentSchema>