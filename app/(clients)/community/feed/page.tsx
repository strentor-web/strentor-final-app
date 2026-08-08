import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { CommunityFeedClient } from "@/components/community/CommunityFeedClient";

export const metadata: Metadata = {
  title: "Community - Strentor",
  description: "Connect with other members of the STRENTOR community.",
  robots: { index: false, follow: false },
};

const POSTS_PER_PAGE = 20;

export default async function CommunityFeedPage() {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const posts = await prisma.community_posts.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { created_at: "desc" },
    take: POSTS_PER_PAGE,
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        where: { status: "PUBLISHED" },
        orderBy: { created_at: "asc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });

  const initialPosts = posts.map((post) => ({
    id: post.id,
    body: post.body,
    createdAt: post.created_at.toISOString(),
    authorId: post.author_id,
    authorName: post.author.name,
    comments: post.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.created_at.toISOString(),
      authorId: comment.author_id,
      authorName: comment.author.name,
    })),
  }));

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader
        title="Community"
        description="Share wins, ask questions, and connect with other STRENTOR members."
      />
      <CommunityFeedClient initialPosts={initialPosts} currentUserId={user.id} />
    </div>
  );
}
