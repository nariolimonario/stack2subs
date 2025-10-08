// pages/index.tsx
import React, { useEffect } from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import TrustedBy from "@/components/TrustedBy";

type Props = {
  avatarPaths: string[];
};

export default function Home({
  avatarPaths,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Turn Your Substack Posts Into{" "}
              <span className="gradient-text">Viral Social Content</span>
            </h1>
            <p className="hero-subtitle">
              Paste your Substack URL and instantly generate platform-optimized
              content for X, Instagram and LinkedIn. Each piece ends with a
              subscriber-focused call-to-action.
            </p>

            <div className="hero-cta">
              <Link href="/optimize" className="cta-button cta-button--lg">
                Start optimizing
              </Link>
            </div>
            <TrustedBy
              avatars={avatarPaths}
              show={6}
              label="1,200+ creators growing with Stack2Subs"
            />
          </div>
        </div>
      </section>
      <section className="benefits" id="how-it-works">
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
                Compare performance across platforms and variants (coming soon).
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3 className="benefit-title">Conversion-Ready CTAs</h3>
              <p className="benefit-description">
                Every piece ends with a clear CTA back to your Substack.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to grow your subscriber base?</h2>
            <p className="cta-subtitle">
              Turn one newsletter into high-performing posts for X, Instagram
              and LinkedIn.
            </p>
            <Link href="/optimize" className="cta-button cta-button--lg">
              Start optimizing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dir = path.join(process.cwd(), "public", "avatars");

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f));
  } catch {
    // folder missing/empty is fine; we'll just render without avatars
  }

  const avatarPaths = files.map((f) => `/avatars/${f}`);

  return {
    props: { avatarPaths },
    revalidate: 60, // optional: refresh list if you add/remove files
  };
};
