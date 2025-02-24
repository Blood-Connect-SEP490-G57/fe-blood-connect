import axios from 'axios'
import { apiPostCall } from '..'
import { LoginType } from '@/schema/auth-schema'

export const refreshAccessToken = async () => {
  const response = await axios.get('/api/v1/auth/refresh-token', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
    }
  })
  return response.data
}

export const loginUser = async (data: LoginType) => {
  const response = await apiPostCall('/api/v1/auth/login', {
    username: data.phoneNumber,
    password: data.password
  })
  return response.data
}
