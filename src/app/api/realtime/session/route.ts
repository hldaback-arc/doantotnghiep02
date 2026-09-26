import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const sessionId = body && typeof body === "object" && "sessionId" in body && typeof body.sessionId === "string" ? body.sessionId : "";
  if (!sessionId) return NextResponse.json({ error: "sessionId không hợp lệ." }, { status: 400 });

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  const { data: session } = await supabase.from("interview_sessions").select("id, job_title, difficulty").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI voice chưa được cấu hình trên server." }, { status: 503 });
  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "OpenAI-Safety-Identifier": createHash("sha256").update(userId).digest("hex") },
    body: JSON.stringify({ expires_after: { anchor: "created_at", seconds: 600 }, session: { type: "realtime", model: "gpt-realtime", instructions: `Bạn là interviewer tiếng Việt cho vị trí ${session.job_title ?? "vị trí này"}. Độ khó ${session.difficulty}. Hỏi từng câu ngắn, tự nhiên; luôn để người dùng có thể trả lời bằng voice.` } }),
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload !== "object" || !("value" in payload) || typeof payload.value !== "string") return NextResponse.json({ error: "Không thể khởi tạo voice session." }, { status: 502 });
  return NextResponse.json({ clientSecret: payload.value });
}