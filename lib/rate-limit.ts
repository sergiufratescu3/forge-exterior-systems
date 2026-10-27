import "server-only";

/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * This is sufficient for a single-process deployment (a VPS, Docker
 * container, or any host running one Node instance). It resets on restart
 * and is NOT shared across multiple instances/regions. If you deploy to a
 * multi-instance or serverless environment, swap this for a shared store
 * such as Upstash Redis (see README.md "Production hardening").
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

// Periodically sweep expired buckets so the map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    buckets.forEach((bucket, key) => {
      if (bucket.resetAt <= now) buckets.delete(key);
    });
  }, 5 * 60 * 1000).unref?.();
}
