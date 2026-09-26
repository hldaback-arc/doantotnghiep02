"use client";

import { useActionState } from "react";
import { saveJobDescription, type JobDescriptionState } from "@/app/jd/actions";

const initialState: JobDescriptionState = { error: "" };

export function JdForm() {
  const [state, formAction, isPending] = useActionState(saveJobDescription, initialState);
  return <form className="jd-form" action={formAction}><label>Tên vị trí<input name="title" placeholder="Ví dụ: Product Designer" required /></label><label>Công ty <span>(không bắt buộc)</span><input name="company" placeholder="Ví dụ: Công ty công nghệ" /></label><label>Job description<textarea name="raw_content" minLength={20} maxLength={50000} rows={12} placeholder="Dán nội dung JD ở đây..." required /></label>{state.error ? <p className="auth-error" role="alert">{state.error}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isPending}>{isPending ? "Đang lưu context..." : "Lưu JD"}<span aria-hidden="true">↗</span></button></form>;
}