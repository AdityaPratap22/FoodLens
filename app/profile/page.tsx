"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [goal, setGoal] = useState<number>(2000);
  const [diet, setDiet] = useState("normal");
  const [allergies, setAllergies] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("foodlens_profile");
    if (saved) {
      const p = JSON.parse(saved);
      setGoal(p.dailyCaloriesGoal || 2000);
      setDiet(p.dietType || "normal");
      setAllergies((p.allergies || []).join(", "));
    }
  }, []);

  // 🔹 VALIDATION
  useEffect(() => {
    if (goal < 100 || goal > 5000) {
      setError("Daily calorie goal must be between 100 and 5000 kcal.");
    } else {
      setError(null);
    }
  }, [goal]);

  function saveProfile() {
    if (error) return;

    const profile = {
      dailyCaloriesGoal: goal,
      dietType: diet,
      allergies: allergies
        .split(",")
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean),
    };

    localStorage.setItem("foodlens_profile", JSON.stringify(profile));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page max-w-4xl flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-xl card p-8 sm:p-10 animate-fade-in relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            User Profile
          </h1>
          <p className="text-zinc-400 font-light mb-8">
            Tell us about your dietary goals to personalize your health scores.
          </p>

          <div className="space-y-6">
            {/* Calories */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-zinc-500">
                Daily Calorie Goal (kcal)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-lg font-medium shadow-inner"
              />
              <p className="text-xs text-zinc-600 mt-2 font-medium">
                Used to harshly penalize single foods taking up over 30% of your daily calories.
              </p>
            </div>

            {/* Diet */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-zinc-500">
                Diet Preference
              </label>
              <div className="relative">
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-white/10 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium appearance-none shadow-inner"
                >
                  <option value="normal">Normal / Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                   ▼
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2 text-zinc-500">
                Allergies (comma separated)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. milk, peanuts, gluten"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950/80 border border-white/10 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium shadow-inner"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            {error && (
              <p className="text-sm text-rose-400 font-semibold mb-4 bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20 w-full text-center">
                {error}
              </p>
            )}

            <button
              onClick={saveProfile}
              disabled={!!error}
              className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 ${
                error
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              }`}
            >
              {saved ? "✅ Saved Successfully" : "Save Profile Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
