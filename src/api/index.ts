import axios from 'axios'
import { refreshAccessToken } from './auth'

// axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.baseURL = 'https://be-blood-connect-623385072086.asia-southeast1.run.app'
axios.defaults.baseURL = 'https://api.user.giotmauhyvong.org'

axios.defaults.headers.common['Content-Type'] = 'application/json'

export const axiosPrivate = axios.create({
  // baseURL: 'http://localhost:8080',
  // baseURL: 'https://be-blood-connect-623385072086.asia-southeast1.run.app',
  baseURL: 'https://api.user.giotmauhyvong.org',

  headers: {
    'Content-Type': 'application/json'
  }
})

axiosPrivate.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
    return config
  },
  (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const prevReq = error?.config
    if (error?.response?.status == 401 && !prevReq.sent) {
      prevReq.sent = true
      const newToken = await refreshAccessToken().then((res) => {
        return res.access_token
      })
      localStorage.setItem('access_token', newToken)
      prevReq.headers.Authorization = `Bearer ${newToken}`
      return axiosPrivate(prevReq)
    }
    return Promise.reject(error)
  }
)

export const apiPostCall = async (url: string, data?: unknown, isPrivate?: boolean) => {
  const response = isPrivate ? await axiosPrivate.post(url, data) : await axios.post(url, data)
  return response
}

export const apiPutCall = async (url: string, data?: unknown, isPrivate?: boolean) => {
  const response = isPrivate ? await axiosPrivate.put(url, data) : await axios.put(url, data)
  return response
}

export const apiDeleteCall = async (url: string, isPrivate?: boolean) => {
  const response = isPrivate ? await axiosPrivate.delete(url) : await axios.delete(url)
  return response
}

export const apiGetCall = async (url: string, isPrivate?: boolean) => {
  const response = isPrivate ? await axiosPrivate.get(url) : await axios.get(url)
  return response
}
