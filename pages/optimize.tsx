import React, { useState } from "react";
import {
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaBolt,
  FaLink,
  FaCopy,
  FaChartLine,
} from "react-icons/fa6";

type GenOutput = {
  x: { style: "authority" | "story" | string; items: string[] }[];
  linkedin: { headline: string; body: string }[];
  instagram: { caption: string }[];
};

export default function OptimizePage() {
  const [url, setUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["x"]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GenOutput | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [busy, setBusy] = useState(false);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  function withLink(s: string) {
    // Replace the model placeholder with the actual URL
    return s.replace(/{{\s*LINK\s*}}/g, url || "");
  }

  async function handleGenerate() {
    if (busy) return;
    setBusy(true);
    setLoading(true);
    if (!url) return;
    if (selectedPlatforms.length === 0) return;

    setLoading(true);
    try {
      // 1) Extract content
      const er = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const extracted = await er.json();
      if (!er.ok) throw new Error(extracted?.error || "Extract failed");

      // 2) Generate variants
      const gr = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: extracted.title,
          text: extracted.text,
          platforms: selectedPlatforms, // ["x","linkedin","instagram"]
        }),
      });
      const gen = (await gr.json()) as GenOutput;
      if (!gr.ok) throw new Error((gen as any)?.error || "Generate failed");

      setGenerated(gen);
      setShowResults(true);
    } catch (e) {
      console.error(e);
      // TODO: surface toast/UI error
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }

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
              disabled={loading || busy}
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
      {showResults && generated && (
        <>
          <section className="variants-section">
            <h2 className="variants-title">Your Optimized Content Variants</h2>
            <p className="variants-sub">
              Each piece of content ends with a unique tracking link. Test
              across platforms to see what performs best.
            </p>
            {generated.x?.length > 0 && (
              <>
                <h3 className="section-title" style={{ marginTop: "2rem" }}>
                  X Variants
                </h3>
                <div className="variant-columns">
                  {generated.x.map((tw, i) => {
                    const text = withLink(tw.items.join("\n\n"));
                    return (
                      <article className="variant-card v2" key={`x-${i}`}>
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
                            onClick={() => handleCopy(text)}
                            title="Copy"
                            aria-label="Copy content"
                          >
                            <FaCopy />
                          </button>
                        </div>

                        <h3 className="variant-h3">
                          {tw.style === "story"
                            ? "Story-Driven"
                            : "Authority Builder"}
                        </h3>

                        <div className="variant-body">
                          <pre>{text}</pre>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
            {generated.linkedin?.length > 0 && (
              <>
                <h3 className="section-title" style={{ marginTop: "2rem" }}>
                  LinkedIn Variant
                </h3>
                <div className="variant-columns">
                  {generated.linkedin.map((li, i) => {
                    const text = withLink(`${li.headline}\n\n${li.body}`);
                    return (
                      <article className="variant-card v2" key={`li-${i}`}>
                        <div className="variant-top">
                          <button
                            className="gen-platform-btn active linkedin small"
                            disabled
                            aria-disabled="true"
                            title="LinkedIn"
                          >
                            <FaLinkedin />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleCopy(text)}
                            title="Copy"
                            aria-label="Copy content"
                          >
                            <FaCopy />
                          </button>
                        </div>

                        <h3 className="variant-h3">{li.headline}</h3>
                        <div className="variant-body">
                          <pre>{text}</pre>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
            {generated.instagram?.length > 0 && (
              <>
                <h3 className="section-title" style={{ marginTop: "2rem" }}>
                  Instagram Caption
                </h3>
                <div className="variant-columns">
                  {generated.instagram.map((ig, i) => {
                    const text = withLink(ig.caption);
                    return (
                      <article className="variant-card v2" key={`ig-${i}`}>
                        <div className="variant-top">
                          <button
                            className="gen-platform-btn active instagram small"
                            disabled
                            aria-disabled="true"
                            title="Instagram"
                          >
                            <FaInstagram />
                            <span>Instagram</span>
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleCopy(text)}
                            title="Copy"
                            aria-label="Copy content"
                          >
                            <FaCopy />
                          </button>
                        </div>

                        <h3 className="variant-h3">Caption</h3>
                        <div className="variant-body">
                          <pre>{text}</pre>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
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
