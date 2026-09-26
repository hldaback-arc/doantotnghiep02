"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type JobDescriptionState = { error: string };

export async function saveJobDescription(_state: JobDescriptionState, formData: FormData): Promise<JobDescriptionState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { error: "Phiên đăng nhập không hợp lệ." };
  const title = String(formData.get("title") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const rawContent = String(formData.get("raw_content") ?? "").trim();
  if (!title) return { error: "Vui lòng nhập tên vị trí." };
  if (rawContent.length < 20 || rawContent.length > 50000) return { error: "JD phải dài từ 20 đến 50.000 ký tự." };
  const { data, error } = await supabase.from("job_descriptions").insert({ user_id: userId, title, company: company || null, raw_content: rawContent }).select("id").single();
  if (error || !data) return { error: "Không thể lưu JD. Hãy kiểm tra migration job_descriptions." };
  redirect(`/jd/${data.id}`);
}