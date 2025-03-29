import { apiPostCall, axiosPrivate } from '..'
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

export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  const response = await axiosPrivate.put('/auth/change-password', data)
  return response.data
}

export const forgotPassword = async (phoneNumber: string) => {
  const response = await apiPostCall('/auth/forgot-password', {
    mobile: phoneNumber
  })
  return response.data
}
