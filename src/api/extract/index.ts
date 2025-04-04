import { apiPostCall, apiGetCall } from '..'
import axios from 'axios'

export const extractFront = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', 'front')

  try {
    const response = await axios.post('/recognition-id', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data // Return the error response directly
    }
    throw error // Re-throw if it's not an API error response
  }
}

export const extractBack = async (file: File, extractId: string) => {
  const formData = new FormData()
  formData.append('type', 'back')
  formData.append('extract_id', extractId)
  formData.append('image', file)

  try {
    const response = await axios.post('/recognition-id', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data // Return the error response directly
    }
    throw error // Re-throw if it's not an API error response
  }
}

export const getExtractById = async (extractId: string) => {
  const response = await apiGetCall(`/extract/${extractId}`)
  return response.data
}

export const updateExtractStatus = async (extract_id: string, extract_status: string) => {
  const response = await apiPostCall('/status', { extract_id, extract_status })
  return response.data
}

export const CheckExtractStatus = async () => {
  const response = await axios.get('/api/users/user-status', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}
