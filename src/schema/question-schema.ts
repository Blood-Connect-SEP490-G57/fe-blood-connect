import { z } from "zod";

const QuestionSchema = z.object({
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
  content: z.string(),
  order: z.number(),
});

const BloodDonationSchema = z.object({
  success: z.boolean(),
  data: z.object({
    name: z.string(),
    create_timestamp: z.string().datetime(),
    updated_timestamp: z.string().datetime(),
    questions: z.array(QuestionSchema),
  }),
});


export { BloodDonationSchema };
