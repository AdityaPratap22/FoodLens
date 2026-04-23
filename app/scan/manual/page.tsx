"use client";

import { useState } from "react";
import { saveToHistory } from "../../../utils/history";

export default function ManualScanPage() {
  const [foodName, setFoodName] = useState("");
  const [nutrition, setNutrition] = useState({
    calories: "",
    sugar_g: "",
    fat_g: "",
    sat_fat_g: "",
    sodium_mg: "",
  });
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNutrition({ ...nutrition, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setLoading(true);
    setResp(null);

    try {
      const res = await fetch("/api/scan/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName, nutrition }),
      });

      const data = await res.json();
      setResp(data);

      if (data.healthScore) {
        saveToHistory({
          food: data.foodName || "Manual Entry",
          mode: "manual",
          score: data.healthScore.score,
          color: data.healthScore.color,
          calories: data.est_nutrition?.calories,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="hero-title text-4xl mb-3">Manual Entry</h1>
        <p className="text-zinc-400 font-light text-lg">
          No barcode? No problem. Enter the nutritional facts yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="card animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Food Name (Required)</label>
              <input
                type="text"
                required
                placeholder="e.g. Grandma's Apple Pie"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "calories", label: "Calories (kcal)", placeholder: "250" },
                { name: "sugar_g", label: "Sugar (g)", placeholder: "10" },
                { name: "fat_g", label: "Total Fat (g)", placeholder: "8" },
                { name: "sat_fat_g", label: "Sat. Fat (g)", placeholder: "3" },
                { name: "sodium_mg", label: "Sodium (mg)", placeholder: "400" }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase tracking-wider">{field.label}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={(nutrition as any)[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="primary-btn w-full py-4 mt-2">
              {loading ? "Calculating..." : "Compute Health Score"}
            </button>
          </form>
        </div>

        <div className="card h-full animate-fade-in relative min-h-[300px] flex flex-col justify-center items-center">
          {!resp ? (
            <div className="text-center opacity-40">
               <div className="text-6xl mb-4">✍️</div>
               <p className="text-zinc-300 font-medium">Input nutrition data to<br/>calculate a health score</p>
            </div>
          ) : (
            <div className="w-full h-full animate-fade-in p-2">
              <h2 className="text-2xl font-semibold mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                 <span className="capitalize">{resp.foodName}</span>
                 <span className={`text-sm px-4 py-1.5 rounded-full font-bold shadow-lg ${
                   resp.healthScore?.color === "green" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
                   resp.healthScore?.color === "yellow" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : 
                   "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                 }`}>
                   Score: {resp.healthScore?.score}
                 </span>
              </h2>

              <ul className="space-y-4 w-full mt-6">
                {Object.entries(resp.est_nutrition).filter(([k]) => k !== "isPackaged").map(([k, v]) => (
                   <li key={k} className="flex justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
                      <span className="text-zinc-400 font-medium text-sm capitalize">{k.replace("_", " ")}</span>
                      <span className="text-white font-semibold">{String(v) || "0"}</span>
                   </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
