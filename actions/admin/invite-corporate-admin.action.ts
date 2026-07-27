"use server"

import { z } from "zod"
import { createSafeAction } from "@/lib/create-safe-action"
import { checkAdminAccess } from "@/utils/user"
import { createServiceClient } from "@/utils/supabase/service"
import prisma from "@/utils/prisma/prismaClient"
import { headers } from "next/headers"

const InviteCorporateAdminSchema = z.object({
  corporateGroupId: z.string().uuid(),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export const inviteCorporateAdmin = createSafeAction(
  InviteCorporateAdminSchema,
  async (input) => {
    let adminUser: { userId: string; role: string }
    try {
      adminUser = await checkAdminAccess()
    } catch {
      return { error: "Admin access required" }
    }

    const { corporateGroupId, email, name } = input

    const corporateGroup = await prisma.corporate_groups.findUnique({ where: { id: corporateGroupId } })
    if (!corporateGroup) return { error: "Corporate group not found" }

    try {
      const serviceClient = createServiceClient()
      const origin = (await headers()).get("origin")

      const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(email, {
        data: {
          name,
          role: "CORPORATE_ADMIN",
          corporate_group_id: corporateGroupId,
          invited_by: adminUser.userId,
          invited_at: new Date().toISOString(),
        },
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return {
        data: {
          success: true,
          message: `Invitation sent to ${email}`,
          userId: data?.user?.id,
        },
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to send invitation",
      }
    }
  }
)

export type InviteCorporateAdminInput = z.infer<typeof InviteCorporateAdminSchema>
