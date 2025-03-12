import { z } from 'zod'

export const answerSchema = z.object({
  subQuestionId: z.number(),
  answerText: z.string(),
  description: z.string()
})

export type AnswerType = z.infer<typeof answerSchema>
