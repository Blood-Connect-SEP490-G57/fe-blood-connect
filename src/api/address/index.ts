import { apiGetCall } from '..'


export interface District {
  name: string
  code: number
  codename: string
  division_type: string
  province_code: number
  wards: Ward[]
}

export interface Ward {
  name: string
  code: number
  codename: string
  division_type: string
  district_code: number
}

export const getDistricts = async (): Promise<District[]> => {
  try {
    const response = await apiGetCall('/address/districts')
    return response.data
  } catch (error) {
    console.error('Error fetching districts:', error)
    throw error
  }
}

export const getWardsByDistrictCode = async (districtCode: number): Promise<Ward[]> => {
  try {
    const response = await apiGetCall(`/address/wards/${districtCode}`)
    return response.data
  } catch (error) {
    console.error('Error fetching wards:', error)
    throw error
  }
}
