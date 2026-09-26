"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      setMessage(error ? error.message : "Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");
    } catch {
      setMessage("Chưa cấu hình Supabase. Hãy thêm biến môi trường theo file .env.example.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form" onSubmit={handleSubmit}><label htmlFor="forgot-email">Email tài khoản</label><input id="forgot-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />{message ? <p className="auth-error" role="status">{message}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang gửi..." : "Gửi hướng dẫn"}<span aria-hidden="true">↗</span></button></form>;
}