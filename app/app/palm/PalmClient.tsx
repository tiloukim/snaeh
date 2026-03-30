"use client";

import { useState, useRef } from "react";

const animalEmoji: Record<string, string> = {
  Rat: "🐀", Ox: "🐂", Tiger: "🐅", Rabbit: "🐇", Dragon: "🐉", Snake: "🐍",
  Horse: "🐴", Goat: "🐐", Monkey: "🐒", Rooster: "🐓", Dog: "🐕", Pig: "🐖",
};

const COMPATIBLE_SIGNS: Record<string, string[]> = {
  Rat: ["Dragon", "Monkey", "Ox"],
  Ox: ["Rat", "Snake", "Rooster"],
  Tiger: ["Horse", "Dog", "Pig"],
  Rabbit: ["Goat", "Dog", "Pig"],
  Dragon: ["Rat", "Monkey", "Rooster"],
  Snake: ["Ox", "Rooster", "Dragon"],
  Horse: ["Tiger", "Goat", "Dog"],
  Goat: ["Rabbit", "Horse", "Pig"],
  Monkey: ["Rat", "Dragon", "Snake"],
  Rooster: ["Ox", "Snake", "Dragon"],
  Dog: ["Tiger", "Rabbit", "Horse"],
  Pig: ["Tiger", "Rabbit", "Goat"],
};

export default function PalmClient({
  zodiac,
  name,
  dateOfBirth,
}: {
  zodiac: string | null;
  name: string | null;
  dateOfBirth: string | null;
}) {
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Compress image
    const img = new window.Image();
    img.onload = () => {
      const maxSize = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round((h * maxSize) / w); w = maxSize; }
        else { w = Math.round((w * maxSize) / h); h = maxSize; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      setPalmImage(canvas.toDataURL("image/jpeg", 0.7));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = "";
  }

  async function readPalm() {
    if (!palmImage || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setReading("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/palm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: palmImage,
          zodiac: zodiac || null,
          name: name || null,
          dateOfBirth: dateOfBirth || null,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setError("Could not read your palm. Please try again.");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const { content } = JSON.parse(data);
              if (content) {
                setReading((prev) => prev + content);
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Could not read your palm. Please try again.");
      }
    }

    setLoading(false);
  }

  const compatible = zodiac ? COMPATIBLE_SIGNS[zodiac] ?? [] : [];

  return (
    <div className="fortune-page">
      <div className="fortune-header">
        <span className="fortune-crystal">✋</span>
        <h1 className="fortune-title">Palm Reading</h1>
        <p className="fortune-subtitle">
          បកស្រាយបន្ទាត់ដៃ — Upload a photo of your palm to reveal your destiny
        </p>
      </div>

      {/* Zodiac info */}
      {zodiac && (
        <div className="fortune-sign-card">
          <span className="fortune-sign-emoji">{animalEmoji[zodiac] ?? "✨"}</span>
          <div className="fortune-sign-info">
            <span className="fortune-sign-label">
              {name ? `${name}'s` : "Your"} Animal Sign
            </span>
            <span className="fortune-sign-name">{zodiac}</span>
          </div>
        </div>
      )}

      {/* Compatible signs */}
      {zodiac && compatible.length > 0 && (
        <div style={{
          background: "rgba(232,69,74,0.08)",
          border: "1px solid rgba(232,69,74,0.2)",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 20,
          textAlign: "center",
        }}>
          <p style={{ fontSize: 12, color: "#8B1A28", fontWeight: 600, marginBottom: 8 }}>
            💕 Compatible Signs
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {compatible.map((sign) => (
              <div key={sign} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 28 }}>{animalEmoji[sign]}</span>
                <p style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{sign}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload area */}
      {palmImage ? (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={palmImage}
            alt="Your palm"
            style={{
              maxWidth: "100%",
              maxHeight: 300,
              borderRadius: 16,
              border: "2px solid rgba(232,69,74,0.3)",
            }}
          />
          <div style={{ marginTop: 10 }}>
            <button
              className="btn-outline"
              onClick={() => { setPalmImage(null); setReading(""); setError(""); }}
              style={{ fontSize: 13 }}
            >
              Remove & Upload New
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <button
            className="btn-outline"
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%",
              padding: "28px 20px",
              border: "2px dashed rgba(232,69,74,0.3)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 40 }}>🤚</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Upload Palm Photo
            </span>
            <span style={{ fontSize: 12, color: "#999" }}>
              Take a clear photo of your open palm
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Read button */}
      {palmImage && !reading && (
        <button
          className="btn-primary fortune-btn"
          onClick={readPalm}
          disabled={loading}
        >
          {loading ? "Reading your palm..." : "Read My Palm"} 🔮
        </button>
      )}

      {error && (
        <div style={{
          background: "rgba(220,50,50,0.1)",
          border: "1px solid rgba(220,50,50,0.2)",
          borderRadius: 12,
          padding: "12px 16px",
          color: "#c33",
          fontSize: 14,
          marginTop: 12,
        }}>
          {error}
        </div>
      )}

      {/* Reading result */}
      {reading && (
        <div className="fortune-result">
          <div className="fortune-result-text">{reading}</div>
        </div>
      )}
    </div>
  );
}
