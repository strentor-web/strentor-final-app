-- STRENTOR Adaptive Transformation Academy — Phase 6 (corporate + elite expansion).
-- See App Builder Requirement Document section 12.

-- CreateEnum
CREATE TYPE "public"."MentorshipApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- CreateTable
CREATE TABLE "public"."corporate_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "plan_type" TEXT,
    "member_limit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corporate_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."corporate_inquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "employee_count" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corporate_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentorship_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "goals" TEXT NOT NULL,
    "current_challenges" TEXT,
    "desired_support" TEXT,
    "readiness_score" INTEGER,
    "status" "public"."MentorshipApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" UUID,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentorship_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MentorshipApplication_userId_idx" ON "public"."mentorship_applications"("user_id");

-- AddForeignKey
ALTER TABLE "public"."mentorship_applications" ADD CONSTRAINT "MentorshipApplication_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mentorship_applications" ADD CONSTRAINT "MentorshipApplication_reviewedById_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
