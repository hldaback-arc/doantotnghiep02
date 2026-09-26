import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const maxFileSize = 10 * 1024 * 1024;

function detectFileType(fileName: string, bytes: Uint8Array) {
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension === "pdf" && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-") return "pdf";
  if (extension === "docx" && bytes[0] === 0x50 && bytes[1] === 0x4b) return "docx";
  if (extension === "txt") return "txt";
  return null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Chưa chọn file." }, { status: 400 });
  if (file.size <= 0 || file.size > maxFileSize) return NextResponse.json({ error: "File phải lớn hơn 0 và không quá 10MB." }, { status: 400 });
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const fileType = detectFileType(originalName, bytes);
  if (!fileType) return NextResponse.json({ error: "Chỉ hỗ trợ PDF, DOCX hoặc TXT hợp lệ." }, { status: 400 });
  const storagePath = `${userId}/${randomUUID()}-${originalName}`;
  const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, new Blob([bytes]), { contentType: "application/octet-stream", upsert: false });
  if (uploadError) return NextResponse.json({ error: "Không thể upload file vào storage." }, { status: 502 });
  const { data: saved, error: metadataError } = await supabase.from("user_files").insert({ user_id: userId, file_name: originalName, storage_path: storagePath, file_type: fileType, file_size: file.size }).select("id, file_name, file_type, file_size, extraction_status, created_at").single();
  if (metadataError) {
    await supabase.storage.from("documents").remove([storagePath]);
    return NextResponse.json({ error: "Không thể lưu metadata file." }, { status: 500 });
  }
  return NextResponse.json({ file: saved }, { status: 201 });
}