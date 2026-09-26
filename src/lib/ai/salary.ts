import OpenAI from "openai";

export async function generateSalaryResponse(input: { jobTitle: string; industry: string | null; history: Array<{ role: "user" | "assistant"; content: string }> }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: `Bạn là salary negotiation coach bằng tiếng Việt cho vị trí ${input.jobTitle}${input.industry ? ` trong ngành ${input.industry}` : ""}. Roleplay như recruiter hoặc hiring manager. Hỏi và phản biện từng lượt, giúp người dùng trình bày giá trị bằng dữ liệu họ cung cấp. Không biến estimate thành market fact, không bịa thành tích và không hứa chắc kết quả.` },
      ...input.history.map((message) => ({ role: message.role, content: message.content })),
    ],
  });
  const text = response.output_text.trim();
  if (!text) throw new Error("AI returned an empty response.");
  return text;
}