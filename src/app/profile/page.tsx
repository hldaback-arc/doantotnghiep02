import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export default async function ProfilePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return <main className="dashboard-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link></div><section className="dashboard-empty"><p className="eyebrow"><span className="eyebrow-dot" /> Profile foundation</p><h1>Profile sẽ là context cho mọi buổi luyện.</h1><p>Thêm Supabase env và chạy migration profiles để bật lưu dữ liệu.</p><Link className="button button-primary" href="/dashboard">Quay lại dashboard <span aria-hidden="true">↗</span></Link></section></main>;
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) redirect("/login");

  const { data } = await supabase.from("profiles").select("id, full_name, avatar_url, job_title, industry, years_experience, current_salary, desired_salary, location, skills, created_at, updated_at").eq("id", userId).maybeSingle();
  return <main className="profile-page"><div className="dashboard-top"><Link className="brand" href="/"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="profile-content"><p className="eyebrow"><span className="eyebrow-dot" /> Your context</p><h1>Hãy để AI hiểu bạn<br /><em>rõ hơn.</em></h1><p className="profile-intro">Thông tin này giúp cá nhân hóa câu hỏi phỏng vấn và những gợi ý đàm phán lương.</p><ProfileForm profile={(data as Profile | null) ?? null} /></section></main>;
}