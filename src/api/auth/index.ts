import axios from 'axios'
import { apiPostCall } from '..'
import { LoginType } from '@/schema/auth-schema'

const HOST = import.meta.env.VITE_API_HOST 

export const refreshAccessToken = async () => {
  const response = await axios.get(`${HOST}/api/v1/auth/refresh-token`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
    }
  })
  return response.data
}

export const loginUser = async (data: LoginType) => {
  const response = await apiPostCall(`${HOST}/api/v1/auth/login`, {
    username: data.phoneNumber,
    password: data.password
  })
  return response.data
}
