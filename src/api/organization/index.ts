import { apiGetCall } from '..'

export interface Organization {
  id: number
  name: string
  type: number
  address: string
  phone: string
}

export const getOrganizationsByType = async () => {
  const response = await apiGetCall('/api/organization/by-type/other')
  return response.data
}
