-- Universal safety-net record for every intake form submission, so a
-- submission survives even if the notification email fails.

-- CreateTable
CREATE TABLE "public"."intake_submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pathway" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "review_level" TEXT NOT NULL DEFAULT 'standard_fit_review',
    "status" TEXT NOT NULL DEFAULT 'new',
    "source_page" TEXT,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intake_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntakeSubmission_pathway_idx" ON "public"."intake_submissions"("pathway");

-- CreateIndex
CREATE INDEX "IntakeSubmission_status_idx" ON "public"."intake_submissions"("status");

-- CreateIndex
CREATE INDEX "IntakeSubmission_reviewLevel_idx" ON "public"."intake_submissions"("review_level");
