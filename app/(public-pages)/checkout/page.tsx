import { Suspense } from "react";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutPageClient />
    </Suspense>
  );
}
