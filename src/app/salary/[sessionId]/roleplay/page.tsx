import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoleplayPanel } from "@/components/salary/roleplay-panel";
import type { SalaryMessage } from "@/types/salary";

export default async function SalaryRoleplayPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: session } = await supabase.from("salary_sessions").select("id, job_title").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) notFound();
  const { data: messages } = await supabase.from("salary_messages").select("id, role, content, sequence, created_at").eq("session_id", sessionId).eq("user_id", userId).order("sequence", { ascending: true }).limit(40);
  return <main className="salary-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href={`/salary/${sessionId}`}>Salary workspace ↗</Link></div><section className="salary-workspace"><p className="eyebrow"><span className="eyebrow-dot" /> Salary roleplay · {session.job_title}</p><h1>Luyện cách nói<br /><em>về giá trị của bạn.</em></h1><RoleplayPanel sessionId={sessionId} initialMessages={(messages ?? []) as SalaryMessage[]} /></section></main>;
}