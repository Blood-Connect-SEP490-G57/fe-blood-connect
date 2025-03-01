import * as z from 'zod'

export const ExtractSchema = z.object({
  id: z.string().optional(),
  userId: z.number().optional(),
  cardType: z.enum(['CCCD', 'CMND']),
  cardId: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CONFIRMED']),
  provinceId: z.number().optional(),
  districtId: z.number().optional(),
  wardId: z.string().optional()
})

export const UserCardSchema = z.object({
  id: z.number().optional(),
  extractId: z.string(),
  cardId: z.string(),
  name: z.string(),
  dob: z.string(), // LocalDate as string
  gender: z.string(),
  national: z.string(),
  ethnicity: z.string(),
  home: z.string(),
  address: z.string(),
  doe: z.string(), // LocalDate as string
  issueLoc: z.string(),
  issueDate: z.string(), // LocalDate as string
  features: z.string().optional(),
  data: z.string().optional(),
  scoreFront: z.number().optional(),
  scoreBack: z.number().optional(),
  images: z.string().optional(),
  inputSource: z.enum(['FRONT', 'BACK']),
  isActive: z.boolean().optional()
})

export type ExtractType = z.infer<typeof ExtractSchema>
export type UserCardType = z.infer<typeof UserCardSchema>
