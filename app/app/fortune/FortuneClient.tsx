"use client";

import { useState, useRef } from "react";

const animalEmoji: Record<string, string> = {
  Rat: "🐀", Ox: "🐂", Tiger: "🐅", Rabbit: "🐇", Dragon: "🐉", Snake: "🐍",
  Horse: "🐴", Goat: "🐐", Monkey: "🐒", Rooster: "🐓", Dog: "🐕", Pig: "🐖",
};

export default function FortuneClient({
  zodiac,
  name,
}: {
  zodiac: string | null;
  name: string | null;
}) {
  const [fortune, setFortune] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generateFortune = async () => {
    if (!zodiac || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFortune("");
    setLoading(true);

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: zodiac }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setFortune("Could not read your fortune. Please try again.");
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
                setFortune((prev) => prev + content);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setFortune("Could not read your fortune. Please try again.");
      }
    }

    setLoading(false);
  };

  if (!zodiac) {
    return (
      <div className="fortune-page">
        <div className="fortune-header">
          <span className="fortune-crystal">🔮</span>
          <h1 className="fortune-title">Fortune Teller</h1>
          <p className="fortune-subtitle">
            Set your date of birth in your{" "}
            <a href="/app/profile" className="fortune-link">profile</a>{" "}
            to unlock your personalized fortune reading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fortune-page">
      <div className="fortune-header">
        <span className="fortune-crystal">🔮</span>
        <h1 className="fortune-title">Fortune Teller</h1>
        <p className="fortune-subtitle">
          {name ? `${name}, your` : "Your"} zodiac sign
        </p>
      </div>

      <div className="fortune-sign-card">
        <span className="fortune-sign-emoji">{animalEmoji[zodiac] ?? "✨"}</span>
        <div className="fortune-sign-info">
          <span className="fortune-sign-label">Your Animal Sign</span>
          <span className="fortune-sign-name">{zodiac}</span>
        </div>
      </div>

      <button
        className="btn-primary fortune-btn"
        onClick={generateFortune}
        disabled={loading}
      >
        {loading ? "Reading the stars..." : "Get My Fortune"} ✨
      </button>

      {fortune && (
        <div className="fortune-result">
          <div className="fortune-result-text">{fortune}</div>
        </div>
      )}
    </div>
  );
}
