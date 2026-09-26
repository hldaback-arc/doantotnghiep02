"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/");
      router.refresh();
    }
  }
  return <button className="settings-danger-button" type="button" onClick={logout}>Đăng xuất</button>;
}