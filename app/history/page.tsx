"use client";

import { useEffect, useState } from "react";
import { getHistory, clearHistory, HistoryEntry } from "../../utils/history";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  function clearAll() {
    clearHistory();
    setItems([]);
  }

  // 📊 INSIGHTS
  const total = items.length;
  const avgScore =
    total > 0
      ? Math.round(
          items.reduce((sum, i) => sum + (i.score || 0), 0) / total
        )
      : 0;

  const healthy = items.filter((i) => i.color === "green").length;
  const moderate = items.filter((i) => i.color === "yellow").length;
  const unhealthy = items.filter((i) => i.color === "red").length;

  return (
    <div className="page max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="hero-title text-4xl mb-4">Your Nutrition Log</h1>
        <p className="text-zinc-400 font-light text-lg">
          Track your food choices and uncover health trends over time.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <SummaryCard title="Total Scans" value={total} />
        <SummaryCard title="Avg Score" value={avgScore} />
        <SummaryCard title="Healthy" value={healthy} color="green" />
        <SummaryCard title="Unhealthy" value={unhealthy} color="red" />
      </div>

      {/* ACTION */}
      {items.length > 0 && (
        <div className="mb-4 text-right">
          <button
            onClick={clearAll}
            className="text-sm font-semibold text-rose-400 hover:text-rose-300 hover:underline transition-colors tracking-wide"
          >
            Clear History
          </button>
        </div>
      )}

      {/* LIST */}
      {items.length === 0 ? (
        <div className="border border-dashed border-white/10 p-12 rounded-2xl text-center bg-white/5">
          <div className="text-5xl opacity-40 mb-4">📓</div>
          <p className="text-zinc-400 font-medium">
            No scan history yet.<br/>Start scanning food to see insights.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((h, i) => (
            <li
              key={i}
              className="group p-5 bg-zinc-900/60 backdrop-blur border border-white/5 rounded-2xl flex justify-between items-center transition-all hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-black/50"
            >
              <div>
                <p className="font-bold text-lg text-white capitalize flex items-center gap-2">
                  {h.food}
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-semibold">
                    {h.mode}
                  </span>
                </p>
                <p className="text-sm text-zinc-500 font-medium mt-1">
                  {new Date(h.timestamp || "").toLocaleString(undefined, {
                    dateStyle: "medium", timeStyle: "short"
                  })}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-xl text-lg font-bold shadow-lg ${
                  h.color === "green"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : h.color === "yellow"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {h.score}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* LEGEND */}
      {items.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center gap-6 text-sm font-medium">
          <span className="flex items-center gap-2 text-zinc-400">
             <span className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500"></span> Healthy
          </span>
          <span className="flex items-center gap-2 text-zinc-400">
             <span className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500"></span> Moderate
          </span>
          <span className="flex items-center gap-2 text-zinc-400">
             <span className="w-3 h-3 rounded-full bg-rose-500/50 border border-rose-500"></span> Limit
          </span>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: "green" | "red";
}) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur shadow-lg text-center flex flex-col justify-center">
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">{title}</p>
      <p
        className={`text-3xl font-bold ${
          color === "green"
            ? "text-emerald-400"
            : color === "red"
            ? "text-rose-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
