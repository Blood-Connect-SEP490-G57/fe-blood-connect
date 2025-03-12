import { apiGetCall } from '..'
import { UserFullInfoResponse, UserDetailResponse, UserDetailType } from '@/schema/user-schema'
import axios from 'axios'

export const User = async (): Promise<UserFullInfoResponse> => {
  const response = await apiGetCall('/api/users/full-info', true)
  return response.data.data
}

export const getCurrentUserDetail = async () => {
  const response = await axios.get('/api/users/detail', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data as UserDetailResponse
}

export const createOrUpdateUserDetail = async (request: UserDetailType) => {
  const response = await axios.post(
    '/api/users/create-detail',
    {
      email: request.email,
      job_name: request.job_name,
      student_id: request.student_id,
      military_id: request.military_id,
      address_contact: request.address_contact,
      time_donation: request.time_donation,
      blood_group: request.blood_group,
      organization_id: request.organization_id
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }
  )
  return response.data
}
