import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FileUploadForm } from "@/components/files/file-upload-form";

export default async function CvPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/dashboard");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: files } = await supabase.from("user_files").select("id, file_name, file_type, file_size, extraction_status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
  return <main className="files-page"><div className="dashboard-top"><Link className="brand" href="/dashboard"><span className="brand-mark">VI</span><span>Việt Interview Pro</span></Link><Link className="dashboard-user" href="/dashboard">Dashboard ↗</Link></div><section className="files-content"><p className="eyebrow"><span className="eyebrow-dot" /> CV context</p><h1>Để kinh nghiệm của bạn<br /><em>lên tiếng.</em></h1><p className="profile-intro">Tài liệu được lưu trong private storage và chỉ dùng làm context liên quan cho AI. Nội dung không được tự bịa hoặc chia sẻ sang user khác.</p><FileUploadForm /><div className="file-list">{files?.length ? files.map((file) => <div className="file-row" key={file.id}><strong>{file.file_name}</strong><span>{file.file_type.toUpperCase()} · {file.extraction_status}</span></div>) : <p className="dashboard-message">Chưa có tài liệu nào.</p>}</div></section></main>;
}