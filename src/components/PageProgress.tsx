import Router from "next/router";
import NProgress from "nprogress";
import React, { FunctionComponent, useEffect, useRef } from "react";

const DELAY = 250;

/**
 * NProgress for Next.js.
 */
const PageProgress: FunctionComponent = () => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  function done() {
    NProgress.done();

    if (timer.current) {
      clearTimeout(timer.current);
    }
  }

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      timer.current = setTimeout(() => NProgress.start(), DELAY);
    });
    Router.events.on("routeChangeComplete", () => done());
    Router.events.on("routeChangeError", () => done());
  }, []);

  return (
    <style jsx global>{`
      /* Make clicks pass-through */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        background: var(--cmp-page-progress);
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        // box-shadow: 0 0 10px var(--cmp-page-progress);
      }

      /* Fancy blur effect */
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px var(--cmp-page-progress),
          0 0 5px var(--cmp-page-progress);
        opacity: 1;

        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  );
};

export default PageProgress;
