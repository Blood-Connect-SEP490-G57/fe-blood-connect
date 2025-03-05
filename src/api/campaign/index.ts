import { CampaignResponse } from '@/schema/campaign-schema'
import { apiGetCall } from '..'
import { BloodDonationSchema } from '@/schema/question-schema'
import { z } from 'zod'

export const Campaign = async (): Promise<CampaignResponse[]> => {
  const response = await apiGetCall('/api/campaigns', false)
  return response.data.data
}

export type BloodDonationType = z.infer<typeof BloodDonationSchema>;

export const Question = async (id: string): Promise<BloodDonationType> => {
  const response = await apiGetCall(`/questionset?id=${id}`, true);
  return response.data;
};