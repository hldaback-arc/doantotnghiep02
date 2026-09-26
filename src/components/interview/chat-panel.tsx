"use client";

import { FormEvent, useRef, useState } from "react";
import type { InterviewMessage } from "@/types/interview";

export function ChatPanel({ sessionId, initialMessages }: { sessionId: string; initialMessages: InterviewMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;
    setDraft("");
    setError("");
    setIsSending(true);
    abortRef.current = new AbortController();
    const optimistic: InterviewMessage = { id: `temp-${Date.now()}`, role: "user", content, sequence: messages.length, created_at: new Date().toISOString() };
    setMessages((current) => [...current, optimistic]);
    try {
      const response = await fetch(`/api/interview/${sessionId}/message`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: content }), signal: abortRef.current.signal });
      const result: { message?: string; userMessageId?: string; assistantMessageId?: string; error?: string } = await response.json();
      if (!response.ok || !result.message) throw new Error(result.error || "Không thể gửi câu trả lời.");
      setMessages((current) => [...current.map((item) => item.id === optimistic.id ? { ...item, id: result.userMessageId ?? item.id } : item), { id: result.assistantMessageId ?? `assistant-${Date.now()}`, role: "assistant", content: result.message as string, sequence: current.length, created_at: new Date().toISOString() }]);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "Không thể gửi câu trả lời.");
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }

  async function requestFeedback(messageId: string) {
    setFeedbackState((current) => ({ ...current, [messageId]: "Đang phân tích..." }));
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageId }) });
    const result: { feedback?: { score: number }; error?: string } = await response.json();
    setFeedbackState((current) => ({ ...current, [messageId]: response.ok && result.feedback ? `Score ${Number(result.feedback.score).toFixed(1)}` : result.error || "Không thể tạo feedback." }));
  }

  return <div className="chat-panel"><div className="chat-messages">{messages.length ? messages.map((message) => <div className={`chat-message ${message.role}`} key={message.id}><span>{message.role === "assistant" ? "AI" : "Bạn"}</span><p>{message.content}</p>{message.role === "user" && !message.id.startsWith("temp-") ? <button className="feedback-trigger" type="button" onClick={() => requestFeedback(message.id)}>{feedbackState[message.id] || "Nhận feedback ↗"}</button> : null}</div>) : <div className="chat-empty"><span className="chat-orb">VI</span><p>AI sẽ bắt đầu bằng một câu hỏi ngắn. Hãy chia sẻ điều bạn muốn luyện hôm nay.</p></div>}{isSending ? <div className="chat-message assistant"><span>AI</span><p className="typing-indicator">Đang suy nghĩ...</p></div> : null}</div><form className="chat-composer" onSubmit={handleSubmit}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Viết câu trả lời của bạn..." rows={3} disabled={isSending} /><div><span>{error || "Câu trả lời của bạn sẽ được lưu trong session này."}</span><button className="button button-primary" type="submit" disabled={isSending || !draft.trim()}>{isSending ? "Đang gửi..." : "Gửi câu trả lời"}<span aria-hidden="true">↗</span></button></div></form></div>;
}