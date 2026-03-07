import { ImageResponse } from "next/og";

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
        }}
      >
        <div
          style={{
            fontSize: "80px",
            marginBottom: "8px",
            display: "flex",
          }}
        >
          ❤️
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "white",
            display: "flex",
            marginBottom: "16px",
          }}
        >
          SnaehApp
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Find Love in Cambodia
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            marginTop: "16px",
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            display: "flex",
          }}
        >
          {"Cambodia's #1 Dating App"}
        </div>
      </div>
    ),
    { ...size }
  );
}
