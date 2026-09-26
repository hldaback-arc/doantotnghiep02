"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FinishSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  async function finishSession() {
    setError("");
    setIsFinishing(true);
    try {
      const response = await fetch(`/api/interview/${sessionId}/finish`, { method: "POST" });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể kết thúc session.");
      router.push(`/interview/${sessionId}/result`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể kết thúc session.");
    } finally {
      setIsFinishing(false);
    }
  }

  return <div className="finish-session"><button className="text-link" type="button" onClick={finishSession} disabled={isFinishing}>{isFinishing ? "Đang tổng hợp..." : "Kết thúc và xem kết quả ↗"}</button>{error ? <span role="alert">{error}</span> : null}</div>;
}