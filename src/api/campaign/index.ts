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

// Định nghĩa interface cho payload gửi đi
export interface AnswerPayload {
  answers: AnswerType[]
  campaignId: number
}

// Cập nhật hàm submitAnswers để nhận đúng cấu trúc payload
export const submitAnswers = async (payload: AnswerPayload): Promise<any> => {
  const response = await axios.post('/answer', payload, {
    headers: {
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}

// Thêm interface cho response của API get answer
interface AnswerApiResponse {
  success: boolean
  data: {
    campaignInfo: {
      id: number
      name: string
      location: string
      startReceiveTime: string
      endReceiveTime: string
      organizeTime: string
      description: string
      targetBloodUnits: number
      officialDocumentUrl: string
      // và các trường khác
    }
    answers: Array<{
      id: number
      subQuestionId: number
      answerText: string
      description: string
      questionInfo: {
        id: number
        content: string
        type: string
        order: number
      }
      subQuestionInfo: {
        id: number
        content: string
        has_description: boolean
      }
    }>
  }
}

// Function để lấy thông tin câu trả lời cho một campaign
export const getAnswersByCampaignId = async (campaignId: number): Promise<AnswerApiResponse> => {
  const response = await axios.get(`/answer/${campaignId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data.data
}

export const history = async (): Promise<any> => {
  const response = await axios.get('/api/appointments/history', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}

export const cancelAppointment = async (id: string): Promise<any> => {
  const response = await axios.delete(`/answer/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}

export const ValidRegisterDonate = async (): Promise<any> => {
  const response = await axios.get('/api/campaigns/validationregister', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}
