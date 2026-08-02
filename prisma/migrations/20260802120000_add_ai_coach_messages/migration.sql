-- CreateTable
CREATE TABLE "public"."ai_coach_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "red_flag_intercepted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_coach_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiCoachMessage_userId_createdAt_idx" ON "public"."ai_coach_messages"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."ai_coach_messages" ADD CONSTRAINT "AiCoachMessage_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
