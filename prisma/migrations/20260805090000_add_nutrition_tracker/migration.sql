-- CreateEnum
CREATE TYPE "public"."FitnessGoal" AS ENUM ('GAIN_WEIGHT', 'LOSE_WEIGHT', 'MAINTAIN');

-- CreateEnum
CREATE TYPE "public"."MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "public"."users_profile" ADD COLUMN "fitness_goal" "public"."FitnessGoal" NOT NULL DEFAULT 'MAINTAIN';

-- CreateTable
CREATE TABLE "public"."nutrition_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "meal_type" "public"."MealType" NOT NULL,
    "food_name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein_g" INTEGER NOT NULL DEFAULT 0,
    "carbs_g" INTEGER NOT NULL DEFAULT 0,
    "fat_g" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."water_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "amount_ml" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionLog_userId_date_idx" ON "public"."nutrition_logs"("user_id", "date");

-- CreateIndex
CREATE INDEX "WaterLog_userId_date_idx" ON "public"."water_logs"("user_id", "date");

-- AddForeignKey
ALTER TABLE "public"."nutrition_logs" ADD CONSTRAINT "NutritionLog_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."water_logs" ADD CONSTRAINT "WaterLog_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
