import { z } from 'zod';

export const CampaignResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  startReceiveTime: z.string().datetime(),
  endReceiveTime: z.string().datetime(),
  organizeTime: z.string().datetime(),
  officialDocumentUrl: z.string(),
  targetBloodUnits: z.number(),
  bloodGroup: z.number(),
  status: z.number(),
  organizationHoldId: z.number(),
  bloodReceiveOrganizationId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CampaignResponse = z.infer<typeof CampaignResponseSchema>;
