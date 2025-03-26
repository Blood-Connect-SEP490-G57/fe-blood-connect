import { QuestionSet, Section } from '@/schema/question-schema'

export const getTotalQuestions = (questionSet: QuestionSet): number => {
  return questionSet.sections
    .filter(section => !section.hidden)
    .reduce((total, section) => total + section.questions.length, 0)
}

export const getAnsweredQuestions = (answers: Record<number, { value: string; description?: string }>): number => {
  return Object.values(answers).filter(answer => answer.value.trim() !== '').length
}

export const hasAllQuestionsAnswered = (answers: Record<number, { value: string; description?: string }>, totalQuestions: number): boolean => {
  const answeredCount = getAnsweredQuestions(answers)
  return answeredCount === totalQuestions && totalQuestions > 0
} 