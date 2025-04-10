import { apiGetCall } from '..'

export const staticJobApi = async () => {
  const response = await apiGetCall('api/static/jobs')
  return response.data
}
