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

interface CardData {
  front: {
    id: string
    name: string
    dob: string
    sex: string
    nationality: string
    home: string
    address: string
    doe: string
    address_entities: {
      province: string
      district: string
      ward: string
      street: string
    }
  }
  back: {
    features: string
    issue_date: string
    issue_loc: string
    mrz_details: {
      name: string
      doe: string
      dob: string
      nationality: string
      sex: string
    }
  }
}

interface ExtractResponse {
  id: number
  extract_id: string
  card_type: string
  extract_status: string
  card_id: string
  name: string
  dob: string
  gender: string
  national: string
  home: string
  address: string
  doe: string
  issue_loc: string
  issue_date: string
  features: string
  data: CardData
  score_front: number
  score_back: number
  input_source: string
  is_active: boolean
  card_images: {
    front: string
    back: string
  }
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