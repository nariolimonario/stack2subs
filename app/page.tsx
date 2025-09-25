// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";

function EmailForm({ cta = "Join Thousands of Creators" }: { cta?: string }) {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: send `email` to your backend / waitlist API
    // e.g., await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) });
    console.log("Email submitted:", email);

    setToast("Thanks! We'll notify you when we launch.");
    setEmail("");
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
          />
          <button type="submit" className="cta-button">
            {cta}
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

export default function Page() {
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
              content for Twitter, Instagram, and LinkedIn. Each piece ends with
              a powerful call-to-action designed to grow your subscriber base.
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
                seconds. No more spending hours adapting your posts for
                different social platforms.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3 className="benefit-title">Smart Analytics</h3>
              <p className="benefit-description">
                See which content variations perform best across platforms.
                Track engagement, clicks and most importantly — new subscribers.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3 className="benefit-title">Conversion-Ready CTAs</h3>
              <p className="benefit-description">
                Every piece ends with a subscriber-focused call-to-action that
                actually converts. Stop losing potential subscribers to weak
                endings.
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
              Join thousands of newsletter creators who are already growing
              faster with Stack2Subs
            </p>
            <EmailForm cta="Get Early Access" />
          </div>
        </div>
      </section>
    </>
  );
}
