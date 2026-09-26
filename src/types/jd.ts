import { z } from "zod";

export const JobContextSchema = z.object({
  seniority: z.string().min(1),
  skills: z.array(z.string().min(1)).max(30),
  responsibilities: z.array(z.string().min(1)).max(30),
  requirements: z.array(z.string().min(1)).max(30),
  keywords: z.array(z.string().min(1)).max(30),
});

export type JobContext = z.infer<typeof JobContextSchema>;