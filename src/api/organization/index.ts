import { apiGetCall } from '..'

export interface Organization {
  id: number
  name: string
  type: number
  address: string
  phone: string
}

export const getOrganizationsByType = async (type: number) => {
  const response = await apiGetCall(`/organizations/by-type/${type}`)
  return response.data
} 