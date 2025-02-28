import { apiPostCall, apiGetCall } from '..'

export const extractFront = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', 'front')

  const response = await apiPostCall('/recognition-id', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const extractBack = async (file: File, extractId: string) => {
  const formData = new FormData()
  formData.append('type', 'back')
  formData.append('extract_id', extractId)
  formData.append('image', file)

  const response = await apiPostCall('/recognition-id', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const getExtractById = async (extractId: string) => {
  const response = await apiGetCall(`/extract/${extractId}`)
  return response.data
}

export const updateExtractStatus = async (extractStatusRequest: any) => {
  const response = await apiPostCall('/status', extractStatusRequest)
  return response.data
}
