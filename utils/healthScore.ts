export interface NutritionProfile {
  calories?: number;
  sugar_g?: number;
  fat_g?: number;
  sat_fat_g?: number;
  sodium_mg?: number;
  additives?: string[];
  allergens?: string[];
  isPackaged?: boolean;
}

export interface UserProfile {
  dailyCaloriesGoal?: number;
}

export interface HealthScoreResult {
  score: number;
  color: "green" | "yellow" | "red";
}

export function computeHealthScore(
  nutrition: NutritionProfile = {},
  userProfile: UserProfile = {}
): HealthScoreResult {
  let score = 100;

  const cal = Number(nutrition.calories || 0);
  const goal = Number(userProfile.dailyCaloriesGoal || 2000);

  /* ---------------- Calories impact ---------------- */
  // Penalize if a single food exceeds 30% of daily calories
  if (cal > goal * 0.3) {
    const excessRatio = (cal - goal * 0.3) / goal;
    const penalty = Math.min(30, Math.round(excessRatio * 100));
    score -= penalty;
  }

  /* ---------------- Sugar ---------------- */
  const sugar = Number(nutrition.sugar_g || 0);
  if (sugar > 25) score -= 20;
  else if (sugar > 10) score -= 8;

  /* ---------------- Saturated fat ---------------- */
  const sat = Number(nutrition.sat_fat_g || 0);
  if (sat > 10) score -= 20;
  else if (sat > 5) score -= 8;

  /* ---------------- Total fat ---------------- */
  const fat = Number(nutrition.fat_g || 0);
  if (fat > 20) score -= 20;
  else if (fat > 10) score -= 8;

  /* ---------------- Sodium ---------------- */
  const sodium = Number(nutrition.sodium_mg || 0);
  if (sodium > 1000) score -= 20;
  else if (sodium > 600) score -= 8;

  /* ---------------- Additives & allergens ---------------- */
  if (nutrition.additives && nutrition.additives.length > 0) score -= 5;
  if (nutrition.allergens && nutrition.allergens.length > 0) score -= 15;

  /* ---------------- Food type ---------------- */
  // Extra penalty for street food / unprocessed estimation
  if (nutrition.isPackaged === false) {
    score -= 15;
  }

  /* ---------------- Clamp score ---------------- */
  score = Math.max(0, Math.min(100, score));

  /* ---------------- Color label ---------------- */
  let color: "green" | "yellow" | "red" = "green";
  if (score < 50) color = "red";
  else if (score < 80) color = "yellow";

  return { score, color };
}
