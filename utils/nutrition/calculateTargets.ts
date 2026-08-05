import { Gender, ActivityLevel } from "@prisma/client";

export type FitnessGoal = "weight_loss" | "maintenance" | "weight_gain";

export interface MacroBreakdown {
  calories: number;
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fats: { grams: number; calories: number; percentage: number };
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
};

/** Mifflin-St Jeor equation. Weight in kg, height in cm, age in years. */
export function calculateBMR(height: number, weight: number, age: number, gender: Gender): number {
  return gender === Gender.MALE
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

export function calculateGoalCalories(tdee: number, goal: FitnessGoal): number {
  switch (goal) {
    case "weight_loss":
      return tdee - 500; // ~1 lb/week loss
    case "weight_gain":
      return tdee + 500; // ~1 lb/week gain
    case "maintenance":
    default:
      return tdee;
  }
}

export function calculateMacros(calories: number, goal: FitnessGoal): MacroBreakdown {
  let proteinPercent: number;
  let carbsPercent: number;
  let fatsPercent: number;

  switch (goal) {
    case "weight_loss":
      proteinPercent = 0.3;
      carbsPercent = 0.4;
      fatsPercent = 0.3;
      break;
    case "weight_gain":
      proteinPercent = 0.2;
      carbsPercent = 0.55;
      fatsPercent = 0.25;
      break;
    case "maintenance":
    default:
      proteinPercent = 0.25;
      carbsPercent = 0.45;
      fatsPercent = 0.3;
      break;
  }

  const proteinCalories = calories * proteinPercent;
  const carbsCalories = calories * carbsPercent;
  const fatsCalories = calories * fatsPercent;

  return {
    calories,
    protein: { grams: proteinCalories / 4, calories: proteinCalories, percentage: proteinPercent * 100 },
    carbs: { grams: carbsCalories / 4, calories: carbsCalories, percentage: carbsPercent * 100 },
    fats: { grams: fatsCalories / 9, calories: fatsCalories, percentage: fatsPercent * 100 },
  };
}

export interface CalculateTargetsInput {
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
}

/** Full BMR -> TDEE -> goal-adjusted-calories -> macro-split pipeline in one call. */
export function calculateTargets({ height, weight, age, gender, activityLevel, goal }: CalculateTargetsInput): {
  bmr: number;
  tdee: number;
  macros: MacroBreakdown;
} {
  const bmr = calculateBMR(height, weight, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const goalCalories = calculateGoalCalories(tdee, goal);
  const macros = calculateMacros(goalCalories, goal);
  return { bmr, tdee, macros };
}

/** Maps the persisted `fitness_goal` enum on users_profile to the calculator's goal union. */
export function fitnessGoalEnumToGoal(fitnessGoal: "GAIN_WEIGHT" | "LOSE_WEIGHT" | "MAINTAIN"): FitnessGoal {
  switch (fitnessGoal) {
    case "GAIN_WEIGHT":
      return "weight_gain";
    case "LOSE_WEIGHT":
      return "weight_loss";
    case "MAINTAIN":
    default:
      return "maintenance";
  }
}
