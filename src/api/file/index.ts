/* eslint-disable prettier/prettier */
import axios, { AxiosError } from 'axios'
import { apiGetCall, apiPostCall } from '..'
import { FileExportType } from '@/schema/file-schema'
import { isScopeAllowed } from '@/lib/utils'

export const getFiles = async (page: number, limit: number, searchParams: any) => {
  const scope = 'file:read'
  let searchString = ''
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams) as any) {
      if (value) {
        searchString += `&${key}=${value}`
      }
    }
  }

  if (isScopeAllowed(scope)) {
    const response = await apiGetCall(`/file?page=${page}&limit=${limit}${searchString}`, true)
    return response.data
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}

export const exportBankTransExcel = async (data: FileExportType, page: number, limit: number, searchParams: any) => {
  const scope = 'bank-trans:excel'
  let searchString = ''
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams) as any) {
      if (value) {
        searchString += `&${key}=${value}`
      }
    }
  }

  if (isScopeAllowed(scope)) {
    const response = await apiPostCall(`/file/bank-trans/excel?page=${page}&limit=${limit}${searchString}`, data, true)
    return response.data
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}

export const exportFundTransferExcel = async (data: FileExportType, page: number, limit: number, searchParams: any) => {
  const scope = 'fun-transfer:excel'
  let searchString = ''
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams) as any) {
      if (value) {
        searchString += `&${key}=${value}`
      }
    }
  }

  if (isScopeAllowed(scope)) {
    const response = await apiPostCall(
      `/file/dim-fun-transfer/excel?page=${page}&limit=${limit}${searchString}`,
      data,
      true
      )
    return response.data
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}

export const exportBankReconcileExcel = async (data: FileExportType, page: number, limit: number, searchParams: any) => {
  const scope = 'bank-reconcile:excel'
  let searchString = ''
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams) as any) {
      if (value) {
        searchString += `&${key}=${value}`
      }
    }
  }

  if (isScopeAllowed(scope)) {
    const response = await apiPostCall(
      `/file/bank-reconcile/excel?page=${page}&limit=${limit}${searchString}`,
      data,
      true
    )
    return response.data
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}

export const exportTransactionExcel = async (data: FileExportType, page: number, limit: number, searchParams: any) => {
  const scope = 'dim-trans:excel'
  let searchString = ''
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams) as any) {
      if (value) {
        searchString += `&${key}=${value}`
      }
    }
  }

  if (isScopeAllowed(scope)) {
    const response = await apiPostCall(`/file/dim-trans/excel?page=${page}&limit=${limit}${searchString}`, data, true)
    return response.data
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}

export const downloadFile = async ({ id, data }: { id: string; data?: FileExportType }) => {
  const scope = 'file:download'

  if (isScopeAllowed(scope)) {
    const response = await axios.post(`/file/${id}/download`, data, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
  
    const downloadLink = window.document.createElement('a')
    downloadLink.href = window.URL.createObjectURL(response.data)
    downloadLink.setAttribute('download', 'FPTUPayTransactionReport.zip')
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } else {
    throw new AxiosError('Bạn không có quyền thực hiện chức năng này')
  }
}
