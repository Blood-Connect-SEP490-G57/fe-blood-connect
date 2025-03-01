import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ExtractType, UserCardType } from '@/schema/extract-schema'

interface ExtractState {
  extractId: string
  cardDetails: UserCardType | null
  extractStatus: ExtractType | null
  isLoading: boolean
  error: string | null
}

interface ExtractActions {
  setExtractId: (id: string) => void
  setCardDetails: (details: UserCardType) => void
  setExtractStatus: (status: ExtractType) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: ExtractState = {
  extractId: '',
  cardDetails: null,
  extractStatus: null,
  isLoading: false,
  error: null
}

export const useExtractStore = create<ExtractState & ExtractActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setExtractId: (id) => set({ extractId: id }, false, 'extract/setId'),
      setCardDetails: (details) => set({ cardDetails: details }, false, 'extract/setDetails'),
      setExtractStatus: (status) => set({ extractStatus: status }, false, 'extract/setStatus'),
      setLoading: (loading) => set({ isLoading: loading }, false, 'extract/setLoading'),
      setError: (error) => set({ error }, false, 'extract/setError'),
      reset: () => set(initialState, false, 'extract/reset')
    }),
    {
      name: 'ExtractStore'
    }
  )
) 