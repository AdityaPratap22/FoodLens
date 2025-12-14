export function computeHealthScore(nutrition = {}, userProfile = {}) {
  let score = 100;
  const cal = Number(nutrition.calories || 0);
  const goal = Number(userProfile.dailyCaloriesGoal || 2000);

  if (cal > goal * 0.5) {
    const penalty = Math.min(30, Math.round((cal - goal * 0.5) / (goal * 0.01)));
    score -= penalty;
  }

  const sugar = Number(nutrition.sugar_g || 0);
  if (sugar > 25) score -= 20;
  else if (sugar > 10) score -= 8;

  const sat = Number(nutrition.sat_fat_g || 0);
  if (sat > 10) score -= 20;
  else if (sat > 5) score -= 8;

  const sodium = Number(nutrition.sodium_mg || 0);
  if (sodium > 1000) score -= 20;
  else if (sodium > 600) score -= 8;

  if (nutrition.additives && nutrition.additives.length > 0) score -= 5;
  if (nutrition.allergens && nutrition.allergens.length > 0) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let color = "green";
  if (score < 50) color = "red";
  else if (score < 80) color = "yellow";

  return { score, color };
}
