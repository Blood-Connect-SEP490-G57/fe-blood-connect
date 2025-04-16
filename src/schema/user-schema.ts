import { z } from 'zod'

export const UserFullInfoResponseSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  enable: z.boolean(),
  status: z.number(),
  organization_id: z.number(),
  organization_name: z.string(),

  // User Detail info
  job_name: z.string(),
  student_id: z.string().optional(),
  military_id: z.string().optional(),
  address_contact: z.string(),
  time_donation: z.number(),
  blood_group: z.string(),

  // Extract info
  extract_id: z.string(),
  is_active: z.boolean(),
  extract_status: z.string(),

  // User Card info
  card_id: z.string(),
  full_name: z.string(),
  dob: z.string(), // Date should be in ISO format
  gender: z.string(),
  national: z.string(),
  ethnicity: z.string(),
  home: z.string(),
  address: z.string(),
  doe: z.string(),
  issue_loc: z.string(),
  issue_date: z.string()
})

export type UserFullInfoResponse = z.infer<typeof UserFullInfoResponseSchema>

export const userDetailSchema = z.object({
  email: z.string().email('Email không hợp lệ').optional(),
  mobile: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số').max(11, 'Số điện thoại không quá 11 số').optional(),
  job_name: z.string().min(1, 'Vui lòng chọn nghề nghiệp').optional(),
  student_id: z.string().optional(),
  military_id: z.string().optional(),
  address_contact: z.string().min(1, 'Vui lòng nhập địa chỉ liên hệ').optional(),
  time_donation: z.number().min(0, 'Số lần hiến máu không hợp lệ').optional(),
  blood_group: z.string().min(1, 'Vui lòng chọn nhóm máu').optional(),
  organization_id: z.number().min(1, 'Vui lòng chọn tổ chức').optional(),
  organization_name: z.string().optional()
})

export type UserDetailType = z.infer<typeof userDetailSchema>

export interface UserDetailResponse {
  success: boolean
  data: {
    mobile: string
    email: string
    job_name: string
    student_id: string
    military_id: string
    address_contact: string
    time_donation: number
    blood_group: string
    organization_id: number
  }
}
