import { apiPostCall } from '..'
import { LoginType, RegisterType } from '@/schema/auth-schema'
import axios from 'axios'

export const refreshAccessToken = async () => {
  const response = await axios.get('/api/v1/auth/refresh-token', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
    }
  })
  return response.data
}

export const loginUser = async (data: LoginType) => {
  const response = await apiPostCall('/auth/login', {
    username: data.username,
    password: data.password
  })
  return response.data
}

export const registerUser = async (data: RegisterType) => {
  const response = await apiPostCall('/auth/register', {
    mobile: data.mobile,
    password: data.password
  })
  return response.data
}
