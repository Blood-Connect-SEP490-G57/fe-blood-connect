import { CampaignResponse } from '@/schema/campaign-schema'
import { apiGetCall } from '..'
import { BloodDonationSchema } from '@/schema/question-schema'
import { z } from 'zod'
import axios from 'axios'

export const Campaign = async (): Promise<CampaignResponse[]> => {
  const response = await apiGetCall('/api/campaigns', false)
  return response.data.data
}

export const GetCampaignById = async (id: string): Promise<CampaignResponse> => {
  const response = await apiGetCall(`/api/campaigns?id=${id}`, false)
  return response.data.data
}

export type BloodDonationType = z.infer<typeof BloodDonationSchema>

export const Question = async (id: string): Promise<BloodDonationType> => {
  const response = await apiGetCall(`/questionset?id=${id}`, true)
  return response.data
}

export interface AnswerSubmission {
  campaign_id: number
  question_set_id: number
  answer: Record<number, string>
}

export const submitAnswers = async (data: AnswerSubmission): Promise<any> => {
  const response = await axios.post('/answer', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}
