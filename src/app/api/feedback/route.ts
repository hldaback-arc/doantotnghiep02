import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFeedback } from "@/lib/ai/feedback";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const messageId = body && typeof body === "object" && "messageId" in body && typeof body.messageId === "string" ? body.messageId : "";
  if (!messageId) return NextResponse.json({ error: "messageId không hợp lệ." }, { status: 400 });

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

  const { data: existing } = await supabase.from("interview_feedback").select("id, score, strengths, weaknesses, suggestions, better_answer, skill_scores").eq("message_id", messageId).eq("user_id", userId).maybeSingle();
  if (existing) return NextResponse.json({ feedback: existing });

  const { data: message } = await supabase.from("interview_messages").select("id, session_id, user_id, role, content").eq("id", messageId).eq("user_id", userId).eq("role", "user").maybeSingle();
  if (!message) return NextResponse.json({ error: "Message not found." }, { status: 404 });
  const { data: session } = await supabase.from("interview_sessions").select("job_title").eq("id", message.session_id).eq("user_id", userId).maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI chưa được cấu hình trên server." }, { status: 503 });

  try {
    const feedback = await generateFeedback({ jobTitle: session.job_title ?? "vị trí này", answer: message.content });
    const { data: saved, error } = await supabase.from("interview_feedback").insert({ message_id: message.id, session_id: message.session_id, user_id: userId, score: feedback.score, strengths: feedback.strengths, weaknesses: feedback.weaknesses, suggestions: feedback.suggestions, better_answer: feedback.better_answer, skill_scores: feedback.skills }).select("id, score, strengths, weaknesses, suggestions, better_answer, skill_scores").single();
    if (error) return NextResponse.json({ error: "Không thể lưu feedback." }, { status: 500 });
    return NextResponse.json({ feedback: saved });
  } catch {
    return NextResponse.json({ error: "Không thể tạo feedback lúc này." }, { status: 502 });
  }
}