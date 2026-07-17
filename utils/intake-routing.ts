import { EnquiryPathway } from "@/types/intake";

// Public-safe: the primary contact address shown to users and used as the
// "to" address. Internal CC routing lives only in the API route, never here.
export const PATHWAY_PRIMARY_EMAIL: Record<EnquiryPathway, string> = {
  personal: "fitassessment@strentor.com",
  family: "fitassessment@strentor.com",
  referred_candidate: "fitassessment@strentor.com",
  referral: "clientonboarding@strentor.com",
  sponsored_support: "sponsoredaccess@strentor.com",
  sponsor: "payitforward@strentor.com",
  corporate: "corporatewellness@strentor.com",
  general: "hello@strentor.com",
};

export const DEFAULT_CONTACT_EMAIL = "hello@strentor.com";
