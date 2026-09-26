import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatPanel } from "@/components/interview/chat-panel";
import type { InterviewMessage } from "@/types/interview";
import { FinishSessionButton } from "@/components/interview/finish-session-button";

export default async function InterviewChatPage({ params }: { params: Promise<{ sessionId: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: session } = await supabase.from("interview_sessions").select("id, title, job_title, difficulty, mode, status").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) notFound();
  const { data: messages } = await supabase.from("interview_messages").select("id, role, content, sequence, created_at").eq("session_id", sessionId).eq("user_id", userId).order("sequence", { ascending: true }).limit(40);

  return <main className="chat-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><span className="session-status">{session.mode === "voice" ? "VOICE" : "TEXT"} · {session.difficulty}</span></div><section className="chat-shell"><p className="eyebrow"><span className="eyebrow-dot" /> {session.title}</p><h1>Hãy bắt đầu bằng câu chuyện của bạn.</h1><ChatPanel sessionId={sessionId} initialMessages={(messages ?? []) as InterviewMessage[]} /><FinishSessionButton sessionId={sessionId} /><Link className="text-link" href="/dashboard">Quay lại dashboard ↗</Link></section></main>;
}