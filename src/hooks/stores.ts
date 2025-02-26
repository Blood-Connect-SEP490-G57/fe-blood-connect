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

// export const useUserStore = create<IndividualState>((set) => ({
//   totalPage: 0,
//   setTotalPage: (totalPage) => set(() => ({ totalPage }))
// }))

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

export const useBankReconcileSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useBankTransactionSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useFundTransferSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))

export const useTransactionSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  setSearchParams: (searchParams) => set(() => ({ searchParams }))
}))
// Add this interface and store
interface UserStore {
  username: string | null
  setUsername: (username: string | null) => void
  email: string | null
  setEmail: (email: string | null) => void
  CCCD: string | null
  setCCCD: (CCCD: string | null) => void
  Code: string | null
  setCode: (Code: string | null) => void
  dob: string | null
  setDob: (dob: string | null) => void
  gender: string | null
  setGender: (gender: string | null) => void
  address: string | null
  setAddress: (address: string | null) => void
  place: string | null
  setPlace: (place: string | null) => void
  job: string | null
  setJob: (job: string | null) => void
  phoneNumber: string | null
  setPhoneNumber: (phone: string | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
  email: null,
  setEmail: (email) => set({ email }),
  CCCD: null,
  setCCCD: (CCCD) => set({ CCCD }),
  Code: null,
  setCode: (Code) => set({ Code }),
  dob: null,
  setDob: (dob) => set({ dob }),
  gender: null,
  setGender: (gender) => set({ gender }),
  address: null,
  setAddress: (address) => set({ address }),
  place: null,
  setPlace: (place) => set({ place }),
  job: null,
  setJob: (job) => set({ job }),
  phoneNumber: null,
  setPhoneNumber: (phone) => set({ phoneNumber: phone })
}))
