export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  industry: string | null;
  years_experience: number | null;
  current_salary: number | null;
  desired_salary: number | null;
  location: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
};

export type InterviewSessionSummary = {
  id: string;
  title: string;
  job_title: string | null;
  mode: "text" | "voice";
  status: "in_progress" | "completed" | "abandoned";
  overall_score: number | null;
  started_at: string;
  created_at: string;
};

export type SalarySession = {
  id: string;
  user_id: string;
  job_title: string;
  industry: string | null;
  current_salary: number | null;
  desired_salary: number | null;
  minimum_salary: number | null;
  location: string | null;
  target_salary: number | null;
  opening_ask: number | null;
  walk_away: number | null;
  strategy: string | null;
  status: "in_progress" | "completed" | "abandoned";
  created_at: string;
  updated_at: string;
};