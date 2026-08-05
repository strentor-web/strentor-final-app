"use server";

import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { calculateTargets, fitnessGoalEnumToGoal, type MacroBreakdown } from "@/utils/nutrition/calculateTargets";
import { MealType } from "@prisma/client";

export interface NutritionLogEntry {
  id: string;
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface DailyNutritionData {
  date: string;
  profileComplete: boolean;
  targets: { calories: number; macros: MacroBreakdown } | null;
  mealsByType: Record<MealType, NutritionLogEntry[]>;
  totals: { calories: number; proteinG: number; carbsG: number; fatG: number };
  waterMl: number;
}

function startOfDayUtc(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function getDailyNutrition(date: string): Promise<DailyNutritionData> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const [profile, logs, waterLogs] = await Promise.all([
    prisma.users_profile.findUnique({
      where: { id: user.id },
      select: { weight: true, height: true, date_of_birth: true, gender: true, activity_level: true, fitness_goal: true },
    }),
    prisma.nutrition_logs.findMany({
      where: { user_id: user.id, date: startOfDayUtc(date) },
      orderBy: { created_at: "asc" },
    }),
    prisma.water_logs.findMany({
      where: { user_id: user.id, date: startOfDayUtc(date) },
    }),
  ]);

  const age = profile?.date_of_birth
    ? Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const profileComplete = !!(profile?.weight && profile?.height && age && profile?.gender && profile?.activity_level);

  let targets: DailyNutritionData["targets"] = null;
  if (profileComplete && profile) {
    const { macros } = calculateTargets({
      height: profile.height!,
      weight: profile.weight!,
      age: age!,
      gender: profile.gender!,
      activityLevel: profile.activity_level!,
      goal: fitnessGoalEnumToGoal(profile.fitness_goal),
    });
    targets = { calories: Math.round(macros.calories), macros };
  }

  const mealsByType: Record<MealType, NutritionLogEntry[]> = {
    BREAKFAST: [],
    LUNCH: [],
    DINNER: [],
    SNACK: [],
  };

  const totals = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

  for (const log of logs) {
    const entry: NutritionLogEntry = {
      id: log.id,
      foodName: log.food_name,
      calories: log.calories,
      proteinG: log.protein_g,
      carbsG: log.carbs_g,
      fatG: log.fat_g,
    };
    mealsByType[log.meal_type].push(entry);
    totals.calories += log.calories;
    totals.proteinG += log.protein_g;
    totals.carbsG += log.carbs_g;
    totals.fatG += log.fat_g;
  }

  const waterMl = waterLogs.reduce((sum, w) => sum + w.amount_ml, 0);

  return { date, profileComplete, targets, mealsByType, totals, waterMl };
}
