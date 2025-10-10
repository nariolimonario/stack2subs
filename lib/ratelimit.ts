const buckets = new Map<string, { count: number; reset: number }>();

export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count < max) {
    b.count += 1;
    return true;
  }
  return false;
}
