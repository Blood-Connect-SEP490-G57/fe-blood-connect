import { z } from 'zod'

export const answerSchema = z.object({
  questionId: z.number(),
  answer: z.string(),
  detail: z.string()
})

export const apiAnswerSchema = z.object({
  questionId: z.number(),
  answer: z.string(),
  detail: z.string(),
  questionInfo: z.object({
    id: z.number(),
    content: z.string(),
    type: z.string(),
    order: z.number()
  })
})

export type AnswerType = z.infer<typeof answerSchema>
export type ApiAnswerType = z.infer<typeof apiAnswerSchema>
