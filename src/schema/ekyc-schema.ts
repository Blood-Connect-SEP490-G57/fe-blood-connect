import { z } from 'zod'

export const EkycCardImgSchema = z.object({
  front: z.string(),
  back: z.string()
})

export const EkycFaceImgSchema = z.object({
  image: z.string()
})

export const EkycSchema = z.object({
  id: z.string(),
  ekyc_id: z.string(),
  card_type: z.string(),
  user_ekyc_status: z.number(),
  ekyc_status: z.string(),
  card_id: z.string(),
  name: z.string(),
  dob: z.string(),
  gender: z.string(),
  national: z.string(),
  home: z.string(),
  address: z.string(),
  doe: z.string(),
  issue_loc: z.string(),
  issue_date: z.string(),
  features: z.string()
})

export type EkycType = z.infer<typeof EkycSchema>
export type EkycCardImgType = z.infer<typeof EkycCardImgSchema>
export type EkycFaceImgType = z.infer<typeof EkycFaceImgSchema>
