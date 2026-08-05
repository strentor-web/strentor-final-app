"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { createSafeAction, ActionState } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const CreateFoodLogSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  foodName: z.string().min(1, "Food name is required").max(200, "Food name is too long"),
  calories: z.number().int().min(0).max(10000),
  proteinG: z.number().int().min(0).max(1000),
  carbsG: z.number().int().min(0).max(1000),
  fatG: z.number().int().min(0).max(1000),
});

type CreateFoodLogInput = z.infer<typeof CreateFoodLogSchema>;

interface FoodLogResult {
  id: string;
}

async function createFoodLogHandler(
  data: CreateFoodLogInput
): Promise<ActionState<CreateFoodLogInput, FoodLogResult>> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const log = await prisma.nutrition_logs.create({
    data: {
      user_id: user.id,
      date: new Date(data.date),
      meal_type: data.mealType,
      food_name: data.foodName,
      calories: data.calories,
      protein_g: data.proteinG,
      carbs_g: data.carbsG,
      fat_g: data.fatG,
    },
  });

  revalidatePath("/nutrition");

  return { data: { id: log.id } };
}

export const createFoodLog = createSafeAction(CreateFoodLogSchema, createFoodLogHandler);
