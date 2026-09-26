import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FinishSessionButton } from "@/components/interview/finish-session-button";

export default async function InterviewResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: session } = await supabase.from("interview_sessions").select("id, title, job_title, status, overall_score").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) notFound();
  const { data: feedback } = await supabase.from("interview_feedback").select("id, score, strengths, weaknesses, suggestions, better_answer, skill_scores").eq("session_id", sessionId).eq("user_id", userId).order("created_at", { ascending: true });
  const scores = (feedback ?? []).map((item) => Number(item.score));
  const displayScore = session.overall_score ?? (scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : null);

  return <main className="result-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="result-content"><p className="eyebrow"><span className="eyebrow-dot" /> Interview result</p><h1>{session.job_title || session.title}<br /><em>review.</em></h1><div className="result-score"><span>OVERALL SCORE</span><strong>{displayScore === null ? "—" : displayScore.toFixed(1)}</strong><small>{session.status === "completed" ? "Session completed" : "Feedback ready"}</small></div>{feedback?.length ? <div className="feedback-list">{feedback.map((item, index) => <article className="feedback-card" key={item.id}><span className="card-number">ANSWER {index + 1} · {Number(item.score).toFixed(1)}</span><h2>Feedback của AI</h2><div><strong>Điểm mạnh</strong><p>{(item.strengths as string[]).join(" · ")}</p><strong>Cải thiện</strong><p>{(item.suggestions as string[]).join(" · ")}</p></div></article>)}</div> : <div className="dashboard-message"><p>Chưa có feedback để tạo kết quả.</p><Link className="text-link" href={`/interview/${sessionId}/chat`}>Quay lại session ↗</Link></div>}<FinishSessionButton sessionId={sessionId} /></section></main>;
}