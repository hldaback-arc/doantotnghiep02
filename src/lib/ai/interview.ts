import OpenAI from "openai";

const model = "gpt-4o-mini";

export async function generateInterviewResponse(input: { jobTitle: string; difficulty: string; history: Array<{ role: "user" | "assistant"; content: string }> }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.create({
    model,
    input: [
      { role: "system", content: `Bạn là interviewer tiếng Việt cho vị trí ${input.jobTitle}. Độ khó: ${input.difficulty}. Hỏi từng câu một, ngắn gọn, tự nhiên. Không bịa thông tin về ứng viên và không đưa ra cam kết tuyển dụng.` },
      ...input.history.map((message) => ({ role: message.role, content: message.content })),
    ],
  });

  const text = response.output_text.trim();
  if (!text) throw new Error("AI returned an empty response.");
  return text;
}