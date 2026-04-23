"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { saveToHistory } from "../../utils/history";

const BarcodeScanner = dynamic(
  () => import("../../components/BarcodeScanner"),
  { ssr: false }
);

export default function ScanPage() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleDetected(code: string) {
    if (barcode === code) return;

    setBarcode(code);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scan/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code }),
      });

      const data = await res.json();
      setResult(data);

      if (data?.product && data?.healthScore) {
        saveToHistory({
          food: data.product.product_name || "Unknown Product",
          mode: "barcode",
          score: data.healthScore.score,
          color: data.healthScore.color,
          calories: data.nutrition?.calories,
          timestamp: new Date().toISOString(),
        });
      }

    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="hero-title text-center text-4xl mb-2">Barcode Scanner</h1>
      <p className="text-center text-zinc-400 mb-10 max-w-xl mx-auto font-light">
        Scan packaged food using your device's camera.
      </p>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Scanner Card */}
        <div className="card h-full flex flex-col p-4 animate-fade-in sm:p-6">
          <div className="w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
             <BarcodeScanner onDetected={handleDetected} />
          </div>
          
          <div className="mt-6 flex justify-center gap-4 text-sm font-medium">
             <Link href="/scan/image" className="text-zinc-400 hover:text-white transition-colors">📷 Try Image Scan</Link>
             <Link href="/scan/manual" className="text-zinc-400 hover:text-white transition-colors">✍️ Enter Manually</Link>
          </div>
        </div>

        {/* Result Card */}
        <div className="card h-full animate-fade-in space-y-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Analysis Result</h2>

          {!barcode && !loading && (
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
              <p className="text-zinc-500 font-medium">Waiting for barcode...</p>
            </div>
          )}

          {barcode && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-300">
                Detected Code: 
                <span className="ml-2 font-mono bg-zinc-950 px-2 py-1 rounded-md text-emerald-400 border border-emerald-500/20">{barcode}</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-emerald-400 font-medium my-4">
              <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              Fetching nutrition data...
            </div>
          )}

          {result?.error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-sm">
              <p>Scan Failed: {result.error}</p>
              {result.details && <p className="text-xs opacity-80 mt-1">{result.details}</p>}
            </div>
          )}

          {result?.product && (
            <div className="animate-fade-in">
              <div className="flex items-start justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    {result.product.product_name || "Unknown Product"}
                  </h3>
                  <p className="text-zinc-400 mt-1 uppercase tracking-wider text-xs font-semibold">{result.product.brands || "Unknown Brand"}</p>
                </div>

                <span
                  title="Health Score"
                  className={`text-lg px-4 py-2 rounded-xl flex items-center justify-center font-bold shadow-xl ${
                    result.healthScore?.color === "green"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : result.healthScore?.color === "yellow"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {result.healthScore?.score ?? "N/A"}
                </span>
              </div>

              <div className="mt-6">
                <h4 className="text-xs uppercase text-zinc-500 font-bold mb-3 tracking-wider">Nutrition Highlights</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                     <p className="text-xs text-zinc-500 mb-1">Calories</p>
                     <p className="font-semibold text-zinc-200">{result.nutrition?.calories || 0} kcal</p>
                  </div>
                  <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                     <p className="text-xs text-zinc-500 mb-1">Sugar</p>
                     <p className="font-semibold text-zinc-200">{result.nutrition?.sugar_g || 0} g</p>
                  </div>
                  <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                     <p className="text-xs text-zinc-500 mb-1">Fat</p>
                     <p className="font-semibold text-zinc-200">{result.nutrition?.fat_g || 0} g</p>
                  </div>
                  <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                     <p className="text-xs text-zinc-500 mb-1">Sodium</p>
                     <p className="font-semibold text-zinc-200">{result.nutrition?.sodium_mg || 0} mg</p>
                  </div>
                </div>
              </div>

              {((result.nutrition?.additives?.length > 0) || (result.nutrition?.allergens?.length > 0)) && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                   {result.nutrition?.allergens?.length > 0 && (
                     <div>
                       <p className="text-xs uppercase text-rose-400 font-bold mb-2 tracking-wider">Allergens</p>
                       <div className="flex flex-wrap gap-2">
                         {result.nutrition.allergens.map((alg: string) => (
                            <span key={alg} className="text-xs px-2 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-md">
                              {alg.replace("en:", "")}
                            </span>
                         ))}
                       </div>
                     </div>
                   )}
                   {result.nutrition?.additives?.length > 0 && (
                     <div>
                       <p className="text-xs uppercase text-amber-400 font-bold mb-2 tracking-wider">Additives</p>
                       <div className="flex flex-wrap gap-2">
                         {result.nutrition.additives.map((add: string) => (
                            <span key={add} className="text-xs px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                              {add.replace("en:", "")}
                            </span>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
