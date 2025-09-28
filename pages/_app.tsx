// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head"; // 👈 import Head
import "../styles/globals.css";
import Link from "next/link"; // add this at the top

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Basic SEO */}
        <title>
          Stack2Subs – Turn Your Substack Posts Into Viral Social Content
        </title>
        <meta
          name="description"
          content="Automatically repurpose your Substack posts into platform-optimized content for X, Instagram, and LinkedIn. Grow your subscriber base with conversion-ready CTAs."
        />
        <meta
          name="keywords"
          content="substack, ai, content repurposing, newsletter growth"
        />
        <meta name="author" content="Stack2Subs" />

        {/* Open Graph for social sharing */}
        <meta
          property="og:title"
          content="Stack2Subs – Viral Social Content from Your Substack"
        />
        <meta
          property="og:description"
          content="Repurpose your Substack posts instantly into shareable, subscriber-focused content for X, Instagram, and LinkedIn."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stack2subs.com" />
        <meta
          property="og:image"
          content="https://stack2subs.com/og-image.png"
        />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Stack2Subs – Viral Social Content from Your Substack"
        />
        <meta
          name="twitter:description"
          content="Repurpose your Substack posts instantly into shareable, subscriber-focused content for X, Instagram, and LinkedIn."
        />
        <meta
          name="twitter:image"
          content="https://stack2subs.com/og-image.png"
        />

        {/* Favicon & PWA */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
      <footer className="footer">
        <p>© 2025 Stack2Subs</p>
        <p>
          <Link href="/privacy">Privacy Policy</Link> |{" "}
          <a href="mailto:stack2subs@gmail.com">Contact</a>
        </p>
      </footer>
    </>
  );
}
