import { clsx, type ClassValue } from 'clsx'
import { useSearchParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useQueryString() {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

export const formatMoney = (value: any) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Số lượng số thập phân tối thiểu
    maximumFractionDigits: 0 // Số lượng số thập phân tối đa
  })

  return formatter.format(value)
}

export const getViewMenu = (value: string | number, menu: { code: string | number; title: string }[]) => {
  return menu.find((item) => item.code === value)?.title
}

export const getViewColor = (value: string, menu: { code: string; title: string; color?: string }[]) => {
  return menu.find((item) => item.code === value)?.color || 'black'
}

export const getFirstAndLastDayOfCurrentMonth = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    firstDay: formatDate(firstDay),
    lastDay: '2023-12-30'
  }
}

export const isScopeAllowed = (value: string) => {
  const roles = document.cookie.split('=')[1].split(',')

  return roles.includes(value)
}

export const capitalizeString = (str: string) => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}
export const valueFormatter = (number: number) => `${new Intl.NumberFormat('eu').format(number).toString()} đ`

export const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}
