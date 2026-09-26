"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SalaryStartState = { error: string };

function numberValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function startSalarySession(_state: SalaryStartState, formData: FormData): Promise<SalaryStartState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { error: "Phiên đăng nhập không hợp lệ." };
  const jobTitle = String(formData.get("job_title") ?? "").trim();
  if (!jobTitle) return { error: "Vui lòng nhập vị trí muốn đàm phán." };
  const { data: session, error } = await supabase.from("salary_sessions").insert({ user_id: userId, job_title: jobTitle, industry: String(formData.get("industry") ?? "").trim() || null, current_salary: numberValue(formData, "current_salary"), desired_salary: numberValue(formData, "desired_salary"), minimum_salary: numberValue(formData, "minimum_salary"), location: String(formData.get("location") ?? "").trim() || null }).select("id").single();
  if (error || !session) return { error: "Không thể tạo salary session. Hãy kiểm tra migration salary_sessions." };
  redirect(`/salary/${session.id}`);
}