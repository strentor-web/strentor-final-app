/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { NetworkOnly, Serwist, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Every route the app's own middleware treats as authenticated/dynamic
// (see protectedRoutes in utils/supabase/middleware.ts) plus API routes —
// these must always hit the network so a service worker never serves stale
// auth state or stale dashboard data.
const NETWORK_ONLY_PREFIXES = [
  "/api/",
  "/protected",
  "/training",
  "/fitness",
  "/profile",
  "/workouts",
  "/admin",
  "/calculator",
  "/plans",
  "/transformation",
  "/settings",
  "/personal-records",
  "/workout-plan",
  "/workout",
  "/dashboard",
  "/nutrition",
  "/company-workshops",
  "/refer",
  "/corporate-admin",
  "/onboarding",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth",
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => NETWORK_ONLY_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
