import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: [
      "zunoqjiwhyzimcayolyu.supabase.co",  // Add your Supabase domain here
      "images.unsplash.com",  // Allow Unsplash images
    ],
  },
  async redirects() {
    return [
      { source: "/pay-it-forward", destination: "/sponsor-a-seat", permanent: true },
    ];
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
