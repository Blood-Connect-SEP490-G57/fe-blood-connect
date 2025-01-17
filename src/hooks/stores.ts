import { create } from 'zustand'

interface ShareState {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

interface IndividualState {
  totalPage: number
  setTotalPage: (totalPage: number) => void
}

interface DataTypeStore {
  dataType: string
  setDataType: (dataType: string) => void
}

interface SearchState {
  searchParams: any
  setSearchParams: (searchParams: any) => void
}

export const useUserAdminSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useFileSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useClientSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useUserLogSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useShareStore = create<ShareState>((set) => ({
  page: 1,
  limit: 10,
  totalPage: 0,
  setPage: (page) => set(() => ({ page })),
  setLimit: (limit) => set(() => ({ limit }))
}))

export const useUserStore = create<IndividualState>((set) => ({
  totalPage: 0,
  setTotalPage: (totalPage) => set(() => ({ totalPage }))
}))

export const useClientStore = create<IndividualState>((set) => ({
  totalPage: 0,
  setTotalPage: (totalPage) => set(() => ({ totalPage }))
}))

export const useTransactionStore = create<IndividualState>((set) => ({
  totalPage: 0,
  setTotalPage: (totalPage) => set(() => ({ totalPage }))
}))

export const useTranslogStore = create<IndividualState>((set) => ({
  totalPage: 0,
  setTotalPage: (totalPage) => set(() => ({ totalPage }))
}))

export const useFileStore = create<IndividualState>((set) => ({
  totalPage: 0,
  setTotalPage: (totalPage) => set(() => ({ totalPage }))
}))

export const useTypeStore = create<DataTypeStore>((set) => ({
  dataType: '/users',
  setDataType: (dataType) => set(() => ({ dataType }))
}))
