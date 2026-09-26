import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  const [{ count: users }, { count: sessions }, { count: events }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("interview_sessions").select("id", { count: "exact", head: true }),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }),
  ]);
  return <main className="admin-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="admin-content"><p className="eyebrow"><span className="eyebrow-dot" /> Admin overview</p><h1>Vận hành<br /><em>có dữ liệu.</em></h1><p className="profile-intro">Chỉ aggregate metrics. Nội dung hội thoại và tài liệu user không hiển thị mặc định.</p><div className="admin-stats"><div><span>USERS</span><strong>{users ?? 0}</strong></div><div><span>INTERVIEW SESSIONS</span><strong>{sessions ?? 0}</strong></div><div><span>ANALYTICS EVENTS</span><strong>{events ?? 0}</strong></div></div></section></main>;
}