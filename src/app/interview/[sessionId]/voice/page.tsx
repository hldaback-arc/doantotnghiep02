import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoicePanel } from "@/components/voice/voice-panel";

export default async function VoiceInterviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: session } = await supabase.from("interview_sessions").select("id, title, mode").eq("id", sessionId).eq("user_id", userId).maybeSingle();
  if (!session) notFound();
  return <main className="voice-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href={`/interview/${sessionId}/chat`}>Chuyển sang text ↗</Link></div><section className="voice-shell"><p className="eyebrow"><span className="eyebrow-dot" /> {session.title}</p><VoicePanel sessionId={sessionId} /><Link className="text-link" href="/dashboard">Quay lại dashboard ↗</Link></section></main>;
}