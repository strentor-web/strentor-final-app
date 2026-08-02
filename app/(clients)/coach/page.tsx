import { Metadata } from "next";
import Link from "next/link";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { getAiCoachChatHistory } from "@/actions/ai-coach/get-chat-history.action";
import { AiCoachChat } from "@/components/ai-coach/AiCoachChat";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Trainer - Strentor",
  description: "Chat with your STRENTOR AI Trainer for adaptive strength guidance, mindset support, and habit tracking.",
  robots: { index: false, follow: false },
};

export default async function AiCoachPage() {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const activeSubscription = await prisma.user_subscriptions.findFirst({
    where: {
      user_id: user.id,
      status: { in: ["ACTIVE", "AUTHENTICATED"] },
      subscription_plans: { category: "AI_COACHING" },
    },
    select: { id: true },
  });

  if (!activeSubscription) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">AI Trainer</h1>
        <p className="mt-4 text-muted-foreground">
          The AI Trainer is available with an active AI Coaching subscription.
          Add it to your plan to get adaptive strength guidance, mindset
          support, and habit tracking between sessions.
        </p>
        <Button asChild className="mt-6">
          <Link href="/programs/ai-coaching">Learn More About AI Coaching</Link>
        </Button>
      </div>
    );
  }

  const history = await getAiCoachChatHistory();

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Trainer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask about adaptive strength training, mindset, habits, or general
          nutrition and hydration education. Your AI Trainer doesn&apos;t
          diagnose, treat, or replace your care team — anything that sounds
          like a safety concern is routed straight to a human coach.
        </p>
      </div>
      <AiCoachChat initialMessages={history} />
    </div>
  );
}
