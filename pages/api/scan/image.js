// pages/api/scan/image.js
import formidable from "formidable";
import fs from "fs";
import { computeHealthScore } from "../../../utils/healthScore";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("form parse err:", err);
      return res.status(500).json({ error: "parse_error", details: String(err) });
    }

    try {
      const image = files.image;
      if (!image) return res.status(400).json({ error: "image required" });

      // read buffer (you may later send this to a model or cloud)
      const buffer = fs.readFileSync(image.path);

      // For now: placeholder prediction + nutrition (stub)
      // Replace this with a real ML inference call in future.
      const predictions = [
        { label: "samosa", confidence: 0.78 },
        { label: "pakora", confidence: 0.12 },
      ];

      const est_nutrition = {
        calories: 320,
        sugar_g: 3,
        fat_g: 20,
        sat_fat_g: 5,
        sodium_mg: 450,
      };

      const healthScore = computeHealthScore(est_nutrition);

      return res.status(200).json({ predictions, est_nutrition, healthScore });
    } catch (e) {
      console.error("image handler error:", e);
      return res.status(500).json({ error: "server_error", details: String(e) });
    }
  });
}
