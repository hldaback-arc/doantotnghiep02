"use client";

import { useEffect, useRef, useState } from "react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

type VoiceState = "idle" | "connecting" | "listening" | "error" | "ended";

export function VoicePanel({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [message, setMessage] = useState("Sẵn sàng kết nối microphone.");
  const sessionRef = useRef<RealtimeSession | null>(null);

  async function startVoice() {
    setState("connecting");
    setMessage("Đang kết nối voice engine...");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Trình duyệt không hỗ trợ microphone.");
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());
      const response = await fetch("/api/realtime/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) });
      const result: { clientSecret?: string; error?: string } = await response.json();
      if (!response.ok || !result.clientSecret) throw new Error(result.error || "Không thể tạo voice session.");
      const agent = new RealtimeAgent({ name: "Viet Interviewer", instructions: "Nói tiếng Việt tự nhiên, hỏi từng câu một, chờ người dùng trả lời xong rồi mới tiếp tục." });
      const realtimeSession = new RealtimeSession(agent, { model: "gpt-realtime" });
      sessionRef.current = realtimeSession;
      await realtimeSession.connect({ apiKey: result.clientSecret });
      setState("listening");
      setMessage("Đang lắng nghe. Bạn có thể bắt đầu trả lời.");
    } catch (caught) {
      setState("error");
      setMessage(caught instanceof Error ? caught.message : "Không thể kết nối voice session.");
    }
  }

  function stopVoice() {
    sessionRef.current?.close();
    sessionRef.current = null;
    setState("ended");
    setMessage("Voice session đã kết thúc. Transcript text vẫn là fallback của bạn.");
  }

  useEffect(() => () => { sessionRef.current?.close(); sessionRef.current = null; }, []);

  return <div className={`voice-panel ${state}`}><div className="voice-orb" aria-hidden="true"><span>{state === "listening" ? "◌" : "VI"}</span></div><p className="eyebrow">Voice interview · {state}</p><h2>{message}</h2><div className="voice-actions">{state === "idle" || state === "error" || state === "ended" ? <button className="button button-primary" type="button" onClick={startVoice}>{state === "error" ? "Thử lại" : "Bắt đầu voice"}<span aria-hidden="true">↗</span></button> : null}{state === "connecting" || state === "listening" ? <button className="button button-dark" type="button" onClick={stopVoice}>Kết thúc voice</button> : null}</div></div>;
}