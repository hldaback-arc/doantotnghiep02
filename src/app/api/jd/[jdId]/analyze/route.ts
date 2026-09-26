import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractJobContext } from "@/lib/ai/job-description";

export async function POST(_request: Request, { params }: { params: Promise<{ jdId: string }> }) {
  const { jdId } = await params;
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  const { data: jd } = await supabase.from("job_descriptions").select("id, title, raw_content, extraction_status").eq("id", jdId).eq("user_id", userId).maybeSingle();
  if (!jd) return NextResponse.json({ error: "JD not found." }, { status: 404 });
  if (jd.extraction_status === "processing") return NextResponse.json({ error: "JD đang được phân tích." }, { status: 409 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI chưa được cấu hình trên server." }, { status: 503 });
  await supabase.from("job_descriptions").update({ extraction_status: "processing" }).eq("id", jdId).eq("user_id", userId);
  try {
    const context = await extractJobContext({ title: jd.title, content: jd.raw_content });
    const { error } = await supabase.from("job_descriptions").update({ extracted_context: context, extraction_status: "completed" }).eq("id", jdId).eq("user_id", userId);
    if (error) return NextResponse.json({ error: "Không thể lưu context JD." }, { status: 500 });
    return NextResponse.json({ context });
  } catch {
    await supabase.from("job_descriptions").update({ extraction_status: "failed" }).eq("id", jdId).eq("user_id", userId);
    return NextResponse.json({ error: "Không thể phân tích JD lúc này." }, { status: 502 });
  }
}