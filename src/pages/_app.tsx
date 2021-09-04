import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React from "react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { ThemeProvider } from "../lib/utils/theme";
import "../styles/global.scss";

const PageProgress = dynamic(() => import("../components/PageProgress"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GoogleAnalytics trackingId="G-FY7502K4VH" />
      <PageProgress />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;
