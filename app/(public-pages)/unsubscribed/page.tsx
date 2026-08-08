import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Unsubscribed - Strentor",
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold font-display text-foreground sm:text-4xl">You're unsubscribed</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          You won't receive any more automated follow-up emails from STRENTOR. If you'd still like to
          talk to us, feel free to reach out anytime.
        </p>
      </section>
      <Footer />
    </div>
  );
}
