import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InterviewSessionSummary } from "@/types/database";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { cursor } = await searchParams;
  let sessionsQuery = supabase.from("interview_sessions").select("id, title, job_title, mode, status, overall_score, started_at, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
  if (cursor) sessionsQuery = sessionsQuery.lt("created_at", cursor);
  const { data: sessions } = await sessionsQuery;
  const sessionData = (sessions ?? []) as InterviewSessionSummary[];
  const nextCursor = sessionData.length === 20 ? sessionData[sessionData.length - 1]?.created_at : null;

  return <main className="dashboard-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="history-content"><p className="eyebrow"><span className="eyebrow-dot" /> Practice archive</p><h1>Lịch sử <em>luyện tập.</em></h1><p className="profile-intro">Mỗi session là một điểm dữ liệu cho hành trình tiến bộ của bạn.</p>{sessionData.length ? <><div className="session-list">{sessionData.map((session) => <Link className="session-row" href={`/interview/${session.id}/result`} key={session.id}><span className={`session-mode ${session.mode}`}>{session.mode === "voice" ? "VOICE" : "TEXT"}</span><div><strong>{session.title}</strong><span>{session.job_title || "General interview"}</span></div><b>{session.overall_score === null ? "—" : session.overall_score.toFixed(1)}</b><span className="session-status">{session.status === "completed" ? "Completed" : "In progress"}</span></Link>)}</div>{nextCursor ? <Link className="button button-dark history-next" href={`/history?cursor=${encodeURIComponent(nextCursor)}`}>Xem thêm ↗</Link> : null}</> : <div className="dashboard-message"><p>{cursor ? "Đã xem hết lịch sử session." : "Chưa có session nào trong history."}</p>{cursor ? <Link className="text-link" href="/history">Về trang đầu ↗</Link> : <Link className="text-link" href="/interview/new">Bắt đầu luyện ↗</Link>}</div>}</section></main>;
}