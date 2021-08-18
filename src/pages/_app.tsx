import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import "../styles/global.scss";

const PageProgress = dynamic(() => import("../components/PageProgress"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const cl = document.body.classList;

    if (mql.matches) {
      cl.add("dark");
    }

    mql.addEventListener("change", (e) => {
      if (e.matches) {
        cl.add("dark");
      } else {
        cl.remove("dark");
      }
    });
  }, []);

  return (
    <>
      <PageProgress />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
