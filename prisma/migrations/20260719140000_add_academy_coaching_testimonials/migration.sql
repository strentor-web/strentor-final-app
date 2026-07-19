-- STRENTOR Adaptive Transformation Academy — Phase 5 (coaching, testimonials, automation audit).
-- See App Builder Requirement Document sections 7.3, 12, 13.

-- CreateEnum
CREATE TYPE "public"."TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."coaching_calls" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "call_type" TEXT NOT NULL DEFAULT 'discovery',
    "booking_time" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'requested',
    "call_link" TEXT,
    "notes" TEXT,
    "outcome" TEXT,
    "conversion_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coaching_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."testimonials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name_display" TEXT NOT NULL,
    "program_type" TEXT,
    "testimonial_text" TEXT NOT NULL,
    "media_url" TEXT,
    "approval_status" "public"."TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."automation_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "event_type" TEXT NOT NULL,
    "trigger_source" TEXT NOT NULL,
    "payload_summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error_message" TEXT,

    CONSTRAINT "automation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "related_type" TEXT NOT NULL,
    "related_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'internal',
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachingCall_userId_idx" ON "public"."coaching_calls"("user_id");

-- CreateIndex
CREATE INDEX "Testimonial_approvalStatus_idx" ON "public"."testimonials"("approval_status");

-- CreateIndex
CREATE INDEX "AutomationEvent_userId_idx" ON "public"."automation_events"("user_id");

-- CreateIndex
CREATE INDEX "AutomationEvent_eventType_idx" ON "public"."automation_events"("event_type");

-- CreateIndex
CREATE INDEX "AdminNote_userId_relatedType_idx" ON "public"."admin_notes"("user_id", "related_type");

-- AddForeignKey
ALTER TABLE "public"."coaching_calls" ADD CONSTRAINT "CoachingCall_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."testimonials" ADD CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."automation_events" ADD CONSTRAINT "AutomationEvent_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin_notes" ADD CONSTRAINT "AdminNote_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin_notes" ADD CONSTRAINT "AdminNote_createdById_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
