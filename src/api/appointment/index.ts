import axios from 'axios'

export const getCurrent = async (): Promise<any> => {
  const response = await axios.get('/api/appointments/current', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}

export const getHistory = async (): Promise<any> => {
  const response = await axios.get('/api/appointments/history', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  return response.data
}

export const updateinfor = async (payload: any): Promise<any> => {
  const response = await axios.put(
    '/api/appointments/user-info',
    {
      userId: payload.userId,
      email: payload.email,
      jobName: payload.jobName,
      studentId: payload.studentId,
      militaryId: payload.militaryId,
      addressContact: payload.addressContact,
      bloodGroup: payload.bloodGroup,
      organizationId: payload.organizationId
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }
  )
  return response.data
}
