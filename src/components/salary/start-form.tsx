"use client";

import { useActionState } from "react";
import { startSalarySession, type SalaryStartState } from "@/app/salary/new/actions";

const initialState: SalaryStartState = { error: "" };

export function SalaryStartForm() {
  const [state, formAction, isPending] = useActionState(startSalarySession, initialState);
  return <form className="interview-start-form" action={formAction}><label>Vị trí muốn đàm phán<input name="job_title" placeholder="Ví dụ: Senior Product Designer" required /></label><label>Ngành nghề<input name="industry" placeholder="Ví dụ: Công nghệ" /></label><div className="interview-option-grid"><label>Lương hiện tại<input name="current_salary" type="number" min="0" placeholder="VND / tháng" /></label><label>Mức mong muốn<input name="desired_salary" type="number" min="0" placeholder="VND / tháng" /></label><label>Mức tối thiểu<input name="minimum_salary" type="number" min="0" placeholder="VND / tháng" /></label><label>Địa điểm<input name="location" placeholder="Ví dụ: Hồ Chí Minh" /></label></div>{state.error ? <p className="auth-error" role="alert">{state.error}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isPending}>{isPending ? "Đang tạo workspace..." : "Bắt đầu chuẩn bị"}<span aria-hidden="true">↗</span></button></form>;
}