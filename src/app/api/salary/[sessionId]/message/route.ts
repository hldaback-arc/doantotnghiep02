import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSalaryResponse } from "@/lib/ai/salary";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const message = body && typeof body === "object" && "message" in body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 20000) return NextResponse.json({ error: "Message không hợp lệ." }, { status: 400 });
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  const { data: session } = await supabase.from("salary_sessions").select("id, user_id, job_title, industry").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) return NextResponse.json({ error: "Salary session not found." }, { status: 404 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Salary AI chưa được cấu hình trên server." }, { status: 503 });
  const { data: previousMessages } = await supabase.from("salary_messages").select("role, content, sequence").eq("session_id", sessionId).eq("user_id", userId).order("sequence", { ascending: true }).limit(40);
  const history = (previousMessages ?? []).filter((item): item is { role: "user" | "assistant"; content: string; sequence: number } => item.role === "user" || item.role === "assistant");
  const nextSequence = (previousMessages?.at(-1)?.sequence ?? -1) + 1;
  const { data: userMessage, error: userMessageError } = await supabase.from("salary_messages").insert({ session_id: sessionId, user_id: userId, role: "user", content: message, sequence: nextSequence }).select("id").single();
  if (userMessageError || !userMessage) return NextResponse.json({ error: "Không thể lưu message." }, { status: 500 });
  try {
    const answer = await generateSalaryResponse({ jobTitle: session.job_title, industry: session.industry, history: [...history, { role: "user", content: message }] });
    const { data: assistantMessage, error: assistantError } = await supabase.from("salary_messages").insert({ session_id: sessionId, user_id: userId, role: "assistant", content: answer, sequence: nextSequence + 1 }).select("id").single();
    if (assistantError || !assistantMessage) return NextResponse.json({ error: "AI đã phản hồi nhưng không thể lưu kết quả." }, { status: 500 });
    return NextResponse.json({ message: answer, userMessageId: userMessage.id, assistantMessageId: assistantMessage.id });
  } catch {
    return NextResponse.json({ error: "Không thể tạo salary response lúc này." }, { status: 502 });
  }
}