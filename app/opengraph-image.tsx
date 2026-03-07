import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnaehApp — Find Love in Cambodia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8B1A28 0%, #C8273A 40%, #D4A84B 100%)",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28C16 28 4 21 4 12C4 7.5 8 4 12 6C14 7 15.2 9 16 10.5C16.8 9 18 7 20 6C24 4 28 7.5 28 12C28 21 16 28 16 28Z"
              fill="white"
            />
          </svg>
          <div style={{ fontSize: "64px", fontWeight: 600, color: "white" }}>
            SnaehApp
          </div>
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.1em",
          }}
        >
          Find Love in Cambodia
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.6)",
            marginTop: "16px",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          Cambodia&apos;s #1 Dating App
        </div>
      </div>
    ),
    { ...size }
  );
}
