export type JobDescription = {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  raw_content: string;
  extraction_status: "pending" | "processing" | "completed" | "failed";
  extracted_context: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};