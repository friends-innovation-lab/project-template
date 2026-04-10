Object.defineProperty(process.env, "NEXT_PUBLIC_SUPABASE_URL", {
  value: "http://localhost:54321",
  writable: true,
});

Object.defineProperty(process.env, "NEXT_PUBLIC_SUPABASE_ANON_KEY", {
  value: "mock-anon-key-for-storybook",
  writable: true,
});
