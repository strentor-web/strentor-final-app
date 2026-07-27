
import { Providers } from "@/components/providers/Providers";
import "./globals.css";
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import Script from "next/script";
import { Metadata } from "next";
import { AnalyticsConsent } from "@/components/consent/AnalyticsConsent";

const siteUrl = "https://www.strentor.com/";

const previewImageUrl = new URL("/strentor-social-preview.jpg", siteUrl).toString();

const defaultTitle = "Strentor | Premium Performance Coaching for Wheelchair Users";
const defaultDescription =
  "STRENTOR is a premium strength, mindset, and purpose coaching brand for ambitious wheelchair users in India, the UAE, and Singapore. Founder-led by Aditya Mandan, a wheelchair user and national-level para powerlifter.";

  export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: "%s | Strentor",
    },
    description: defaultDescription,
    keywords: [
      "wheelchair fitness coach India",
      "online wheelchair fitness coaching",
      "fitness for wheelchair users",
      "spina bifida fitness coaching",
      "CKD-aware fitness coaching",
      "adaptive strength coaching",
      "seated strength training",
      "wheelchair strength program",
      "adaptive nutrition guidance",
      "para powerlifter coach",
      "Strentor",
    ],
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: "website",
      url: siteUrl,
      siteName: "Strentor",
      images: [
        {
          url: previewImageUrl,
          width: 1200,
          height: 1200,
          alt: "Strentor logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [previewImageUrl],
    },
    icons: {
      icon: '/favicon.ico',
    },
  }

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Strentor",
  url: siteUrl,
  logo: new URL("/strentor-icon.png", siteUrl).toString(),
  description: defaultDescription,
  founder: {
    "@type": "Person",
    name: "Aditya Mandan",
    jobTitle: "Founder & Fitness Coach",
    description: "National-level para powerlifter and certified fitness trainer.",
  },
  sameAs: [
    "https://www.facebook.com/strentor/",
    "https://in.linkedin.com/company/strentor",
    "https://www.instagram.com/strentor/",
    "https://www.youtube.com/@STRENTOR",
  ],
};
  
  const satoshi = localFont({
    display: 'swap',
    src: [
      {
        path: '../public/fonts/satoshi.ttf',
        weight: '300 900',
        style: 'normal',
      },
    ],
    variable: '--font-satoshi',
    fallback: ['system-ui', 'arial'],
  });

  const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-display',
    fallback: ['Georgia', 'serif'],
  });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${playfairDisplay.variable} font-satoshi`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Skip to main content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <Providers>
              <main id="main-content" className="min-h-screen">
              {children}
              </main>
          </Providers>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <AnalyticsConsent />
      </body>
    </html>
  );
}
