import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateProgress } from "@/lib/progress/metrics";
import type { InterviewSessionSummary } from "@/types/database";

export default async function ProgressPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: sessions } = await supabase.from("interview_sessions").select("id, title, job_title, mode, status, overall_score, started_at, created_at").eq("user_id", userId).order("created_at", { ascending: true }).limit(100);
  const sessionData = (sessions ?? []) as InterviewSessionSummary[];
  const metrics = calculateProgress(sessionData);

  return <main className="dashboard-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="progress-content"><p className="eyebrow"><span className="eyebrow-dot" /> Progress engine</p><h1>Tiến bộ của<br /><em>bạn.</em></h1><p className="profile-intro">Các chỉ số được tính từ những session đã hoàn thành và có score.</p>{metrics.trend === "no-data" ? <div className="dashboard-message"><p>Chưa có đủ dữ liệu để hiển thị tiến bộ.</p><Link className="text-link" href="/interview/new">Bắt đầu session đầu tiên ↗</Link></div> : <><div className="progress-stats"><div><span>ĐIỂM GẦN NHẤT</span><strong>{metrics.latestScore?.toFixed(1)}</strong></div><div><span>TRUNG BÌNH</span><strong>{metrics.averageScore?.toFixed(1)}</strong></div><div><span>CAO NHẤT</span><strong>{metrics.bestScore?.toFixed(1)}</strong></div><div><span>THAY ĐỔI</span><strong className={metrics.trend}>{metrics.scoreChange === null ? "—" : `${metrics.scoreChange > 0 ? "+" : ""}${metrics.scoreChange.toFixed(1)}`}</strong></div></div><div className="progress-note"><span className={`trend-dot ${metrics.trend}`} />{metrics.trend === "up" ? "Bạn đang đi lên. Giữ nhịp luyện tập này." : metrics.trend === "down" ? "Hãy xem lại feedback gần nhất và thử lại." : "Điểm số đang ổn định qua các session."}</div></>}</section></main>;
}