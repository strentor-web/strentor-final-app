"use server";

import prisma from "@/utils/prisma/prismaClient";
import { validateServerRole } from "@/lib/server-role-validation";

export interface NutritionHistoryDay {
  date: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
}

export async function getNutritionHistory(days: number = 14): Promise<NutritionHistoryDay[]> {
  const { user } = await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const [logs, waterLogs] = await Promise.all([
    prisma.nutrition_logs.findMany({
      where: { user_id: user.id, date: { gte: since } },
      select: { date: true, calories: true, protein_g: true, carbs_g: true, fat_g: true },
    }),
    prisma.water_logs.findMany({
      where: { user_id: user.id, date: { gte: since } },
      select: { date: true, amount_ml: true },
    }),
  ]);

  const byDate = new Map<string, NutritionHistoryDay>();

  for (const log of logs) {
    const key = log.date.toISOString().slice(0, 10);
    const day = byDate.get(key) ?? { date: key, calories: 0, proteinG: 0, carbsG: 0, fatG: 0, waterMl: 0 };
    day.calories += log.calories;
    day.proteinG += log.protein_g;
    day.carbsG += log.carbs_g;
    day.fatG += log.fat_g;
    byDate.set(key, day);
  }

  for (const w of waterLogs) {
    const key = w.date.toISOString().slice(0, 10);
    const day = byDate.get(key) ?? { date: key, calories: 0, proteinG: 0, carbsG: 0, fatG: 0, waterMl: 0 };
    day.waterMl += w.amount_ml;
    byDate.set(key, day);
  }

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}
