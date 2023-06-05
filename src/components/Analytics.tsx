"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const MEASUREMENT_ID = "G-FY7502K4VH";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gtag) return;
    gtag("config", MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
