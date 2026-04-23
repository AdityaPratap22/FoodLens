import { NextResponse } from "next/server";
import { computeHealthScore, NutritionProfile, UserProfile } from "../../../../utils/healthScore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { foodName, nutrition } = body;

    if (!foodName) {
      return NextResponse.json({ error: "foodName required" }, { status: 400 });
    }

    const safeNutrition: NutritionProfile = {
      calories: Number(nutrition?.calories || 0),
      sugar_g: Number(nutrition?.sugar_g || 0),
      fat_g: Number(nutrition?.fat_g || 0),
      sat_fat_g: Number(nutrition?.sat_fat_g || 0),
      sodium_mg: Number(nutrition?.sodium_mg || 0),
      isPackaged: false, // Manual items get street food penalty unless indicated otherwise
    };

    let userProfile: UserProfile = {};
    try {
      const headerStr = req.headers.get("x-user-profile") || "{}";
      userProfile = JSON.parse(headerStr);
    } catch {}

    const healthScore = computeHealthScore(safeNutrition, userProfile);

    return NextResponse.json({
      foodName,
      est_nutrition: safeNutrition,
      healthScore,
      source: "manual",
      message: "Manual entry success",
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: "server_error", details: String(err) }, { status: 500 });
  }
}
