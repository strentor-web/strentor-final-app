-- CreateEnum
CREATE TYPE "public"."CommunityContentStatus" AS ENUM ('PUBLISHED', 'HIDDEN');

-- CreateTable
CREATE TABLE "public"."community_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "status" "public"."CommunityContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "hidden_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "status" "public"."CommunityContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityPost_status_createdAt_idx" ON "public"."community_posts"("status", "created_at");

-- CreateIndex
CREATE INDEX "CommunityComment_postId_createdAt_idx" ON "public"."community_comments"("post_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "CommunityComment_postId_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_comments" ADD CONSTRAINT "CommunityComment_authorId_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
