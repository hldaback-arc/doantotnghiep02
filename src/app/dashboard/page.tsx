import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InterviewSessionSummary, Profile } from "@/types/database";
import { calculateProgress } from "@/lib/progress/metrics";

export default async function DashboardPage() {
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!isConfigured) {
    return <main className="dashboard-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link></div><section className="dashboard-empty"><p className="eyebrow"><span className="eyebrow-dot" /> Dashboard foundation</p><h1>Không gian luyện tập của bạn đang được chuẩn bị.</h1><p>Thêm Supabase URL và publishable key vào `.env.local` để kích hoạt đăng nhập và dữ liệu cá nhân.</p><Link className="button button-primary" href="/login">Quay lại đăng nhập <span aria-hidden="true">↗</span></Link></section></main>;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub;
  const [{ data: profile }, { data: sessions, error: sessionsError }] = await Promise.all([
    supabase.from("profiles").select("full_name, job_title, industry").eq("id", userId).maybeSingle(),
    supabase.from("interview_sessions").select("id, title, job_title, mode, status, overall_score, started_at, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
  ]);
  const profileData = profile as Pick<Profile, "full_name" | "job_title" | "industry"> | null;
  const sessionData = (sessions ?? []) as InterviewSessionSummary[];
  const progress = calculateProgress(sessionData);

  return <main className="dashboard-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><div className="dashboard-nav"><Link href="/profile">Profile</Link><Link href="/progress">Progress</Link><Link href="/notifications">Alerts</Link><Link href="/cv">CV</Link><Link href="/jd">JD</Link><Link href="/salary/new">Salary</Link><Link href="/settings">Settings</Link><span className="dashboard-user">{data.claims.email}</span></div></div><section className="dashboard-content"><div className="dashboard-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your practice space</p><h1>Xin chào{profileData?.full_name ? `, ${profileData.full_name}` : ""}.</h1><p>{profileData?.job_title ? `${profileData.job_title}${profileData.industry ? ` · ${profileData.industry}` : ""}` : "Hoàn thiện profile để cá nhân hóa hành trình luyện tập."}</p></div><Link className="button button-primary" href="/interview/new">Bắt đầu luyện <span aria-hidden="true">↗</span></Link></div><div className="dashboard-stats"><div><span>SESSION HOÀN THÀNH</span><strong>{progress.completedCount}</strong></div><div><span>ĐIỂM TRUNG BÌNH</span><strong>{progress.averageScore?.toFixed(1) ?? "—"}</strong></div><div><span>ĐIỂM CAO NHẤT</span><strong>{progress.bestScore?.toFixed(1) ?? "—"}</strong></div></div><section className="recent-sessions"><div className="section-row"><div><p className="eyebrow">Recent sessions</p><h2>Lịch sử luyện tập</h2></div><Link href="/history">Xem tất cả ↗</Link></div>{sessionsError ? <p className="dashboard-message">Chưa đọc được dữ liệu session. Hãy chạy migration interview_sessions.</p> : sessionData.length ? <div className="session-list">{sessionData.map((session) => <div className="session-row" key={session.id}><span className={`session-mode ${session.mode}`}>{session.mode === "voice" ? "VOICE" : "TEXT"}</span><div><strong>{session.title}</strong><span>{session.job_title || "General interview"}</span></div><b>{session.overall_score === null ? "—" : session.overall_score.toFixed(1)}</b><span className="session-status">{session.status === "completed" ? "Completed" : "In progress"}</span></div>)}</div> : <div className="dashboard-message"><p>Chưa có buổi luyện nào.</p><Link className="text-link" href="/interview/new">Tạo session đầu tiên ↗</Link></div>}</section></section></main>;
}