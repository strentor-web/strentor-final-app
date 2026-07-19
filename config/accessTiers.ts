export interface AccessTier {
  id: string;
  name: string;
  priceRange: string;
  whoItsFor: string;
}

// The 12-Week STRENTOR Holistic Strength Program has one true program value —
// access is priced on a sliding, need-based scale rather than a fixed fee.
// Final tier is assigned by the STRENTOR team after reviewing an application,
// not self-selected at checkout.
export const PROGRAM_TRUE_VALUE = "₹45,000 – ₹75,000";

export const accessTiers: AccessTier[] = [
  {
    id: "fully_sponsored",
    name: "Fully Sponsored Seat",
    priceRange: "₹0 – ₹999",
    whoItsFor: "100% sponsored by donors / partners",
  },
  {
    id: "assisted",
    name: "Assisted Seat",
    priceRange: "₹3,000 – ₹7,900",
    whoItsFor: "Partial support based on need",
  },
  {
    id: "contributor",
    name: "Contributor Seat",
    priceRange: "₹9,000 – ₹14,900",
    whoItsFor: "Can contribute partially",
  },
  {
    id: "pay_it_forward",
    name: "Pay-It-Forward Seat",
    priceRange: "₹21,000 – ₹40,000",
    whoItsFor: "Support our mission + someone else",
  },
  {
    id: "full_support",
    name: "Full Support Seat",
    priceRange: "₹45,000 – ₹75,000",
    whoItsFor: "Full program value (self-supported)",
  },
];
