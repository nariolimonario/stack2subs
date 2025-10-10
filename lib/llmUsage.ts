// lib/llmUsage.ts
import { supabase } from "@/lib/supabaseClient";

/** Cheap token guess: ~4 chars ≈ 1 token (good enough if API doesn't return usage) */
export const tokensFromChars = (chars: number) =>
  Math.max(0, Math.round(chars / 4));

/** Simple cost calculator using env knobs (so you don't hardcode vendor pricing) */
export function calcCostUSD(opts: {
  promptTokens?: number;
  completionTokens?: number;
  // $ per 1K tokens
  inPer1K?: number;
  outPer1K?: number;
}) {
  const inPer1K = opts.inPer1K ?? Number(process.env.PRICING_INPUT_PER_1K ?? 0);
  const outPer1K =
    opts.outPer1K ?? Number(process.env.PRICING_OUTPUT_PER_1K ?? 0);

  const inCost = ((opts.promptTokens ?? 0) / 1000) * inPer1K;
  const outCost = ((opts.completionTokens ?? 0) / 1000) * outPer1K;
  return Number((inCost + outCost).toFixed(6));
}

/** Insert a usage row; never throw (errors are swallowed + logged). */
export async function logLLMUsage(row: {
  route: string;
  cache_key?: string | null;
  model?: string | null;
  input_chars?: number | null;
  cost_usd?: number | null;
  meta?: Record<string, any> | null;
}) {
  try {
    await supabase.from("llm_usage").insert({
      route: row.route,
      cache_key: row.cache_key ?? null,
      model: row.model ?? null,
      input_chars: row.input_chars ?? null,
      cost_usd: row.cost_usd ?? null,
      meta: row.meta ?? null,
    });
  } catch (e) {
    console.error("llm_usage insert failed:", e);
  }
}
