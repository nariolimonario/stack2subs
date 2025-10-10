const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

export async function retry<T>(
  fn: () => Promise<T>,
  times = 2,
  baseDelayMs = 400
): Promise<T> {
  for (let attempt = 0; attempt <= times; attempt++) {
    try {
      return await fn();
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status;
      const isAbort = e?.name === "AbortError";
      const retryable =
        isAbort || (typeof status === "number" && RETRYABLE.has(status));
      if (!retryable || attempt === times) throw e;
      const backoff = Math.floor(
        baseDelayMs * 2 ** attempt * (0.8 + Math.random() * 0.4)
      );
      await sleep(backoff);
    }
  }
  throw new Error("retry failed");
}
