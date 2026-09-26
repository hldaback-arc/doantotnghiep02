"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) setErrorMessage(error.message);
      else router.push("/dashboard");
    } catch {
      setErrorMessage("Chưa cấu hình Supabase. Hãy thêm biến môi trường theo file .env.example.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <div className="auth-label-row"><label htmlFor="password">Mật khẩu</label><a href="/forgot-password">Quên mật khẩu?</a></div>
      <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
      {errorMessage ? <p className="auth-error" role="alert">{errorMessage}</p> : null}
      <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}<span aria-hidden="true">↗</span></button>
    </form>
  );
}