// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          Stack2Subs – Turn Your Substack Posts Into Viral Social Content
        </title>
        <meta
          name="description"
          content="Automatically repurpose your Substack posts into platform-optimized content for X, Instagram, and LinkedIn. Grow your subscriber base with conversion-ready CTAs."
        />
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

        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <div className="site">
        <header className="header">
          <div className="container" style={{ padding: "1rem 0" }}>
            <Link href="/" className="logo">
              Stack2Subs
            </Link>
          </div>
        </header>

        <main>
          <Component {...pageProps} />
        </main>

        <footer className="footer">
          <div>© {new Date().getFullYear()} Stack2Subs</div>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <span> · </span>
            <a href="mailto:stack2subs@gmail.com">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
}
