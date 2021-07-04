import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import "../styles/global.scss";

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

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
export default MyApp;
