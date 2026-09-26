"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { error: string; success: string };

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function saveProfile(_state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) return { error: "Phiên đăng nhập không hợp lệ.", success: "" };

  const fullName = textValue(formData, "full_name");
  const yearsExperience = numberValue(formData, "years_experience");
  if (!fullName) return { error: "Vui lòng nhập họ và tên.", success: "" };
  if (yearsExperience !== null && yearsExperience > 60) return { error: "Số năm kinh nghiệm phải từ 0 đến 60.", success: "" };

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: fullName,
    job_title: textValue(formData, "job_title") || null,
    industry: textValue(formData, "industry") || null,
    years_experience: yearsExperience,
    current_salary: numberValue(formData, "current_salary"),
    desired_salary: numberValue(formData, "desired_salary"),
    location: textValue(formData, "location") || null,
    skills: textValue(formData, "skills").split(",").map((skill) => skill.trim()).filter(Boolean),
  });

  if (error) return { error: "Không thể lưu profile. Hãy kiểm tra migration và thử lại.", success: "" };
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { error: "", success: "Profile đã được cập nhật." };
}