"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { trackEvent } from "@/lib/analytics/events";

export type InterviewStartState = { error: string };

export async function startInterview(_state: InterviewStartState, formData: FormData): Promise<InterviewStartState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { error: "Phiên đăng nhập không hợp lệ." };

  const jobTitle = String(formData.get("job_title") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const interviewType = String(formData.get("interview_type") ?? "general");
  const difficulty = String(formData.get("difficulty") ?? "medium");
  const mode = String(formData.get("mode") ?? "text");
  if (!jobTitle) return { error: "Vui lòng nhập vị trí muốn luyện." };
  if (!(["easy", "medium", "hard"] as string[]).includes(difficulty)) return { error: "Độ khó không hợp lệ." };
  if (!(["text", "voice"] as string[]).includes(mode)) return { error: "Chế độ luyện không hợp lệ." };

  const { data: session, error } = await supabase.from("interview_sessions").insert({ user_id: userId, title: `${jobTitle} interview`, job_title: jobTitle, company: company || null, interview_type: interviewType, difficulty, mode }).select("id").single();
  if (error || !session) return { error: "Không thể tạo session. Hãy kiểm tra migration interview_sessions." };
  await trackEvent(supabase, userId, "interview_started", { mode });
  redirect(`/interview/${session.id}/${mode === "voice" ? "voice" : "chat"}`);
}