import { RegionCode } from "@/utils/region";

export interface RegionalPlan {
  id: string;
  name: string;
  positioning: string;
  frequency: string;
  description: string;
  features: string[];
  href: string;
  price: Record<RegionCode, string>;
}

// Fixed, illustrative PPP-style price points per region — not a live currency
// conversion. Review and adjust these to your actual desired regional pricing.
export const regionalPlans: RegionalPlan[] = [
  {
    id: "starter-kit",
    name: "7-Day Starter Kit",
    positioning: "A safe, structured first experience of STRENTOR coaching.",
    frequency: "One-time",
    description:
      "A low-commitment way to experience adaptive, health-respecting coaching before enrolling in a full program.",
    features: [
      "7 days of guided adaptive sessions",
      "Baseline readiness check-in",
      "Starter nutrition context",
      "Direct access to a STRENTOR coach",
    ],
    href: "/programs/starter-kit",
    price: { IN: "₹1,999", SG: "S$99", AE: "AED 249", US: "$49" },
  },
  {
    id: "flagship-transformation",
    name: "8-Week Flagship Transformation",
    positioning: "Our core coached program — strength, nutrition, and mindset.",
    frequency: "8-week program",
    description:
      "A structured, four-phase coaching program covering strength, nutrition context, mindset, and habit formation.",
    features: [
      "Weekly 1:1 coaching",
      "Custom adaptive training plan",
      "Nutrition context guidance",
      "Progress tracking and check-ins",
    ],
    href: "/programs/flagship-transformation",
    price: { IN: "₹39,999–₹74,999", SG: "S$1,299–S$2,499", AE: "AED 3,499–6,499", US: "$799–$1,499" },
  },
  {
    id: "elite-mentorship",
    name: "12-Week Elite Mentorship",
    positioning: "High-touch, deeply personalized mentorship.",
    frequency: "12-week program",
    description:
      "Direct, high-touch access to STRENTOR's founder for clients who want the most intensive level of support.",
    features: [
      "Direct founder access",
      "Highly personalized programming",
      "Priority scheduling",
      "Ongoing mindset and discipline coaching",
    ],
    href: "/programs/elite-mentorship",
    price: { IN: "₹99,999–₹2,49,999", SG: "S$3,499–S$7,999", AE: "AED 8,999–19,999", US: "$1,999–$4,999" },
  },
  {
    id: "membership",
    name: "Strength Circle Membership",
    positioning: "Ongoing community, coaching, and accountability.",
    frequency: "Monthly",
    description:
      "A recurring membership for ongoing group coaching, an adaptive workout library, and community accountability.",
    features: [
      "Adaptive workout library",
      "Monthly group coaching",
      "Community and accountability",
      "Move up or down tiers anytime",
    ],
    href: "/programs/membership",
    price: { IN: "₹2,999–₹9,999/mo", SG: "S$99–S$299/mo", AE: "AED 249–749/mo", US: "$59–$179/mo" },
  },
];
