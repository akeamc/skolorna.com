import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Script from "next/script";
import React from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { Sanction } from "../components/Sanction";
import { ThemeProvider } from "../lib/utils/theme";
import "../styles/global.scss";

const PageProgress = dynamic(() => import("../components/PageProgress"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GoogleAnalytics trackingId="G-FY7502K4VH" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1944185766034883"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <Sanction />
      <PageProgress />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;
