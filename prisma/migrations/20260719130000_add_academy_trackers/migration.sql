-- STRENTOR Adaptive Transformation Academy — Phase 4 tracking.
-- See App Builder Requirement Document section 11 (tracking, check-ins).

-- CreateEnum
CREATE TYPE "public"."CoachReviewStatus" AS ENUM ('PENDING', 'REVIEWED');

-- CreateTable
CREATE TABLE "public"."pain_fatigue_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "pain_level" INTEGER NOT NULL,
    "fatigue_level" INTEGER NOT NULL,
    "energy_level" INTEGER NOT NULL,
    "mood_level" INTEGER NOT NULL,
    "soreness_level" INTEGER,
    "symptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "red_flag_detected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pain_fatigue_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weekly_checkins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "week_start" DATE NOT NULL,
    "wins" TEXT,
    "barriers" TEXT,
    "pain_summary" TEXT,
    "energy_summary" TEXT,
    "mood_summary" TEXT,
    "habit_consistency" TEXT,
    "support_needed" BOOLEAN NOT NULL DEFAULT false,
    "support_needed_details" TEXT,
    "red_flag_detected" BOOLEAN NOT NULL DEFAULT false,
    "coach_review_status" "public"."CoachReviewStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PainFatigueLog_userId_date_idx" ON "public"."pain_fatigue_logs"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCheckin_userId_weekStart_key" ON "public"."weekly_checkins"("user_id", "week_start");

-- CreateIndex
CREATE INDEX "WeeklyCheckin_userId_weekStart_idx" ON "public"."weekly_checkins"("user_id", "week_start");

-- AddForeignKey
ALTER TABLE "public"."pain_fatigue_logs" ADD CONSTRAINT "PainFatigueLog_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weekly_checkins" ADD CONSTRAINT "WeeklyCheckin_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
