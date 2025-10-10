// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { allow } from "@/lib/ratelimit";
import { hash } from "@/lib/hash";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";
import { supabase } from "@/lib/supabaseClient";
import { retry } from "@/utils/retry";
import { logLLMUsage, tokensFromChars, calcCostUSD } from "@/lib/llmUsage";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const PROMPT_VERSION = 1; // bump if you change prompt templates

type Platform = "x" | "linkedin" | "instagram";
type GenBody = {
  title?: string;
  text: string;
  platforms?: Platform[];
  link?: string;
};

const ROUTE = "/api/generate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  if (!allow(ip, 10, 60_000)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not set" });
  }

  const { text, title, link } = (req.body || {}) as GenBody;
  let platforms = (req.body?.platforms || [
    "x",
    "linkedin",
    "instagram",
  ]) as Platform[];

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text" });
  }
  platforms = platforms.filter((p): p is Platform =>
    ["x", "linkedin", "instagram"].includes(p as string)
  );
  if (platforms.length === 0) platforms = ["x"];

  // normalize inputs (stable cache keys + bounded cost)
  const safeTitle = (title || "").trim().slice(0, 200);
  const safeText = text.replace(/\s+/g, " ").trim().slice(0, 8000);

  // cache key
  const cache_key = hash(
    JSON.stringify({
      v: PROMPT_VERSION,
      model: MODEL,
      platforms,
      title: safeTitle,
      text: safeText.slice(0, 4000),
    })
  );

  // 1) Check cache
  try {
    const { data: cached, error: cacheErr } = await supabase
      .from("generations")
      .select("payload")
      .eq("key", cache_key)
      .maybeSingle();

    if (!cacheErr && cached?.payload) {
      // Log a cheap cache hit (no cost)
      await logLLMUsage({
        route: ROUTE,
        cache_key,
        model: MODEL,
        input_chars: safeText.length,
        cost_usd: 0,
        meta: { served_from_cache: true },
      });
      return res.status(200).json(injectLink(cached.payload, link));
    }
  } catch (e) {
    console.error("Cache read error:", e);
  }

  // 2) Build prompt
  const system = `
You are a content repurposing assistant. Convert a Substack article into platform-optimized posts.

Rules:
- Keep author voice; be succinct.
- Always include a clear CTA back to the Substack post (use a placeholder {{LINK}}).
- For X: 1-2 high-signal threads with numbered tweets (<=280 chars each).
- For LinkedIn: 1 long-form post with hooks, whitespace, and 3-5 bullets.
- For Instagram: 1 caption with line breaks, 1-2 emojis per paragraph, and a CTA.
- Avoid hashtags except 1-3 tasteful ones on Instagram.

Return ONLY valid JSON matching this TypeScript type:

type Output = {
  x: { style: "authority" | "story"; items: string[] }[];
  linkedin: { headline: string; body: string }[];
  instagram: { caption: string }[];
};
  `.trim();

  const user = `
Title: ${safeTitle || "(unknown)"}

Article:
${safeText}
  `.trim();

  // 3) Call OpenAI (+ timeout + retry)
  const started = Date.now();
  let openaiJson: any = {};
  let usagePromptTokens = 0;
  let usageCompletionTokens = 0;
  let requestId: string | undefined;

  try {
    const r = await retry(
      async () => {
        const resp = await fetchWithTimeout(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: MODEL,
              temperature: 0.7,
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: system },
                { role: "user", content: user },
              ],
            }),
          },
          45_000
        );
        if (!resp.ok) {
          const err = new Error(
            `OpenAI HTTP ${resp.status}: ${await resp.text()}`
          );
          // mark transient 429/5xx as retriable by throwing
          if (resp.status === 429 || resp.status >= 500) throw err;
          // non-transient → still throw, but won't be retried
          throw err;
        }
        return resp;
      },
      1,
      400 // one retry on 429/5xx
    );

    requestId = r.headers.get("x-request-id") ?? undefined;

    const data = await r.json();

    // usage (if provided by API)
    usagePromptTokens = data?.usage?.prompt_tokens ?? 0;
    usageCompletionTokens = data?.usage?.completion_tokens ?? 0;

    const content = data?.choices?.[0]?.message?.content ?? "{}";
    openaiJson = safeParseJson(content);
  } catch (e: any) {
    // log failed attempt (no cost)
    await logLLMUsage({
      route: ROUTE,
      cache_key,
      model: MODEL,
      input_chars: safeText.length,
      cost_usd: 0,
      meta: {
        status: "error",
        message: e?.message ?? String(e),
        latency_ms: Date.now() - started,
      },
    });
    console.error("OpenAI request failed:", e);
    return res
      .status(502)
      .json({ error: "Model request failed", details: e?.message });
  }

  // 4) Shape result for requested platforms
  const fullOutput = {
    x: platforms.includes("x") ? openaiJson?.x ?? [] : [],
    linkedin: platforms.includes("linkedin") ? openaiJson?.linkedin ?? [] : [],
    instagram: platforms.includes("instagram")
      ? openaiJson?.instagram ?? []
      : [],
  };

  // 5) Cache response (best effort)
  try {
    await supabase
      .from("generations")
      .insert({ key: cache_key, payload: fullOutput });
  } catch (e) {
    console.error("Cache write error:", e);
  }

  // 6) Log usage (+cost estimate)
  // If API didn't return token usage, estimate from chars.
  const promptTokens = usagePromptTokens || tokensFromChars(safeText.length);
  const completionTokens = usageCompletionTokens || 0; // we don't know actual completions; keep 0 unless API returns usage

  const cost_usd = calcCostUSD({
    promptTokens,
    completionTokens,
    // you can also pass inPer1K/outPer1K explicitly here if you prefer:
    // inPer1K: 0.15, outPer1K: 0.6
  });

  await logLLMUsage({
    route: ROUTE,
    cache_key,
    model: MODEL,
    input_chars: safeText.length,
    cost_usd,
    meta: {
      status: "ok",
      latency_ms: Date.now() - started,
      request_id: requestId,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      served_from_cache: false,
    },
  });

  // 7) Return output (inject link placeholders if provided)
  return res.status(200).json(injectLink(fullOutput, link));
}

/** Safe JSON parse; tries to salvage the first {...} block if the model adds prose. */
function safeParseJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    const m = s.match(/\{[\s\S]*\}$/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
    return {};
  }
}

/** Replace {{LINK}} placeholders if caller supplied a link. */
function injectLink<T = any>(output: T, link?: string): T {
  if (!link) return output;
  const replacer = (v: unknown): unknown => {
    if (typeof v === "string") return v.replaceAll("{{LINK}}", link);
    if (Array.isArray(v)) return v.map(replacer);
    if (v && typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) o[k] = replacer(val);
      return o;
    }
    return v;
  };
  return replacer(output) as T;
}
