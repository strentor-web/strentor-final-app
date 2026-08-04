import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import { ContentDraftForm } from "@/components/admin/content/ContentDraftForm";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Content Drafts - Admin - Strentor",
  description: "Draft blog posts and social captions from a topic and outline.",
  robots: { index: false, follow: false },
};

export default async function AdminContentDraftsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

  return (
    <div className="container py-8 space-y-6">
      <DashboardPageHeader
        title="Content Drafts"
        description="Draft a blog post or social captions from a topic. Nothing here publishes automatically — copy the draft into your own workflow."
      />
      <ScrollReveal>
        <ContentDraftForm />
      </ScrollReveal>
    </div>
  );
}
