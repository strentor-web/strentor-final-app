"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Droplet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealType } from "@prisma/client";
import { CalorieRing } from "./CalorieRing";
import { LogFoodDialog } from "./LogFoodDialog";
import { getDailyNutrition, type DailyNutritionData } from "@/actions/nutrition/get-daily-nutrition.action";
import { deleteFoodLog } from "@/actions/nutrition/delete-food-log.action";
import { createWaterLog } from "@/actions/nutrition/create-water-log.action";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface NutritionTrackerClientProps {
  initialData: DailyNutritionData;
}

export function NutritionTrackerClient({ initialData }: NutritionTrackerClientProps) {
  const [date, setDate] = useState(initialData.date);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [dialogMeal, setDialogMeal] = useState<MealType | null>(null);
  const [addingWater, setAddingWater] = useState(false);

  const refresh = useCallback(async (forDate: string) => {
    setLoading(true);
    try {
      const fresh = await getDailyNutrition(forDate);
      setData(fresh);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date !== initialData.date) {
      refresh(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function handleAddWater() {
    setAddingWater(true);
    try {
      await createWaterLog({ date, amountMl: 250 });
      await refresh(date);
    } finally {
      setAddingWater(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteFoodLog({ id });
    await refresh(date);
  }

  if (!data.profileComplete || !data.targets) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold text-card-foreground">Complete your profile to see targets</h2>
        <p className="mt-2 text-muted-foreground">
          We need your height, weight, age, gender, and activity level to calculate your daily calorie and macro
          targets.
        </p>
        <Button asChild className="mt-6 bg-[#C9A96A] hover:bg-[#C9A96A]/90">
          <a href="/settings">Go to Settings</a>
        </Button>
      </div>
    );
  }

  const { targets, totals, mealsByType, waterMl } = data;
  const isToday = date === todayIso();

  const macroBars = [
    { label: "Protein", consumed: totals.proteinG, target: Math.round(targets.macros.protein.grams), color: "#C9A96A" },
    { label: "Carbs", consumed: totals.carbsG, target: Math.round(targets.macros.carbs.grams), color: "#2FA366" },
    { label: "Fats", consumed: totals.fatG, target: Math.round(targets.macros.fats.grams), color: "#B8935A" },
  ];

  return (
    <div className={`space-y-8 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
      <ScrollReveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <CalorieRing consumed={totals.calories} target={targets.calories} />

        <StaggerGroup className="mt-8 grid grid-cols-3 gap-4">
          {macroBars.map((macro) => (
            <ScrollReveal key={macro.label}>
              <div className="text-center">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${macro.target > 0 ? Math.min((macro.consumed / macro.target) * 100, 100) : 0}%`,
                      backgroundColor: macro.color,
                    }}
                  />
                </div>
                <p className="mt-2 text-lg font-bold text-foreground">
                  {macro.consumed}g <span className="text-sm font-normal text-muted-foreground">/ {macro.target}g</span>
                </p>
                <p className="text-sm text-muted-foreground">{macro.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4">
          {MEAL_ORDER.map((meal) => (
            <ScrollReveal key={meal}>
              <button
                type="button"
                onClick={() => setDialogMeal(meal)}
                className="flex w-full flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 transition-colors hover:border-[#C9A96A]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#C9A96A] text-[#C9A96A]">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-foreground">{MEAL_LABELS[meal]}</span>
              </button>
            </ScrollReveal>
          ))}
        </StaggerGroup>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleAddWater}
            disabled={addingWater}
          >
            <Droplet className="h-4 w-4 text-[#2FA366]" />
            Add Water ({(waterMl / 1000).toFixed(2)}L today)
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={() => setDialogMeal("SNACK")}>
            <Plus className="h-4 w-4" />
            Add Snack
          </Button>
        </div>
      </ScrollReveal>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          />
          {!isToday && (
            <Button variant="ghost" size="sm" onClick={() => setDate(todayIso())}>
              Back to Today
            </Button>
          )}
        </div>
      </div>

      <StaggerGroup className="space-y-4">
        {MEAL_ORDER.map((meal) => (
          <ScrollReveal key={meal} as="div">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-bold text-card-foreground">{MEAL_LABELS[meal]}</h3>
              {mealsByType[meal].length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  Empty
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {mealsByType[meal].map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.foodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.calories} cal · P{item.proteinG}g · C{item.carbsG}g · F{item.fatG}g
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Remove ${item.foodName}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollReveal>
        ))}
      </StaggerGroup>

      {dialogMeal && (
        <LogFoodDialog
          open={!!dialogMeal}
          onOpenChange={(open) => !open && setDialogMeal(null)}
          mealType={dialogMeal}
          date={date}
          onLogged={() => refresh(date)}
        />
      )}
    </div>
  );
}
