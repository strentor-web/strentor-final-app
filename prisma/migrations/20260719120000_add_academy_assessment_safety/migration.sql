-- STRENTOR Adaptive Transformation Academy — Phase 1 foundation.
-- Deterministic readiness-assessment engine + rule-based safety triage.
-- See App Builder Requirement Document sections 9 (pathway logic) and 12 (schema).

-- CreateEnum
CREATE TYPE "public"."AssessmentPathway" AS ENUM ('START_STRONG', 'START_STRONG_CAUTION', 'BUILD_STRENGTH', 'LIVE_LIMITLESS', 'CORPORATE_INCLUSIVE_WELLNESS', 'CONSULT_PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."SafetyFlagSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."SafetyFlagStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED');

-- CreateTable
CREATE TABLE "public"."assessments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "total_score" INTEGER NOT NULL,
    "red_flag_exists" BOOLEAN NOT NULL DEFAULT false,
    "pathway_result" "public"."AssessmentPathway" NOT NULL,
    "human_review_required" BOOLEAN NOT NULL DEFAULT false,
    "corporate_interest" BOOLEAN NOT NULL DEFAULT false,
    "elite_interest" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assessment_answers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_id" UUID NOT NULL,
    "question_key" TEXT NOT NULL,
    "answer_value" TEXT NOT NULL,
    "score_value" INTEGER NOT NULL DEFAULT 0,
    "is_red_flag" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "assessment_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pathway_recommendations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "pathway" "public"."AssessmentPathway" NOT NULL,
    "reason" TEXT NOT NULL,
    "cta_type" TEXT NOT NULL,
    "automatic_progression_allowed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pathway_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."safety_flags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "symptom_type" TEXT NOT NULL,
    "severity" "public"."SafetyFlagSeverity" NOT NULL DEFAULT 'MEDIUM',
    "message" TEXT NOT NULL,
    "status" "public"."SafetyFlagStatus" NOT NULL DEFAULT 'OPEN',
    "human_review_required" BOOLEAN NOT NULL DEFAULT true,
    "assigned_to_id" UUID,
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "safety_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_userId_idx" ON "public"."assessments"("user_id");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_assessmentId_idx" ON "public"."assessment_answers"("assessment_id");

-- CreateIndex
CREATE INDEX "PathwayRecommendation_userId_idx" ON "public"."pathway_recommendations"("user_id");

-- CreateIndex
CREATE INDEX "SafetyFlag_userId_idx" ON "public"."safety_flags"("user_id");

-- CreateIndex
CREATE INDEX "SafetyFlag_status_severity_idx" ON "public"."safety_flags"("status", "severity");

-- AddForeignKey
ALTER TABLE "public"."assessments" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assessment_answers" ADD CONSTRAINT "AssessmentAnswer_assessmentId_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pathway_recommendations" ADD CONSTRAINT "PathwayRecommendation_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pathway_recommendations" ADD CONSTRAINT "PathwayRecommendation_assessmentId_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."safety_flags" ADD CONSTRAINT "SafetyFlag_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."safety_flags" ADD CONSTRAINT "SafetyFlag_assignedToId_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
