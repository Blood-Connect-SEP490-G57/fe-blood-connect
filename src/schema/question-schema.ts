import { z } from 'zod'

const QuestionSchema = z.object({
  id: z.number(),
  sectionId: z.number(),
  content: z.string(),
  order: z.number(),
  hasDetail: z.boolean()
})

const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  questionSetId: z.number(),
  hidden: z.boolean(),
  questions: z.array(QuestionSchema)
})

const QuestionSetSchema = z.object({
  id: z.number(),
  name: z.string(),
  createTimestamp: z.string().datetime(),
  updatedTimestamp: z.string().datetime(),
  sections: z.array(SectionSchema)
})

const BloodDonationSchema = z.object({
  success: z.boolean(),
  data: QuestionSetSchema
})

export type QuestionSet = z.infer<typeof QuestionSetSchema>
export type Section = z.infer<typeof SectionSchema>
export type Question = z.infer<typeof QuestionSchema>
export { BloodDonationSchema }
