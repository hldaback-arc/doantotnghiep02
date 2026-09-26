"use client";

import { useActionState } from "react";
import { saveProfile, type ProfileFormState } from "@/app/profile/actions";
import type { Profile } from "@/types/database";

const initialState: ProfileFormState = { error: "", success: "" };

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);
  const value = (key: keyof Profile) => profile?.[key] ?? "";

  return <form className="profile-form" action={formAction}>
    <div className="profile-form-grid"><label>Họ và tên<input name="full_name" defaultValue={value("full_name")} required /></label><label>Vị trí hiện tại<input name="job_title" defaultValue={value("job_title")} /></label><label>Ngành nghề<input name="industry" defaultValue={value("industry")} /></label><label>Số năm kinh nghiệm<input name="years_experience" type="number" min="0" max="60" defaultValue={value("years_experience")} /></label><label>Mức lương hiện tại<input name="current_salary" type="number" min="0" defaultValue={value("current_salary")} /></label><label>Mức lương mong muốn<input name="desired_salary" type="number" min="0" defaultValue={value("desired_salary")} /></label><label>Địa điểm<input name="location" defaultValue={value("location")} /></label><label>Kỹ năng <span>(phân tách bằng dấu phẩy)</span><input name="skills" defaultValue={Array.isArray(profile?.skills) ? profile.skills.join(", ") : ""} /></label></div>
    {state.error ? <p className="auth-error" role="alert">{state.error}</p> : null}{state.success ? <p className="profile-success" role="status">{state.success}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isPending}>{isPending ? "Đang lưu..." : "Lưu profile"}<span aria-hidden="true">↗</span></button>
  </form>;
}