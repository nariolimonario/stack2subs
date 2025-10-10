// pages/api/extract.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { htmlToText } from "html-to-text";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL parameter." });
  }

  try {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36";

    const response = await fetch(url, {
      headers: { "User-Agent": ua, "Accept-Language": "en-US,en;q=0.9" },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch URL (${response.status})` });
    }

    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    const reader = new Readability(doc, { debug: false });
    const article = reader.parse();

    if (!article || !article.content) {
      return res
        .status(422)
        .json({ error: "Could not extract readable content." });
    }

    const text = htmlToText(article.content, {
      wordwrap: 120,
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", format: "skip" },
      ],
    });

    res.status(200).json({
      title: article.title ?? "Untitled",
      author: article.byline ?? null,
      siteName: article.siteName ?? null,
      excerpt: article.excerpt ?? null,
      length: article.length ?? null,
      text,
      html: article.content,
      sourceUrl: url,
    });
  } catch (err: any) {
    console.error("extract error:", err);
    res.status(500).json({
      error: "Server error extracting content",
      details: err?.message,
    });
  }
}
