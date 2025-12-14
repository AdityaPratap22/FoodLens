// app/scan/page.tsx
"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const BarcodeScanner = dynamic(() => import("../../components/BarcodeScanner"), { ssr: false });

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
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video / scanner area */}
        <div className="bg-white dark:bg-slate-800 border rounded-lg p-6 flex items-center justify-center">
          <div className="w-[400px] h-[400px] md:w-[400px] md:h-[300px] rounded-lg overflow-hidden mx-auto shadow-lg">
            <BarcodeScanner onDetected={handleDetected} />
          </div>
        </div>

        {/* Results area */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 border rounded-lg p-4 min-h-[120px]">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Scan Status
            </h2>
            {barcode ? (
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Detected:{" "}
                <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                  {barcode}
                </span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-500">
                Waiting for a barcode...
              </div>
            )}
            {loading && (
              <div className="mt-2 text-sm text-slate-500">
                Fetching product info...
              </div>
            )}
            {result?.error && (
              <div className="mt-2 text-sm text-rose-500">{result.error}</div>
            )}
          </div>

          {result?.product && (
            <div className="bg-slate-50 dark:bg-slate-900 border rounded-md p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    {result.product.product_name || "Unknown Product"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {result.product.brands || ""}
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-md font-semibold ${result.healthScore?.color === "green" ? "bg-emerald-500 text-white" : result.healthScore?.color === "yellow" ? "bg-amber-400 text-black" : "bg-rose-500 text-white"}`}
                  >
                    {result.healthScore?.score ?? "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(result.nutrition, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
