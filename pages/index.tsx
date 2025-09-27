// pages/index.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function EmailForm({ cta = "Join Thousands of Creators" }: { cta?: string }) {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (loading) return;

    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setToast("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setToast(null);

    const referer =
      typeof document !== "undefined" ? document.referrer || null : null;
    const user_agent =
      typeof navigator !== "undefined" ? navigator.userAgent : null;

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email: value, referer, user_agent, source: cta }]);

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("duplicate") || msg.includes("unique constraint")) {
          setToast("You're already on the list. ❤️");
        } else {
          console.error(error);
          setToast("Something went wrong. Please try again.");
        }
      } else {
        setToast("Thanks! We'll notify you when we launch.");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <form className="email-form" onSubmit={onSubmit}>
        <div className="input-group">
          <input
            type="email"
            required
            className="email-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            aria-label="Email address"
          />
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Joining…" : cta}
          </button>
        </div>
      </form>
      <p className="form-disclaimer">
        ✨ Free to start • No credit card required • Launch coming soon
      </p>

      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast}
        </div>
      )}
    </>
  );
}

export default function Home() {
  // header background on scroll
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".header");
    const onScroll = () => {
      if (!header) return;
      header.style.background =
        window.scrollY > 100
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(255, 255, 255, 0.95)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="header">
        <nav className="nav container">
          <div className="nav-brand">
            <h1 className="logo">Stack2Subs</h1>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Turn Your Substack Posts Into{" "}
              <span className="gradient-text">Viral Social Content</span>
            </h1>
            <p className="hero-subtitle">
              Paste your Substack URL and instantly generate platform-optimized
              content for X, Instagram, and LinkedIn. Each piece ends with a
              powerful call-to-action designed to grow your subscriber base.
            </p>
            <div className="hero-cta">
              <EmailForm cta="Join Thousands of Creators" />
            </div>
          </div>
        </div>
      </section>

      <section className="benefits" id="benefits">
        <div className="container">
          <h2 className="section-title">Why Creators Choose Stack2Subs</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3 className="benefit-title">Instant Optimization</h3>
              <p className="benefit-description">
                Paste your Substack URL and get platform-specific content in
                seconds.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3 className="benefit-title">Smart Analytics</h3>
              <p className="benefit-description">
                See which content variations perform best across platforms.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3 className="benefit-title">Conversion-Ready CTAs</h3>
              <p className="benefit-description">
                Every piece ends with a subscriber-focused call-to-action that
                converts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Grow Your Subscriber Base?</h2>
            <p className="cta-subtitle">
              Join thousands of newsletter creators already growing faster with
              Stack2Subs
            </p>
            <EmailForm cta="Get Early Access" />
          </div>
        </div>
      </section>
    </>
  );
}
