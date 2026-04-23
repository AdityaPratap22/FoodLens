import { NextResponse } from "next/server";
import { computeHealthScore, NutritionProfile, UserProfile } from "../../../../utils/healthScore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barcode } = body;

    if (!barcode) {
      return NextResponse.json({ error: "barcode required" }, { status: 400 });
    }

    let userProfile: UserProfile = {};
    try {
      const headerStr = req.headers.get("x-user-profile") || "{}";
      userProfile = JSON.parse(headerStr);
    } catch {
      userProfile = {};
    }

    const offUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const r = await fetch(offUrl);

    if (!r.ok) {
      return NextResponse.json({ error: "openfoodfacts_unavailable" }, { status: 502 });
    }

    const data = await r.json();

    if (data.status !== 1 || !data.product) {
      return NextResponse.json({ error: "product_not_found" }, { status: 404 });
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    const calories =
      nutriments["energy-kcal_100g"] ??
      nutriments["energy-kcal_serving"] ??
      (nutriments["energy-kj_100g"] ? nutriments["energy-kj_100g"] * 0.239 : 0);

    const nutrition: NutritionProfile = {
      calories: Number(calories || 0),
      sugar_g: Number(nutriments["sugars_100g"] ?? nutriments["sugars_serving"] ?? 0),
      fat_g: Number(nutriments["fat_100g"] ?? 0),
      sat_fat_g: Number(nutriments["saturated-fat_100g"] ?? 0),
      sodium_mg: nutriments["sodium_100g"] ? Number(nutriments["sodium_100g"]) * 1000 : 0,
      additives: product.additives_tags || [],
      allergens: product.allergens ? product.allergens.split(",").map((s: string) => s.trim()) : [],
      isPackaged: true,
    };

    const healthScore = computeHealthScore(nutrition, userProfile);

    return NextResponse.json({
      product,
      nutrition,
      healthScore,
    }, { status: 200 });
  } catch (err: any) {
    console.error("Barcode scan error:", err);
    return NextResponse.json({ error: "server_error", details: err.message }, { status: 500 });
  }
}
