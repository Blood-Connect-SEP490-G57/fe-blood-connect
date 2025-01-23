import { z } from 'zod'

export const FileSchema = z.object({
  id: z.string(),
  file_name: z.string(),
  description: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export const FileExportSchema = z.object({
  created_at_from: z.string(),
  created_at_to: z.string()
})

export type FileType = z.infer<typeof FileSchema>
export type FileExportType = z.infer<typeof FileExportSchema>
