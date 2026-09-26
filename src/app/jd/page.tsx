import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JdForm } from "@/components/jd/jd-form";

export default async function JdPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login");
  return <main className="jd-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="jd-content"><p className="eyebrow"><span className="eyebrow-dot" /> JD context</p><h1>Đưa đúng cơ hội<br /><em>vào phòng luyện.</em></h1><p className="profile-intro">JD được lưu riêng cho bạn và sẽ trở thành context để cá nhân hóa câu hỏi phỏng vấn, không được gửi toàn bộ database vào model.</p><JdForm /></section></main>;
}