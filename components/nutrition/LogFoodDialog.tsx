"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { createFoodLog } from "@/actions/nutrition/create-food-log.action";
import { MealType } from "@prisma/client";

const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
};

interface LogFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: MealType;
  date: string;
  onLogged: () => void;
}

export function LogFoodDialog({ open, onOpenChange, mealType, date, onLogged }: LogFoodDialogProps) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");

  const { execute, isLoading, error } = useAction(createFoodLog, {
    onSuccess: () => {
      setFoodName("");
      setCalories("");
      setProteinG("");
      setCarbsG("");
      setFatG("");
      onOpenChange(false);
      onLogged();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    execute({
      date,
      mealType,
      foodName,
      calories: parseInt(calories, 10) || 0,
      proteinG: parseInt(proteinG, 10) || 0,
      carbsG: parseInt(carbsG, 10) || 0,
      fatG: parseInt(fatG, 10) || 0,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to {MEAL_LABELS[mealType]}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food-name">Food</Label>
            <Input
              id="food-name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Grilled chicken breast"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              min={0}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" min={0} value={proteinG} onChange={(e) => setProteinG(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" min={0} value={carbsG} onChange={(e) => setCarbsG(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" min={0} value={fatG} onChange={(e) => setFatG(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-[#C9A96A] hover:bg-[#C9A96A]/90">
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
