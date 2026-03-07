"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Candidate {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  bio: string | null;
  province: string | null;
  photo_url: string | null;
  zodiac: string | null;
}

export default function SwipeCard({
  candidates,
  userId,
}: {
  candidates: Candidate[];
  userId: string;
}) {
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const [swiping, setSwiping] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const current = candidates[index] ?? null;

  const handleSwipe = async (direction: "like" | "pass") => {
    if (swiping || !current) return;
    setSwiping(true);
    setExitDir(direction === "like" ? "right" : "left");

    await supabase.from("swipes").insert({
      swiper_id: userId,
      swiped_id: current.id,
      direction,
    });

    // Wait for exit animation
    setTimeout(() => {
      setExitDir(null);
      setIndex((i) => i + 1);
      setSwiping(false);
    }, 300);
  };

  if (!current) {
    return (
      <div className="swipe-empty">
        <div className="swipe-empty-icon">&#9825;</div>
        <h2>No more profiles</h2>
        <p>Check back later for new people</p>
      </div>
    );
  }

  return (
    <div className={`swipe-card ${exitDir ? `swipe-exit-${exitDir}` : ""}`}>
      <div className="swipe-card-photo">
        {current.photo_url ? (
          <img src={current.photo_url} alt={current.name} />
        ) : (
          <div className="swipe-card-placeholder">
            <span>&#128100;</span>
          </div>
        )}
      </div>
      <div className="swipe-card-info">
        <h2 className="swipe-card-name">
          {current.name}
          {current.age ? <span className="swipe-card-age">, {current.age}</span> : null}
        </h2>
        {current.province && (
          <p className="swipe-card-province">{current.province}</p>
        )}
        {current.zodiac && (
          <p className="swipe-card-zodiac">{current.zodiac}</p>
        )}
        {current.bio && (
          <p className="swipe-card-bio">{current.bio}</p>
        )}
      </div>
      <div className="swipe-actions">
        <button
          className="swipe-btn swipe-btn-pass"
          onClick={() => handleSwipe("pass")}
          disabled={swiping}
          aria-label="Pass"
        >
          &#10005;
        </button>
        <button
          className="swipe-btn swipe-btn-like"
          onClick={() => handleSwipe("like")}
          disabled={swiping}
          aria-label="Like"
        >
          &#9829;
        </button>
      </div>
    </div>
  );
}
