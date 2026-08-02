-- CreateTable
CREATE TABLE "public"."trainer_session_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_id" UUID NOT NULL,
    "trainer_id" UUID NOT NULL,
    "raw_notes" TEXT NOT NULL,
    "summary" TEXT,
    "session_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainer_session_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainerSessionNote_clientId_sessionDate_idx" ON "public"."trainer_session_notes"("client_id", "session_date");

-- AddForeignKey
ALTER TABLE "public"."trainer_session_notes" ADD CONSTRAINT "TrainerSessionNote_clientId_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."users_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trainer_session_notes" ADD CONSTRAINT "TrainerSessionNote_trainerId_fkey" FOREIGN KEY ("trainer_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
