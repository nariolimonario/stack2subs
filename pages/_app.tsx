import type { AppProps } from "next/app";
import "../styles/globals.css"; // make sure this file exists
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
