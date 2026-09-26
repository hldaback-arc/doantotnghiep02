"use client";

import { FormEvent, useState } from "react";

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setIsUploading(true); setMessage("");
    const formData = new FormData(); formData.set("file", file);
    try {
      const response = await fetch("/api/files", { method: "POST", body: formData });
      const result: { file?: { file_name: string }; error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload thất bại.");
      setMessage(`Đã upload ${result.file?.file_name ?? "file"}. Đang chờ extract text.`); setFile(null); event.currentTarget.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload thất bại."); } finally { setIsUploading(false); }
  }
  return <form className="file-upload" onSubmit={submit}><label>CV hoặc tài liệu liên quan<input type="file" accept=".pdf,.docx,.txt" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /></label><small>PDF, DOCX, TXT · tối đa 10MB · MIME sẽ được kiểm tra lại ở server</small>{message ? <p className="dashboard-message" role="status">{message}</p> : null}<button className="button button-primary auth-submit" type="submit" disabled={!file || isUploading}>{isUploading ? "Đang upload..." : "Upload tài liệu"}<span aria-hidden="true">↗</span></button></form>;
}