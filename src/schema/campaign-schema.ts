import { z } from 'zod';

export const CampaignResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  target_blood_units: z.number(),
  status: z.number(),
  created_at: z.array(z.number()), // Assuming the date is an array of numbers
  updated_at: z.array(z.number()), // Assuming the date is an array of numbers
});

export type CampaignResponse = z.infer<typeof CampaignResponseSchema>;
