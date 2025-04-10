import axios from 'axios'


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

export interface Province {
  name: string
  code: number
  codename: string
  division_type: string
  districts: District[]
}

export const getDistricts = async (): Promise<District[]> => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/d/')
    return response.data
  } catch (error) {
    console.error('Error fetching districts:', error)
    throw error
  }
}

export const getListProvinces = async (): Promise<Province[]> => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/p/')
    return response.data
  } catch (error) {
    console.error('Error fetching districts:', error)
    throw error
  }
}

export const getWards = async (): Promise<Ward[]> => {
  try {
    const response = await axios.get('https://provinces.open-api.vn/api/w/')
    return response.data
  } catch (error) {
    console.error('Error fetching wards:', error)
    throw error
  }
}

