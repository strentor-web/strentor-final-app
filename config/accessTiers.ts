export interface AccessTier {
  id: string;
  name: string;
  price: string;
  whoItsFor: string;
}

// The 12-Week STRENTOR Holistic Strength Program has one true program value —
// access is priced on a sliding, need-based scale rather than a fixed fee.
// Final tier is assigned by the STRENTOR team after reviewing an application,
// not self-selected at checkout.
export const PROGRAM_TRUE_VALUE = "₹74,999";

export const accessTiers: AccessTier[] = [
  {
    id: "fully_sponsored",
    name: "Fully Sponsored Seat",
    price: "₹999",
    whoItsFor: "100% sponsored by donors / partners",
  },
  {
    id: "assisted",
    name: "Assisted Seat",
    price: "₹7,999",
    whoItsFor: "Partial support based on need",
  },
  {
    id: "contributor",
    name: "Contributor Seat",
    price: "₹14,999",
    whoItsFor: "Can contribute partially",
  },
  {
    id: "pay_it_forward",
    name: "Pay-It-Forward Seat",
    price: "₹39,999",
    whoItsFor: "Support our mission + someone else",
  },
  {
    id: "full_support",
    name: "Full Support Seat",
    price: "₹74,999",
    whoItsFor: "Full program value (self-supported)",
  },
];
