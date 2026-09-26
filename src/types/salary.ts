export type SalaryMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sequence: number;
  created_at: string;
};