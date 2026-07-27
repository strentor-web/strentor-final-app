import { redirect } from "next/navigation";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

/**
 * Validates the caller is a CORPORATE_ADMIN and resolves the corporate
 * group they belong to. A CORPORATE_ADMIN with no corporate_group_id set
 * is a data-setup problem (see app/admin/corporate — an ADMIN must assign
 * a group), not a normal state, so it redirects rather than rendering an
 * empty dashboard.
 */
export async function requireCorporateAdminGroup() {
  const { user } = await validateServerRole(["CORPORATE_ADMIN"]);

  const profile = await prisma.users_profile.findUnique({
    where: { id: user.id },
    select: { corporate_group_id: true },
  });

  if (!profile?.corporate_group_id) {
    redirect("/unauthorized");
  }

  const corporateGroup = await prisma.corporate_groups.findUnique({
    where: { id: profile.corporate_group_id },
  });

  if (!corporateGroup) {
    redirect("/unauthorized");
  }

  return { user, corporateGroup };
}
