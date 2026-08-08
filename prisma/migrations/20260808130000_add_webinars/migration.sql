-- CreateEnum
CREATE TYPE "public"."WebinarPlatform" AS ENUM ('YOUTUBE_LIVE', 'ZOOM', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WebinarStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('REGISTERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."webinars" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "host_name" TEXT,
    "platform" "public"."WebinarPlatform" NOT NULL DEFAULT 'YOUTUBE_LIVE',
    "join_url" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER,
    "capacity" INTEGER,
    "status" "public"."WebinarStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webinar_registrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "webinar_id" UUID NOT NULL,
    "user_id" UUID,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "source_page" TEXT,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "attended" BOOLEAN,
    "reminder_24h_sent_at" TIMESTAMP(3),
    "reminder_1h_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Webinar_status_startsAt_idx" ON "public"."webinars"("status", "starts_at");

-- CreateIndex
CREATE INDEX "WebinarRegistration_webinarId_idx" ON "public"."webinar_registrations"("webinar_id");

-- CreateIndex
CREATE UNIQUE INDEX "WebinarRegistration_webinarId_email_key" ON "public"."webinar_registrations"("webinar_id", "email");

-- AddForeignKey
ALTER TABLE "public"."webinar_registrations" ADD CONSTRAINT "WebinarRegistration_webinarId_fkey" FOREIGN KEY ("webinar_id") REFERENCES "public"."webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."webinar_registrations" ADD CONSTRAINT "WebinarRegistration_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
