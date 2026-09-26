"use client";

import { useActionState } from "react";
import { startInterview, type InterviewStartState } from "@/app/interview/new/actions";

const initialState: InterviewStartState = { error: "" };

export function StartInterviewForm() {
  const [state, formAction, isPending] = useActionState(startInterview, initialState);
  return <form className="interview-start-form" action={formAction}><label>Vị trí muốn luyện<input name="job_title" placeholder="Ví dụ: Product Designer" required /></label><label>Công ty mục tiêu <span>(không bắt buộc)</span><input name="company" placeholder="Ví dụ: Công ty công nghệ" /></label><label>Loại phỏng vấn<select name="interview_type" defaultValue="general"><option value="general">Phỏng vấn tổng quát</option><option value="behavioral">Behavioral</option><option value="technical">Technical</option><option value="leadership">Leadership</option></select></label><div className="interview-option-grid"><label>Độ khó<select name="difficulty" defaultValue="medium"><option value="easy">Cơ bản</option><option value="medium">Tiêu chuẩn</option><option value="hard">Thử thách</option></select></label><label>Chế độ<select name="mode" defaultValue="text"><option value="text">Text chat</option><option value="voice">Voice</option></select></label></div>{state.error ? <p className="auth-error" role="alert">{state.error}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isPending}>{isPending ? "Đang tạo session..." : "Bắt đầu luyện"}<span aria-hidden="true">↗</span></button></form>;
}