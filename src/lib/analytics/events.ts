import type { SupabaseClient } from "@supabase/supabase-js";

export type AnalyticsEventName = "user_registered" | "interview_started" | "interview_completed" | "voice_started" | "voice_completed" | "salary_started" | "salary_completed";

export async function trackEvent(supabase: SupabaseClient, userId: string, eventName: AnalyticsEventName, metadata: Record<string, string | number | boolean> = {}) {
  await supabase.from("analytics_events").insert({ user_id: userId, event_name: eventName, metadata });
}