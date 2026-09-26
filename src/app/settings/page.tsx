import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function SettingsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login");

  return <main className="settings-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="settings-content"><p className="eyebrow"><span className="eyebrow-dot" /> Settings &amp; privacy</p><h1>Kiểm soát dữ liệu<br /><em>của bạn.</em></h1><p className="profile-intro">Bạn luôn biết dữ liệu nào được dùng để cá nhân hóa trải nghiệm và dữ liệu nào được lưu lại.</p><div className="settings-list"><article><div><h2>Profile &amp; AI context</h2><p>Thông tin profile, CV và JD chỉ được dùng làm context liên quan cho session của bạn. AI không được tự tạo kinh nghiệm hoặc thành tích.</p></div><Link className="text-link" href="/profile">Xem profile ↗</Link></article><article><div><h2>Transcript</h2><p>Transcript text được lưu cùng session để tạo feedback, result, history và progress. Bạn có thể yêu cầu xóa dữ liệu theo chính sách sản phẩm.</p></div><span className="settings-status active">Đang sử dụng</span></article><article><div><h2>Audio recording</h2><p>Audio recording mặc định tắt. Voice flow chỉ dùng audio trong phiên realtime; transcript có thể được lưu để phục vụ feedback.</p></div><span className="settings-status">OFF mặc định</span></article><article><div><h2>Account session</h2><p>Đăng xuất sẽ xóa phiên Supabase hiện tại khỏi browser. Các record database vẫn được bảo vệ bởi RLS ownership.</p></div><LogoutButton /></article></div></section></main>;
}