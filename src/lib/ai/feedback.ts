import OpenAI from "openai";
import { FeedbackSchema, type Feedback } from "@/types/feedback";

export async function generateFeedback(input: { jobTitle: string; answer: string }): Promise<Feedback> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `Bạn là chuyên gia feedback phỏng vấn bằng tiếng Việt. Đánh giá câu trả lời cho vị trí ${input.jobTitle}. Chỉ trả về JSON hợp lệ theo schema: score 0-10, strengths, weaknesses, suggestions, better_answer và skills gồm clarity, structure, confidence, communication, technical_knowledge, problem_solving, leadership đều 0-10. Không bịa kinh nghiệm của ứng viên.\n\nCâu trả lời:\n${input.answer}`,
    text: {
      format: {
        type: "json_schema",
        name: "interview_feedback",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            score: { type: "number", minimum: 0, maximum: 10 },
            strengths: { type: "array", items: { type: "string" }, maxItems: 5 },
            weaknesses: { type: "array", items: { type: "string" }, maxItems: 5 },
            suggestions: { type: "array", items: { type: "string" }, maxItems: 5 },
            better_answer: { type: "string" },
            skills: { type: "object", additionalProperties: false, properties: { clarity: { type: "number", minimum: 0, maximum: 10 }, structure: { type: "number", minimum: 0, maximum: 10 }, confidence: { type: "number", minimum: 0, maximum: 10 }, communication: { type: "number", minimum: 0, maximum: 10 }, technical_knowledge: { type: "number", minimum: 0, maximum: 10 }, problem_solving: { type: "number", minimum: 0, maximum: 10 }, leadership: { type: "number", minimum: 0, maximum: 10 } }, required: ["clarity", "structure", "confidence", "communication", "technical_knowledge", "problem_solving", "leadership"] },
          },
          required: ["score", "strengths", "weaknesses", "suggestions", "better_answer", "skills"],
        },
      },
    },
  });

  const parsed: unknown = JSON.parse(response.output_text);
  return FeedbackSchema.parse(parsed);
}