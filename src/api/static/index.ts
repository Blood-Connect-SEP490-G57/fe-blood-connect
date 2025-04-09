import { apiGetCall } from '..'

export const staticApi = async () => {
  const response = await apiGetCall('api/static/jobs')
  return response.data
}
