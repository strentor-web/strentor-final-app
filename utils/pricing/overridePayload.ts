import { z } from "zod";
import { checkAdminAccess } from "@/utils/user";
import { CUSTOMER_SEGMENTS } from "@/utils/pppPricing";

// Shared between the overrides CRUD route and the CSV import route — kept
// out of route.ts because Next.js's route-file typing only allows
// recognized exports (GET/POST/etc.) from a file under app/api/**/route.ts.
export const payloadSchema = z
  .object({
    scopeCountry: z.string().trim().length(2).toUpperCase().optional(),
    scopeCity: z.string().trim().min(1).max(120).optional(),
    scopeSegment: z.enum(CUSTOMER_SEGMENTS).optional(),
    tierOverride: z.number().int().min(1).max(5).optional(),
    multiplierOverride: z.number().positive().max(10).optional(),
    minPriceUsd: z.number().nonnegative().optional(),
    maxPriceUsd: z.number().positive().optional(),
    isExcluded: z.boolean().optional(),
    label: z.string().trim().max(200).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
  })
  .refine((data) => !data.scopeCity || data.scopeCountry, {
    message: "A city-scoped override must also specify a country",
    path: ["scopeCity"],
  })
  .refine((data) => !(data.minPriceUsd && data.maxPriceUsd) || data.minPriceUsd <= data.maxPriceUsd, {
    message: "minPriceUsd must be less than or equal to maxPriceUsd",
    path: ["minPriceUsd"],
  });

export async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}
