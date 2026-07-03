
import { Providers } from "@/components/providers/Providers";
import "./globals.css";
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";
import { Metadata } from "next";

const siteUrl = "https://www.strentor.com/";

const previewImageUrl = new URL("/strentor-social-preview.jpg", siteUrl).toString();

  export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Strentor",
    description: "Your Personal Transformation Journey",
    openGraph: {
      title: "Strentor",
      description: "Your Personal Transformation Journey",
      type: "website",
      url: siteUrl,
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
      title: "Strentor",
      description: "Your Personal Transformation Journey",
      images: [previewImageUrl],
    },
    icons: {
      icon: '/favicon.ico',
    },
  }
  
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
          <Providers>
              <main className="min-h-screen">
              {children}
              </main>
          </Providers>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
          >
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1664387287506709');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              alt="Facebook Pixel"
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=243297513712911&ev=PageView&noscript=1`}
            />
          </noscript>
      </body>
      <GoogleAnalytics gaId="G-MBX9B1QQXM" />
    </html>
  );
}
