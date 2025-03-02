import { apiGetCall } from '..'
import { UserFullInfoResponse } from '@/schema/user-schema'

export const User = async (): Promise<UserFullInfoResponse> => {
  const response = await apiGetCall('/api/users/full-info', true)
  return response.data.data
}
