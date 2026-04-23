import { NextResponse } from "next/server";
import { computeHealthScore, NutritionProfile, UserProfile } from "../../../../utils/healthScore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "image_required" }, { status: 400 });
    }

    // Prepare form data for inference server
    const aiFormData = new FormData();
    aiFormData.append("file", file);

    let response;
    try {
      response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: aiFormData as any, 
      });
    } catch (e) {
      // Return a connection error specifically instead of crashing out
      return NextResponse.json({ 
        error: "inference_offline", 
        message: "AI Inference Server (localhost:8000) is unreachable. Ensure the python backend is running."
      }, { status: 503 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "inference_failed" }, { status: response.status });
    }

    const mlResult = await response.json();

    if (!mlResult.food || mlResult.confidence < 0.6) {
      return NextResponse.json({
        predictions: [],
        est_nutrition: null,
        healthScore: null,
        message: "Low confidence prediction. Please try another image.",
      }, { status: 200 });
    }

    const predictions = [{ label: mlResult.food, confidence: mlResult.confidence }];

    // Mock nutrition dict
    const FOOD_NUTRITION: Record<string, NutritionProfile> = {
      pizza: { calories: 266, sugar_g: 4, fat_g: 10, sat_fat_g: 4, sodium_mg: 640 },
      burger: { calories: 295, sugar_g: 5, fat_g: 12, sat_fat_g: 5, sodium_mg: 700 },
      samosa: { calories: 320, sugar_g: 3, fat_g: 20, sat_fat_g: 5, sodium_mg: 450 },
      pakora: { calories: 280, sugar_g: 2, fat_g: 18, sat_fat_g: 4, sodium_mg: 400 },
      dosa: { calories: 170, sugar_g: 1, fat_g: 6, sat_fat_g: 1, sodium_mg: 180 },
      idli: { calories: 60, sugar_g: 0, fat_g: 0.5, sat_fat_g: 0.1, sodium_mg: 90 },
      fries: { calories: 312, sugar_g: 0, fat_g: 15, sat_fat_g: 3, sodium_mg: 210 },
      noodles: { calories: 138, sugar_g: 1, fat_g: 5, sat_fat_g: 2, sodium_mg: 400 },
      sandwich: { calories: 250, sugar_g: 4, fat_g: 8, sat_fat_g: 3, sodium_mg: 500 },
      cake: { calories: 350, sugar_g: 30, fat_g: 15, sat_fat_g: 7, sodium_mg: 300 },
    };

    const est_nutrition: NutritionProfile = {
      ...(FOOD_NUTRITION[mlResult.food] || {
        calories: 300,
        sugar_g: 5,
        fat_g: 12,
        sat_fat_g: 4,
        sodium_mg: 450,
      }),
      isPackaged: false,
    };

    let userProfile: UserProfile = {};
    try {
      const headerStr = req.headers.get("x-user-profile") || "{}";
      userProfile = JSON.parse(headerStr);
    } catch {}

    const healthScore = computeHealthScore(est_nutrition, userProfile);

    return NextResponse.json({
      predictions,
      est_nutrition,
      healthScore,
    }, { status: 200 });

  } catch (err: any) {
    console.error("Image scan route error:", err);
    return NextResponse.json({ error: "server_error", details: String(err) }, { status: 500 });
  }
}
