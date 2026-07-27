"use server"

import { z } from "zod";
import { createSafeAction } from "@/lib/create-safe-action";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import prisma from "@/utils/prisma/prismaClient";
import { headers } from "next/headers";

const InviteEmployeeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const inviteEmployee = createSafeAction(
  InviteEmployeeSchema,
  async (input) => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: "Authentication required" };

    const adminProfile = await prisma.users_profile.findUnique({
      where: { id: user.id },
      select: { role: true, corporate_group_id: true },
    });

    if (adminProfile?.role !== "CORPORATE_ADMIN" || !adminProfile.corporate_group_id) {
      return { error: "Corporate admin access required" };
    }

    const corporateGroup = await prisma.corporate_groups.findUnique({
      where: { id: adminProfile.corporate_group_id },
    });
    if (!corporateGroup) return { error: "Corporate account not found" };

    if (corporateGroup.member_limit) {
      const currentEmployeeCount = await prisma.users_profile.count({
        where: { corporate_group_id: corporateGroup.id, role: "CORPORATE_EMPLOYEE" },
      });
      if (currentEmployeeCount >= corporateGroup.member_limit) {
        return { error: `Your plan is limited to ${corporateGroup.member_limit} employees. Contact STRENTOR to add more seats.` };
      }
    }

    const { email, name } = input;

    try {
      const serviceClient = createServiceClient();
      const origin = (await headers()).get("origin");

      const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(email, {
        data: {
          name,
          role: "CORPORATE_EMPLOYEE",
          corporate_group_id: corporateGroup.id,
          invited_by: user.id,
          invited_at: new Date().toISOString(),
        },
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {
        data: {
          success: true,
          message: `Invitation sent to ${email}`,
          userId: data?.user?.id,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to send invitation",
      };
    }
  }
);

export type InviteEmployeeInput = z.infer<typeof InviteEmployeeSchema>;
