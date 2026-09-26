import { z } from "zod";

const skillScore = z.number().min(0).max(10);

export const FeedbackSchema = z.object({
  score: skillScore,
  strengths: z.array(z.string().min(1)).max(5),
  weaknesses: z.array(z.string().min(1)).max(5),
  suggestions: z.array(z.string().min(1)).max(5),
  better_answer: z.string().min(1).max(10000),
  skills: z.object({
    clarity: skillScore,
    structure: skillScore,
    confidence: skillScore,
    communication: skillScore,
    technical_knowledge: skillScore,
    problem_solving: skillScore,
    leadership: skillScore,
  }),
});

export type Feedback = z.infer<typeof FeedbackSchema>;