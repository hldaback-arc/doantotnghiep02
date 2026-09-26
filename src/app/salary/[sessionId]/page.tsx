import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SalarySession } from "@/types/database";

export default async function SalarySessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data } = await supabase.from("salary_sessions").select("id, user_id, job_title, industry, current_salary, desired_salary, minimum_salary, location, target_salary, opening_ask, walk_away, strategy, status, created_at, updated_at").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!data) notFound();
  const session = data as SalarySession;
  return <main className="salary-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/salary/new">New salary session ↗</Link></div><section className="salary-workspace"><p className="eyebrow"><span className="eyebrow-dot" /> Salary workspace</p><h1>{session.job_title}<br /><em>strategy.</em></h1><p className="profile-intro">{session.industry || "Chưa có ngành nghề"}{session.location ? ` · ${session.location}` : ""}</p><div className="salary-cards"><div><span>HIỆN TẠI</span><strong>{session.current_salary?.toLocaleString("vi-VN") ?? "—"}</strong></div><div><span>MONG MUỐN</span><strong>{session.desired_salary?.toLocaleString("vi-VN") ?? "—"}</strong></div><div><span>TỐI THIỂU</span><strong>{session.minimum_salary?.toLocaleString("vi-VN") ?? "—"}</strong></div></div><div className="salary-next"><div><p className="eyebrow">Tiếp theo</p><h2>Chưa có estimate tự động.</h2><p>Hãy dùng roleplay để luyện cách trình bày kỳ vọng. Mọi estimate AI sau này sẽ được gắn nhãn là hỗ trợ quyết định.</p></div><Link className="button button-primary" href={`/salary/${sessionId}/roleplay`}>Bắt đầu roleplay <span aria-hidden="true">↗</span></Link></div></section></main>;
}