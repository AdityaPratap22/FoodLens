// components/BarcodeScanner.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    let active = true;
    const start = async () => {
      try {
        // request permission first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (permErr) {
            throw new Error("Camera permission required. Allow camera and refresh.");
          }
        }

        // select a video device (standard API)
        let deviceId;
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          deviceId = videoInputs[0]?.deviceId;
        }

        await codeReaderRef.current.decodeFromVideoDevice(
          deviceId || undefined,
          videoRef.current,
          (result, err) => {
            if (!active) return;
            if (result && typeof onDetected === "function") {
              onDetected(result.getText());
            }
          }
        );
      } catch (e) {
        console.error("BarcodeScanner start error:", e);
        setError(e.message || "Camera / scanner error");
      }
    };

    start();

    return () => {
      active = false;
      try {
        if (codeReaderRef.current) codeReaderRef.current.reset();
      } catch (e) {}
    };
  }, [onDetected]);

  return (
    <div className="w-full h-full">
      {error && <p className="text-rose-500 text-sm mb-2">Error: {error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
