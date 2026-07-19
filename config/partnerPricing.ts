export interface PartnerPricingOption {
  id: string;
  label: string;
  price: string;
}

export const partnerPricingOptions: PartnerPricingOption[] = [
  { id: "first_awareness_workshop", label: "First Awareness Workshop", price: "Free" },
  { id: "additional_online_workshop", label: "Additional Online Workshop", price: "₹14,999" },
  { id: "deep_workshop", label: "90-Min Deep Workshop", price: "₹29,999" },
  { id: "half_day_workshop", label: "Half-Day Workshop + Readiness", price: "₹59,999" },
  { id: "pilot_3_person", label: "3-Person Pilot Program (12 Weeks)", price: "₹74,999" },
  { id: "pilot_5_person", label: "5-Person Pilot Program (12 Weeks)", price: "₹1,24,999" },
  { id: "pilot_10_person", label: "10-Person Pilot Program (12 Weeks)", price: "₹2,49,999" },
  { id: "custom_csr", label: "Custom CSR / Institutional Partnership", price: "Custom" },
];
