import { apiGetCall, apiPostCall } from '..'
import { UserFullInfoResponse, UserDetailResponse, UserDetailType } from '@/schema/user-schema'

export const User = async (): Promise<UserFullInfoResponse> => {
  const response = await apiGetCall('/api/users/full-info', true)
  return response.data.data
}

export const getCurrentUserDetail = async () => {
  const response = await apiGetCall('/user/detail')
  return response.data as UserDetailResponse
}

export const createOrUpdateUserDetail = async (request: UserDetailType) => {
  const response = await apiPostCall('/user/create-detail', {
    email: request.email,
    job_name: request.job_name,
    student_id: request.student_id,
    military_id: request.military_id,
    address_contact: request.address_contact,
    time_donation: request.time_donation,
    blood_group: request.blood_group
  })
  return response.data
}
