import OpenAI from "openai";
import { JobContextSchema, type JobContext } from "@/types/jd";

export async function extractJobContext(input: { title: string; content: string }): Promise<JobContext> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `Extract structured context from this Vietnamese/English job description for ${input.title}. Do not invent anything. Return only seniority, skills, responsibilities, requirements, and keywords.\n\n${input.content}`,
    text: { format: { type: "json_schema", name: "job_context", strict: true, schema: { type: "object", additionalProperties: false, properties: { seniority: { type: "string" }, skills: { type: "array", items: { type: "string" }, maxItems: 30 }, responsibilities: { type: "array", items: { type: "string" }, maxItems: 30 }, requirements: { type: "array", items: { type: "string" }, maxItems: 30 }, keywords: { type: "array", items: { type: "string" }, maxItems: 30 } }, required: ["seniority", "skills", "responsibilities", "requirements", "keywords"] } } },
  });
  return JobContextSchema.parse(JSON.parse(response.output_text));
}