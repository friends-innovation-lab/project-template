import { createClient } from "@supabase/supabase-js";

export const mockSupabaseClient = createClient(
  "http://localhost:54321",
  "mock-anon-key-for-storybook",
);
