"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const lastResultRef = useRef(null);

  const [status, setStatus] = useState("Initializing camera…");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const reader = new BrowserMultiFormatReader(undefined, 500);
    readerRef.current = reader;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera not supported");
        }

        setStatus("Requesting camera permission…");

        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        setStatus("Scanning barcode…");

        await reader.decodeFromVideoDevice(
          undefined, // auto-select back camera
          videoRef.current,
          (result, err) => {
            if (!active) return;

            if (result) {
              const text = result.getText();

              if (lastResultRef.current === text) return;
              lastResultRef.current = text;

              setStatus(`Detected: ${text}`);
              onDetected?.(text);
            }
          }
        );
      } catch (e) {
        console.error("Barcode scanner error:", e);
        setError("Camera access failed. Allow permission and reload.");
      }
    }

    start();

    return () => {
      active = false;
      try {
        reader.reset();
      } catch {}
    };
  }, [onDetected]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Scan box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-40 border-2 border-green-400 rounded-md opacity-80" />
      </div>

      {/* Status */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded">
        {error ? error : status}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
    </div>
  );
}
