"use client";

import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { trackEvent, type AnalyticsEvent, type AnalyticsParams } from "@/utils/analytics";

interface TrackedLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  event: AnalyticsEvent;
  eventParams?: AnalyticsParams;
}

// A plain next/link that also fires a GA event on click — used for CTAs
// whose conversion-funnel position we want visibility into (see
// STRENTOR_Analytics_Events.md). Forwards its ref so it still works as the
// direct child of Button's asChild (Radix Slot).
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ event, eventParams, onClick, ...linkProps }, ref) => {
    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
      trackEvent(event, eventParams);
      onClick?.(e);
    }
    return <Link ref={ref} onClick={handleClick} {...linkProps} />;
  }
);
TrackedLink.displayName = "TrackedLink";
