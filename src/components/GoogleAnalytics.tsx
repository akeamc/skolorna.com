import { useRouter } from "next/router";
import Script from "next/script";
import React, { FunctionComponent, useEffect } from "react";

export interface GoogleAnalyticsProps {
  trackingId: string;
  enable?: boolean;
}

/**
 * Google Analytics tracking snippet, as a React component. Handy, right?
 *
 * @param {React.PropsWithChildren<GoogleAnalyticsProps>} props Props.
 *
 * @returns {React.ReactElement} The rendered code.
 */
const GoogleAnalytics: FunctionComponent<GoogleAnalyticsProps> = ({
  trackingId,
  enable = process.env.ENABLE_GOOGLE_ANALYTICS,
}) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if ((window as any).gtag) {
        (window as any).gtag("config", trackingId, {
          page_path: url,
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Failed to log page view for ${url}`);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, trackingId]);

  useEffect(() => {
    if (!enable) {
      // eslint-disable-next-line no-console
      console.warn("Google Analytics is disabled");
    }
  }, [enable]);

  if (!enable) {
    return null;
  }

  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
