"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AnalyzeButton({ jdId, status }: { jdId: string; status: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  async function analyze() {
    setIsAnalyzing(true); setMessage("");
    try {
      const response = await fetch(`/api/jd/${jdId}/analyze`, { method: "POST" });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể phân tích JD.");
      setMessage("Đã extract structured context."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Không thể phân tích JD."); } finally { setIsAnalyzing(false); }
  }
  return <div className="jd-analyze"><button className="button button-primary" type="button" onClick={analyze} disabled={isAnalyzing || status === "processing"}>{isAnalyzing || status === "processing" ? "Đang phân tích..." : "Extract JD context"}<span aria-hidden="true">↗</span></button>{message ? <span role="status">{message}</span> : null}</div>;
}