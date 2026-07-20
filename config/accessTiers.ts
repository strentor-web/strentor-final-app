export interface AccessTier {
  id: string;
  name: string;
  price: string;
  whoItsFor: string;
}

// The 12-Week STRENTOR Holistic Strength Program is binary for applicants:
// a seat is either fully sponsored by donors/partners, or self-funded at
// the program's true value. Pay-It-Forward is a separate, standalone
// sponsorship action — someone funds a full seat for another person
// without needing to sign up for the program themselves. Tier is assigned
// by the STRENTOR team after reviewing an application, not self-selected
// at checkout.
export const PROGRAM_TRUE_VALUE = "₹74,999";

export const accessTiers: AccessTier[] = [
  {
    id: "fully_sponsored",
    name: "Fully Sponsored Seat",
    price: "₹0",
    whoItsFor: "100% sponsored by donors / partners",
  },
  {
    id: "self_funded",
    name: "Self-Funded Seat",
    price: "₹74,999",
    whoItsFor: "Full program value, self-supported",
  },
  {
    id: "pay_it_forward",
    name: "Pay-It-Forward Seat",
    price: "₹74,999",
    whoItsFor: "Sponsor a full seat for someone else — no sign-up needed for yourself",
  },
];
