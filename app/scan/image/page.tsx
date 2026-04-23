"use client";

import { useState, useRef } from "react";
import { saveToHistory } from "../../../utils/history";

export default function ScanImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverOffline, setServerOffline] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleDropFile(file: File) {
    setResp(null);
    setError(null);
    setServerOffline(false);
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Please select an image.");

    setLoading(true);
    setError(null);
    setResp(null);
    setServerOffline(false);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/scan/image", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "inference_offline") {
          setServerOffline(true);
          throw new Error(data.message);
        }
        throw new Error(data.error || "Inference failed");
      }

      setResp(data);

      if (data.healthScore) {
        saveToHistory({
          food: data.predictions?.[0]?.label || "Unknown",
          mode: "image",
          score: data.healthScore?.score,
          color: data.healthScore?.color,
          calories: data.est_nutrition?.calories,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="hero-title text-4xl mb-3">AI Image Recognition</h1>
        <p className="text-zinc-400 font-light text-lg">
          Snap a photo of street food and let deep learning estimate its nutritional value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Upload Card */}
        <div className="card w-full animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) handleDropFile(droppedFile);
              }}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white/5
                ${dragActive ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]" : "border-white/20 hover:border-white/40 hover:bg-white/10"}
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleDropFile(f);
                }}
              />

              {!file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-2">📸</div>
                  <p className="font-semibold text-white text-lg">Upload an image</p>
                  <p className="text-sm text-zinc-500">Tap to take photo or strictly drop JPG/PNG here.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">✓</div>
                   <p className="font-medium text-emerald-400 truncate max-w-[200px]">{file.name}</p>
                   <p className="text-xs text-zinc-500">(Click to change)</p>
                </div>
              )}
            </div>

            {preview && (
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative bg-black/50 aspect-video flex justify-center items-center">
                <img src={preview} alt="preview" className="max-w-full max-h-[300px] object-cover" />
              </div>
            )}

            <button type="submit" disabled={loading} className="primary-btn w-full py-4 text-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing with AI...
                </span>
              ) : "Analyze Image"}
            </button>
          </form>

          {error && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium border ${serverOffline ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              <div className="flex items-start gap-2">
                 <span>{serverOffline ? '⚠️' : '❌'}</span>
                 <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="card h-full animate-fade-in relative min-h-[300px]">
          <h2 className="text-2xl font-semibold text-white mb-6">AI Prediction</h2>
          
          {!resp && !loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center top-14">
               <div className="text-6xl opacity-10 mb-4">🤖</div>
               <p className="text-zinc-500 font-medium text-center">Upload an image to see<br/>AI predictions here.</p>
             </div>
          )}

          {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center top-14 gap-4">
               <div className="text-4xl animate-bounce">🧠</div>
               <p className="text-emerald-400 font-medium">Running deep learning model...</p>
             </div>
          )}

          {resp && resp.predictions?.length > 0 && (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-wrap items-end justify-between border-b border-white/10 pb-6 gap-4">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent capitalize">
                    {resp.predictions[0].label}
                  </p>
                  <p className="text-sm font-medium text-zinc-400 mt-2 flex items-center gap-2">
                    <span className="inline-block w-full max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden">
                       <span className="block h-full bg-emerald-500" style={{ width: `${resp.predictions[0].confidence * 100}%` }}></span>
                    </span>
                    Confidence: {(resp.predictions[0].confidence * 100).toFixed(1)}%
                  </p>
                </div>
                {resp.healthScore && (
                  <span
                    className={`px-5 py-2 rounded-xl text-lg font-bold shadow-xl ${
                      resp.healthScore.color === "green"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : resp.healthScore.color === "yellow"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    Score: {resp.healthScore.score}
                  </span>
                )}
              </div>

              {resp.est_nutrition && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-4">Estimated Nutrition</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(resp.est_nutrition).filter(([k]) => k !== "isPackaged").map(([k, v]) => (
                       <div key={k} className="bg-zinc-950 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                          <span className="text-sm text-zinc-400 capitalize">{k.replace("_g", "").replace("_mg", "")}</span>
                          <span className="font-semibold text-zinc-200">{String(v)}</span>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {resp && resp.predictions?.length === 0 && (
             <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <p>⚠️ {resp.message}</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
