export interface SponsorshipOption {
  id: string;
  label: string;
  contribution: string;
}

export const sponsorshipOptions: SponsorshipOption[] = [
  { id: "sponsor_session", label: "Sponsor a Session", contribution: "₹4,999" },
  { id: "part_sponsor", label: "Part-Sponsor Access", contribution: "₹24,999" },
  { id: "sponsor_one_seat", label: "Sponsor an Access Seat (12 Weeks)", contribution: "₹74,999" },
  { id: "sponsor_five_seats", label: "Sponsor 5 Access Seats", contribution: "₹3,74,999" },
  { id: "sponsor_ten_seats", label: "Sponsor 10 Access Seats", contribution: "₹7,49,999" },
  { id: "csr_institutional", label: "CSR / Institutional Partnership", contribution: "Custom" },
];
