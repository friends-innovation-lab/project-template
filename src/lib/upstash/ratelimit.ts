import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Returns null if Upstash is not configured — allows local dev without Redis
function createRatelimiter() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.warn("Upstash not configured — rate limiting disabled");
    return null;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
    analytics: true,
  });
}

export const ratelimit = createRatelimiter();

// Helper to use in API routes
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!ratelimit) return true; // Pass through if not configured
  const { success } = await ratelimit.limit(identifier);
  return success;
}
