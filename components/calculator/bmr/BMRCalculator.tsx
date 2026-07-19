"use client";

import { useState } from "react";
import { Gender, ActivityLevel } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, Zap, Scale, User, TrendingUp } from "lucide-react";

interface BMRCalculatorProps {
  height: number;
  gender: Gender;
  weight: number;
  age: number;
  activityLevel: ActivityLevel;
}

export function BMRCalculator({ 
  height, 
  gender, 
  weight,
  age,
  activityLevel 
}: BMRCalculatorProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Calculate BMR using Mifflin-St Jeor Equation
  function calculateBMR(height: number, weight: number, age: number, gender: Gender): number {
    if (gender === Gender.MALE) {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Activity level multipliers
  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return bmr * activityMultipliers[activityLevel];
  }

  const bmr = calculateBMR(height, weight, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const getActivityLevelName = (level: ActivityLevel): string => {
    switch (level) {
      case ActivityLevel.SEDENTARY: return "Sedentary";
      case ActivityLevel.LIGHTLY_ACTIVE: return "Lightly Active";
      case ActivityLevel.MODERATELY_ACTIVE: return "Moderately Active";
      case ActivityLevel.VERY_ACTIVE: return "Very Active";
      case ActivityLevel.EXTRA_ACTIVE: return "Extra Active";
      default: return "Unknown";
    }
  };

  const getActivityDescription = (level: ActivityLevel): string => {
    switch (level) {
      case ActivityLevel.SEDENTARY: return "Little to no exercise";
      case ActivityLevel.LIGHTLY_ACTIVE: return "Light exercise 1-3 days/week";
      case ActivityLevel.MODERATELY_ACTIVE: return "Moderate exercise 3-5 days/week";
      case ActivityLevel.VERY_ACTIVE: return "Heavy exercise 6-7 days/week";
      case ActivityLevel.EXTRA_ACTIVE: return "Very heavy exercise, physical job";
      default: return "Unknown";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Calculator */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C9A96A]" />
              Your BMR & TDEE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Data Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Height</span>
                </div>
                <span className="font-semibold">{height} cm</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Weight</span>
                </div>
                <span className="font-semibold">{weight} kg</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Age</span>
                </div>
                <span className="font-semibold">{age} years</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Activity</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getActivityLevelName(activityLevel)}
                </Badge>
              </div>
            </div>

            {/* BMR Result */}
            <div className="text-center p-6 bg-[#C9A96A]/10 rounded-lg border-2 border-[#C9A96A]/30">
              <div className="text-3xl font-bold text-[#C9A96A] mb-2">
                {bmr.toFixed(0)} calories
              </div>
              <div className="text-sm text-[#B8935A]">
                Basal Metabolic Rate (BMR)
              </div>
              <div className="text-xs text-[#C9A96A] mt-1">
                Calories burned at rest
              </div>
            </div>

            {/* TDEE Result */}
            <div className="text-center p-6 bg-[#B8935A]/10 rounded-lg border-2 border-[#B8935A]/30">
              <div className="text-3xl font-bold text-[#B8935A] mb-2">
                {tdee.toFixed(0)} calories
              </div>
              <div className="text-sm text-[#8a6d3b]">
                Total Daily Energy Expenditure (TDEE)
              </div>
              <div className="text-xs text-[#B8935A] mt-1">
                Daily calorie needs with activity
              </div>
            </div>

            {/* Activity Level Breakdown */}
            <div className="space-y-4">
              <div className="text-center font-semibold text-muted-foreground">
                Activity Level Breakdown
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">
                    {getActivityLevelName(activityLevel)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ×{activityMultipliers[activityLevel]}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getActivityDescription(activityLevel)}
                </div>
              </div>
            </div>

            {/* Calorie Needs for Different Goals */}
            <div className="space-y-3">
              <div className="text-center font-semibold text-muted-foreground">
                Calorie Needs for Different Goals
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-[#C9C0B4]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#8a8072]">
                    {(tdee - 500).toFixed(0)}
                  </div>
                  <div className="text-xs text-[#8a8072]">Weight Loss</div>
                  <div className="text-xs text-[#8a8072]">-500 cal</div>
                </div>

                <div className="text-center p-3 bg-[#C9A96A]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#C9A96A]">
                    {tdee.toFixed(0)}
                  </div>
                  <div className="text-xs text-[#8a6d3b]">Maintenance</div>
                  <div className="text-xs text-[#C9A96A]">Current TDEE</div>
                </div>

                <div className="text-center p-3 bg-[#B8935A]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#B8935A]">
                    {(tdee + 500).toFixed(0)}
                  </div>
                  <div className="text-xs text-[#8a6d3b]">Weight Gain</div>
                  <div className="text-xs text-[#B8935A]">+500 cal</div>
                </div>
              </div>
            </div>

            {/* Info Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowInfo(!showInfo)}
              className="w-full"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {showInfo ? "Hide" : "Show"} Formula Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#C9A96A]" />
              Mifflin-St Jeor Equation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              The Mifflin-St Jeor equation is considered the most accurate BMR formula for healthy adults.
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#C9A96A]/10 rounded-lg">
                <div className="font-semibold text-[#7a5f35] mb-1">For Men:</div>
                <div className="text-sm text-[#B8935A]">
                  BMR = 10×Weight + 6.25×Height - 5×Age + 5
                </div>
              </div>

              <div className="p-3 bg-[#EDE0C8]/20 rounded-lg">
                <div className="font-semibold text-[#8a6d3b] mb-1">For Women:</div>
                <div className="text-sm text-[#8a6d3b]">
                  BMR = 10×Weight + 6.25×Height - 5×Age - 161
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              * Weight in kg, Height in cm, Age in years
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About BMR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Basal Metabolic Rate (BMR) is the number of calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production.
            </p>
            <p>
              BMR accounts for 60-75% of your total daily calorie expenditure. The remaining calories are burned through physical activity and food digestion.
            </p>
            <p>
              TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor that accounts for your daily physical activity level.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Level Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span><strong>Sedentary (1.2):</strong> Little to no exercise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#C9C0B4] rounded-full"></div>
                <span><strong>Lightly Active (1.375):</strong> Light exercise 1-3 days/week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#C9A96A] rounded-full"></div>
                <span><strong>Moderately Active (1.55):</strong> Moderate exercise 3-5 days/week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#B8935A] rounded-full"></div>
                <span><strong>Very Active (1.725):</strong> Heavy exercise 6-7 days/week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0A0A0A] rounded-full"></div>
                <span><strong>Extra Active (1.9):</strong> Very heavy exercise, physical job</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}