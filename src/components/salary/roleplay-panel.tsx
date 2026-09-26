"use client";

import { FormEvent, useState } from "react";
import type { SalaryMessage } from "@/types/salary";

export function RoleplayPanel({ sessionId, initialMessages }: { sessionId: string; initialMessages: SalaryMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;
    setDraft(""); setError(""); setIsSending(true);
    const optimistic: SalaryMessage = { id: `temp-${Date.now()}`, role: "user", content, sequence: messages.length, created_at: new Date().toISOString() };
    setMessages((current) => [...current, optimistic]);
    try {
      const response = await fetch(`/api/salary/${sessionId}/message`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: content }) });
      const result: { message?: string; userMessageId?: string; assistantMessageId?: string; error?: string } = await response.json();
      if (!response.ok || !result.message) throw new Error(result.error || "Không thể gửi message.");
      setMessages((current) => [...current.map((item) => item.id === optimistic.id ? { ...item, id: result.userMessageId ?? item.id } : item), { id: result.assistantMessageId ?? `assistant-${Date.now()}`, role: "assistant", content: result.message as string, sequence: current.length, created_at: new Date().toISOString() }]);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể gửi message."); } finally { setIsSending(false); }
  }
  return <div className="chat-panel"><div className="chat-messages">{messages.length ? messages.map((message) => <div className={`chat-message ${message.role}`} key={message.id}><span>{message.role === "assistant" ? "COACH" : "BẠN"}</span><p>{message.content}</p></div>) : <div className="chat-empty"><span className="chat-orb">₫</span><p>Bắt đầu bằng mức lương bạn muốn đề xuất và lý do đằng sau con số đó.</p></div>}{isSending ? <div className="chat-message assistant"><span>COACH</span><p className="typing-indicator">Đang chuẩn bị phản biện...</p></div> : null}</div><form className="chat-composer" onSubmit={submit}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Viết lập luận hoặc phản hồi của bạn..." rows={3} disabled={isSending} /><div><span>{error || "Chỉ dùng thông tin thật từ kinh nghiệm của bạn."}</span><button className="button button-primary" type="submit" disabled={isSending || !draft.trim()}>{isSending ? "Đang gửi..." : "Gửi phản hồi"}<span aria-hidden="true">↗</span></button></div></form></div>;
}