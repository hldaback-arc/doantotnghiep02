import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: notifications } = await supabase.from("notifications").select("id, type, title, body, read_at, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
  return <main className="notifications-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="notifications-content"><p className="eyebrow"><span className="eyebrow-dot" /> Notifications</p><h1>Những điều<br /><em>đáng chú ý.</em></h1><div className="notification-list">{notifications?.length ? notifications.map((notification) => <article className={notification.read_at ? "read" : "unread"} key={notification.id}><span className="notification-dot" /><div><strong>{notification.title}</strong><p>{notification.body}</p><small>{new Date(notification.created_at).toLocaleString("vi-VN")}</small></div></article>) : <div className="dashboard-message"><p>Chưa có thông báo.</p><Link className="text-link" href="/interview/new">Bắt đầu luyện ↗</Link></div>}</div></section></main>;
}