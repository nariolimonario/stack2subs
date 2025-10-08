import React, { useState } from "react";
import {
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaBolt,
  FaLink,
  FaCopy,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa6";

interface Variant {
  id: string;
  platform: string;
  title: string;
  content: string;
  posts: number;
  linkSlug: string;
  clicks: number;
}

export default function OptimizePage() {
  const [url, setUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["x"]);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showResults, setShowResults] = useState(false);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    if (!url.trim()) return alert("Please paste your Substack URL.");
    setLoading(true);
    setVariants([]);
    setShowResults(false);

    await new Promise((r) => setTimeout(r, 900)); // simulate

    // Mock “X” variants like the screenshot (2 columns)
    const base =
      url.replace(/https?:\/\//, "").slice(0, 40) || "substack.com/p/your-post";
    const out: Variant[] = [];

    if (selectedPlatforms.includes("x")) {
      out.push(
        {
          id: "x-auth",
          platform: "x",
          title: "Authority Builder",
          content:
            "THREAD: Why your marketing strategy is broken (and how to fix it)\n\nMost businesses waste 80% of their marketing budget on tactics that don't work.\n\nHere's what I learned after analyzing 500+ successful campaigns: 👇\n\n1/ The biggest mistake? Trying to be everywhere at once.",
          posts: 4,
          linkSlug: "thropt.co/tw-auth",
          clicks: 0,
        },
        {
          id: "x-story",
          platform: "x",
          title: "Story-Driven",
          content:
            "The $50K mistake that taught me everything about marketing\n\nLast year, I burned through our entire Q4 budget in 6 weeks.\n\nZero results. Zero leads. Zero sales.\n\nHere's what went wrong (and how you can avoid it): 👇\n\n1/ I fell for the “spray and pray” approach.",
          posts: 4,
          linkSlug: "thropt.co/tw-story",
          clicks: 0,
        }
      );
    }
    setVariants(out);
    setLoading(false);
    setShowResults(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="optimize-page container">
      <h1 className="page-title">Optimize your Substack post</h1>
      <p className="page-sub">
        Paste your Substack post URL and instantly generate platform-ready
        content for <strong>X</strong>, <strong>LinkedIn</strong> and{" "}
        <strong>Instagram</strong>.
      </p>
      <div className="gen-card">
        <div className="gen-section">
          <div className="gen-label">Select Platforms</div>
          <div className="gen-platforms">
            {[
              { key: "x", label: "Twitter/X", icon: <FaXTwitter /> },
              { key: "instagram", label: "Instagram", icon: <FaInstagram /> },
              { key: "linkedin", label: "LinkedIn", icon: <FaLinkedin /> },
            ].map(({ key, label, icon }) => {
              const active = selectedPlatforms.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => togglePlatform(key)}
                  className={`gen-platform-btn ${
                    active ? `active ${key}` : ""
                  }`}
                  aria-pressed={active}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="gen-section">
          <div className="gen-label">Substack Post URL</div>

          <div className="gen-input-row">
            <div className="gen-input-wrap">
              <FaLink className="gen-input-icon" aria-hidden="true" />
              <input
                type="url"
                placeholder="https://substack.com/home/post/p-175564772"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="gen-input"
              />
            </div>
            <button
              onClick={handleGenerate}
              className="gen-generate"
              disabled={loading}
              aria-label="Generate content variants"
            >
              <FaBolt />
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          <p className="gen-caption">
            We’ll extract the content and create optimized variants for your
            selected platforms.
          </p>
        </div>
      </div>
      {showResults && (
        <>
          <section className="variants-section">
            <h2 className="variants-title">Your Optimized Content Variants</h2>
            <p className="variants-sub">
              Each piece of content ends with a unique tracking link. Test
              across platforms to see what performs best.
            </p>

            <div className="variant-columns">
              {variants.map((v) => (
                <article className="variant-card v2" key={v.id}>
                  <div className="variant-top">
                    <button
                      className="gen-platform-btn active x small"
                      disabled
                      aria-disabled="true"
                      title="Twitter/X"
                    >
                      <FaXTwitter />
                      <span>Twitter/X</span>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => handleCopy(v.content)}
                      title="Copy"
                      aria-label="Copy content"
                    >
                      <FaCopy />
                    </button>
                  </div>

                  <h3 className="variant-h3">{v.title}</h3>

                  <div className="variant-meta">
                    <span>{v.posts} posts</span>
                    <span className="dot">•</span>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      {v.linkSlug}
                    </a>
                  </div>

                  <div className="variant-body">
                    <pre>{v.content}</pre>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="track-panel">
            <div className="track-inner">
              <div className="track-title">
                <FaChartLine />
                <span>Track Performance</span>
              </div>
              <p className="track-copy">
                Each piece of content has a unique tracking link. Monitor which
                platform and variant drives the most traffic to your Substack.
              </p>
              <button className="track-cta">View Analytics Dashboard</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
