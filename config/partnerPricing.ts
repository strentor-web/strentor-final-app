export interface PartnerPricingOption {
  id: string;
  label: string;
  priceRange: string;
}

export const partnerPricingOptions: PartnerPricingOption[] = [
  { id: "first_awareness_workshop", label: "First Awareness Workshop", priceRange: "Free" },
  { id: "additional_online_workshop", label: "Additional Online Workshop", priceRange: "₹7,500 – ₹15,000" },
  { id: "deep_workshop", label: "90-Min Deep Workshop", priceRange: "₹15,000 – ₹30,000" },
  { id: "half_day_workshop", label: "Half-Day Workshop + Readiness", priceRange: "₹30,000 – ₹60,000" },
  { id: "pilot_3_person", label: "3-Person Pilot Program (12 Weeks)", priceRange: "₹45,000 – ₹75,000" },
  { id: "pilot_5_person", label: "5-Person Pilot Program (12 Weeks)", priceRange: "₹75,000 – ₹1,25,000" },
  { id: "pilot_10_person", label: "10-Person Pilot Program (12 Weeks)", priceRange: "₹1,50,000 – ₹2,50,000" },
  { id: "custom_csr", label: "Custom CSR / Institutional Partnership", priceRange: "Custom" },
];
