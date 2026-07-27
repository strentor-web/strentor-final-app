"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getStoredConsent, setStoredConsent, type ConsentStatus } from "@/utils/consent";

const GA_ID = "G-MBX9B1QQXM";
// Two distinct IDs were already in use in the pre-existing pixel snippet
// (one for the init call, a different one for the noscript fallback image)
// — preserved exactly as they were, not something this change altered.
const META_PIXEL_INIT_ID = "1664387287506709";
const META_PIXEL_NOSCRIPT_ID = "243297513712911";

/**
 * Gates Google Analytics and the Meta/Facebook Pixel behind an explicit
 * accept/reject choice — neither tracker loads, and no tracking request
 * leaves the browser, until the visitor accepts. Applied site-wide as a
 * conservative default (block until consent) since this app can't reliably
 * determine which jurisdiction's rules apply to a given visitor from here.
 *
 * This is an engineering default, not a legal determination — the banner
 * copy, and whether a single accept/reject choice is sufficient versus
 * per-category consent, should be reviewed by counsel before launch. See
 * STRENTOR_Privacy_Review_Required.md.
 */
export function AnalyticsConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStatus(getStoredConsent());
    setHydrated(true);
  }, []);

  function handleChoice(choice: "accepted" | "rejected") {
    setStoredConsent(choice);
    setStatus(choice);
  }

  return (
    <>
      {status === "accepted" && (
        <>
          <GoogleAnalytics gaId={GA_ID} />
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_INIT_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              alt=""
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_NOSCRIPT_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {hydrated && status === null && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie and tracking consent"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-lg sm:p-6"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              We use analytics and marketing cookies to understand site usage. They only load if
              you accept. See our{" "}
              <Link href="/privacy-policy" className="underline hover:text-primary">
                Privacy Policy
              </Link>{" "}
              for detail.
            </p>
            <div className="flex flex-shrink-0 gap-3">
              <button
                type="button"
                onClick={() => handleChoice("rejected")}
                className="rounded-full border border-input px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleChoice("accepted")}
                className="rounded-full bg-[#C9A96A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#C9A96A]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
