import { computeHealthScore } from "../../../utils/healthScore";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ error: "barcode required" });

  try {
    const offUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const r = await fetch(offUrl);
    const data = await r.json();

    if (data.status === 1) {
      const product = data.product;
      const nutriments = product.nutriments || {};
      const nutrition = {
        calories:
          nutriments["energy-kcal_100g"] ??
          nutriments["energy-kcal_serving"] ??
          nutriments["energy-kj_100g"],
        sugar_g: nutriments["sugars_100g"] ?? nutriments["sugars_serving"],
        fat_g: nutriments["fat_100g"],
        sat_fat_g: nutriments["saturated-fat_100g"],
        sodium_mg: nutriments["sodium_100g"]
          ? nutriments["sodium_100g"] * 1000
          : null,
        additives: product.additives_tags || [],
        allergens: product.allergens
          ? product.allergens.split(",").map((s) => s.trim())
          : [],
      };
      const hs = computeHealthScore(nutrition);
      return res.status(200).json({ product, nutrition, healthScore: hs });
    } else {
      return res.status(404).json({ error: "product_not_found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
}
