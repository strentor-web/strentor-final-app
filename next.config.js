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
      { source: "/coaching", destination: "/programs", permanent: true },
      { source: "/plans-pricing", destination: "/programs", permanent: true },
      { source: "/corporate", destination: "/partner-with-us", permanent: true },
      { source: "/pay-it-forward", destination: "/sponsor-a-seat", permanent: true },
      { source: "/resources", destination: "/community", permanent: true },
    ];
  },
};

export default nextConfig;
