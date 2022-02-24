import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Script from "next/script";
import React from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { Sanction } from "../components/Sanction";
import { AuthProvider } from "../lib/auth/context";
import { ThemeProvider } from "../lib/utils/theme";
import "../styles/global.scss";

const PageProgress = dynamic(() => import("../components/PageProgress"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GoogleAnalytics trackingId="G-FY7502K4VH" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1944185766034883"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Sanction />
        <PageProgress />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
export default MyApp;
