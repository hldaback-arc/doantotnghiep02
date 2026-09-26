"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setMessage(error ? error.message : "Hãy kiểm tra email để xác nhận tài khoản.");
    } catch {
      setMessage("Chưa cấu hình Supabase. Hãy thêm biến môi trường theo file .env.example.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form" onSubmit={handleSubmit}><label htmlFor="register-email">Email</label><input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><label htmlFor="register-password">Mật khẩu</label><input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />{message ? <p className="auth-error" role="status">{message}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}<span aria-hidden="true">↗</span></button></form>;
}