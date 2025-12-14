"use client";

import React, { useState } from "react";

export default function ScanImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResp(null);
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Please choose an image first.");

    setLoading(true);
    setError(null);
    setResp(null);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/scan/image", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || JSON.stringify(data));
      } else {
        setResp(data);
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 border rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Scan Image (Street Food)</h1>
        <p className="text-sm text-slate-500 mb-4">Upload a photo of a dish — the system will return a predicted label and estimated nutrition (stubbed for now).</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {preview && (
            <div className="border rounded-md overflow-hidden w-full max-w-md">
              <img src={preview} alt="preview" className="w-full object-cover" />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Analyze Image"}
            </button>
          </div>
        </form>

        {error && <div className="mt-4 text-sm text-rose-500">{error}</div>}

        {resp && (
          <div className="mt-6 bg-slate-50 dark:bg-slate-900 border rounded-md p-4">
            <h3 className="font-medium">Prediction</h3>

            <div className="mt-2">
              {resp.predictions?.length ? (
                <ul className="list-disc list-inside text-sm">
                  {resp.predictions.map((p: any, i: number) => (
                    <li key={i}>
                      <strong>{p.label}</strong> — confidence: {(p.confidence * 100).toFixed(1)}%
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-slate-500">No predictions returned.</div>
              )}
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Estimated Nutrition</h4>
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(resp.est_nutrition, null, 2)}</pre>
            </div>

            <div className="mt-3">
              <h4 className="font-medium">Health Score</h4>
              <div>
                <span className={`inline-block px-3 py-1 rounded-md font-semibold ${resp.healthScore?.color === 'green' ? 'bg-emerald-500 text-white' : resp.healthScore?.color === 'yellow' ? 'bg-amber-400 text-black' : 'bg-rose-500 text-white'}`}>
                  {resp.healthScore?.score ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
