import { CampaignResponse } from '@/schema/campaign-schema'
import { apiGetCall } from '..'
import { BloodDonationSchema } from '@/schema/question-schema'
import { z } from 'zod'
import axios from 'axios'
import { AnswerType } from '@/schema/answer-schema'

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

// Cập nhật hàm submitAnswers để nhận mảng AnswerType trực tiếp
export const submitAnswers = async (answerData: AnswerType[]): Promise<any> => {
  const response = await axios.post('/answer', answerData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}