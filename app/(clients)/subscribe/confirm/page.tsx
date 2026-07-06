import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { SubscribeConfirmClient } from "@/components/subscription/subscribe-confirm-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Your Plan - Strentor",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function SubscribeConfirmPage() {
  const { user } = await validateServerRole(["CLIENT"]);

  const profile = await prisma.users_profile.findUnique({
    where: { id: user.id },
    select: { email: true, phone: true },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <SubscribeConfirmClient
        userEmail={profile?.email ?? ""}
        userPhone={profile?.phone ?? null}
      />
    </div>
  );
}
