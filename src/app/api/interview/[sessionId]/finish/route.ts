import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics/events";

export async function POST(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });

  const { data: session } = await supabase.from("interview_sessions").select("id, status").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });
  if (session.status === "completed") return NextResponse.json({ ok: true });

  const { data: feedbackRows } = await supabase.from("interview_feedback").select("score").eq("session_id", sessionId).eq("user_id", userId);
  if (!feedbackRows?.length) return NextResponse.json({ error: "Cần có ít nhất một feedback trước khi kết thúc session." }, { status: 400 });
  const overallScore = Number((feedbackRows.reduce((total, row) => total + Number(row.score), 0) / feedbackRows.length).toFixed(1));
  const { error } = await supabase.from("interview_sessions").update({ status: "completed", ended_at: new Date().toISOString(), overall_score: overallScore }).eq("id", sessionId).eq("user_id", userId);
  if (error) return NextResponse.json({ error: "Không thể lưu kết quả session." }, { status: 500 });
  await supabase.from("notifications").insert({ user_id: userId, type: "session_completed", title: "Session đã hoàn thành", body: `Bạn vừa hoàn thành session với điểm ${overallScore.toFixed(1)}.` });
  await trackEvent(supabase, userId, "interview_completed", { score: overallScore });
  return NextResponse.json({ ok: true, overallScore });
}