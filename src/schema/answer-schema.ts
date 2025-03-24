import { z } from 'zod'

export const answerSchema = z.object({
  subQuestionId: z.number(),
  answerText: z.string(),
  description: z.string()
})

export const apiAnswerSchema = z.object({
  id: z.number(),
  subQuestionId: z.number(),
  answerText: z.string(),
  description: z.string(),
  questionInfo: z.object({
    id: z.number(),
    content: z.string(),
    type: z.string(),
    order: z.number()
  }),
  subQuestionInfo: z.object({
    id: z.number(),
    content: z.string(),
    has_description: z.boolean()
  })
})

export type AnswerType = z.infer<typeof answerSchema>
export type ApiAnswerType = z.infer<typeof apiAnswerSchema>
