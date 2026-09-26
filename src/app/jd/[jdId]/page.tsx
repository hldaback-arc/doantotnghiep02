import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyzeButton } from "@/components/jd/analyze-button";

export default async function JdDetailPage({ params }: { params: Promise<{ jdId: string }> }) {
  const { jdId } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: jd } = await supabase.from("job_descriptions").select("id, title, company, raw_content, extraction_status, extracted_context, created_at").eq("id", jdId).eq("user_id", userId).maybeSingle();
  if (!jd) notFound();
  const context = jd.extracted_context as { seniority?: string; skills?: string[]; responsibilities?: string[]; requirements?: string[]; keywords?: string[] };
  return <main className="jd-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/jd">Thêm JD ↗</Link></div><section className="jd-detail"><p className="eyebrow"><span className="eyebrow-dot" /> Job description context</p><h1>{jd.title}<br /><em>{jd.company || "opportunity"}.</em></h1><div className="jd-status">Extraction status: {jd.extraction_status}</div><AnalyzeButton jdId={jd.id} status={jd.extraction_status} />{context?.seniority ? <div className="jd-context-grid"><div><span>Seniority</span><strong>{context.seniority}</strong></div><div><span>Skills</span><p>{context.skills?.join(" · ")}</p></div><div><span>Keywords</span><p>{context.keywords?.join(" · ")}</p></div><div><span>Responsibilities</span><p>{context.responsibilities?.join(" · ")}</p></div></div> : null}<pre className="jd-raw-content">{jd.raw_content}</pre></section></main>;
}