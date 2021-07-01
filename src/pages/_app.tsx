import type { AppProps } from "next/app";
import React from "react";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
export default MyApp;
