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
