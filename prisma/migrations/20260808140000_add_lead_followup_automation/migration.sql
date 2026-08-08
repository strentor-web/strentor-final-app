-- AlterTable
ALTER TABLE "public"."intake_submissions" ADD COLUMN "unsubscribe_token" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "public"."intake_submissions" ADD COLUMN "sequence_paused" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "IntakeSubmission_unsubscribeToken_key" ON "public"."intake_submissions"("unsubscribe_token");

-- CreateTable
CREATE TABLE "public"."lead_followup_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pathway" TEXT,
    "step_number" INTEGER NOT NULL,
    "delay_days" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_followup_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lead_followup_sends" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "submission_id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error_message" TEXT,

    CONSTRAINT "lead_followup_sends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_suppressions" (
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'unsubscribed',
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_suppressions_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE INDEX "LeadFollowupTemplate_pathway_step_idx" ON "public"."lead_followup_templates"("pathway", "step_number");

-- CreateIndex
CREATE UNIQUE INDEX "LeadFollowupSend_submissionId_templateId_key" ON "public"."lead_followup_sends"("submission_id", "template_id");

-- AddForeignKey
ALTER TABLE "public"."lead_followup_sends" ADD CONSTRAINT "LeadFollowupSend_submissionId_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."intake_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lead_followup_sends" ADD CONSTRAINT "LeadFollowupSend_templateId_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."lead_followup_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
