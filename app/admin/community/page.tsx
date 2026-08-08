import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  CommunityModerationList,
  type ModerationPost,
} from "@/components/admin/community/CommunityModerationList";

export const metadata: Metadata = {
  title: "Community Moderation - Admin - Strentor",
  description: "Review and moderate community posts and comments.",
  robots: { index: false, follow: false },
};

export default async function AdminCommunityPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

  const posts = await prisma.community_posts.findMany({
    orderBy: { created_at: "desc" },
    take: 100,
    include: {
      author: { select: { name: true, email: true } },
      comments: {
        orderBy: { created_at: "asc" },
        include: { author: { select: { name: true, email: true } } },
      },
    },
  });

  const rows: ModerationPost[] = posts.map((post) => ({
    id: post.id,
    body: post.body,
    status: post.status,
    hiddenReason: post.hidden_reason,
    authorName: post.author.name,
    authorEmail: post.author.email,
    createdAt: post.created_at.toISOString(),
    comments: post.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      status: comment.status,
      authorName: comment.author.name,
      authorEmail: comment.author.email,
      createdAt: comment.created_at.toISOString(),
    })),
  }));

  return (
    <div className="container py-8 space-y-6">
      <DashboardPageHeader
        title="Community Moderation"
        description="Hide posts or comments that violate community guidelines."
      />
      <CommunityModerationList posts={rows} />
    </div>
  );
}
