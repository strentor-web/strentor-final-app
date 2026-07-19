export interface SponsorshipOption {
  id: string;
  label: string;
  contributionRange: string;
}

export const sponsorshipOptions: SponsorshipOption[] = [
  { id: "sponsor_session", label: "Sponsor a Session", contributionRange: "₹2,500 – ₹5,000" },
  { id: "part_sponsor", label: "Part-Sponsor Access", contributionRange: "₹10,000 – ₹25,000" },
  { id: "sponsor_one_seat", label: "Sponsor an Access Seat (12 Weeks)", contributionRange: "₹45,000 – ₹75,000" },
  { id: "sponsor_five_seats", label: "Sponsor 5 Access Seats", contributionRange: "₹2,25,000 – ₹3,75,000" },
  { id: "sponsor_ten_seats", label: "Sponsor 10 Access Seats", contributionRange: "₹4,50,000 – ₹7,50,000" },
  { id: "csr_institutional", label: "CSR / Institutional Partnership", contributionRange: "Custom" },
];
