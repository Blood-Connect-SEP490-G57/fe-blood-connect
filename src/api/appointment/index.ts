import axios from "axios"

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