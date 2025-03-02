import { CampaignResponse } from "@/schema/campaign-schema"
import { apiGetCall } from ".."

export const Campaign = async (): Promise<CampaignResponse[]> => {
  const response = await apiGetCall('/api/campaigns', true)
  return response.data.data
} 