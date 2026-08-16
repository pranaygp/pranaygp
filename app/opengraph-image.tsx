import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Homepage Open Graph / Twitter card image (1200x630), generated at build/edge.
export const runtime = "nodejs";
export const alt = "Pranay Prakash, engineer building developer tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  // Load the avatar and inline it as a data URI (ImageResponse can't fetch relative URLs).
  let avatarSrc: string | null = null;
  try {
    const buf = await readFile(join(process.cwd(), "public", "avatar.jpg"));
    avatarSrc = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* subtle top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg,#fb7185,#f43f5e)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {avatarSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              width={120}
              height={120}
              style={{ borderRadius: 120, border: "2px solid #262626" }}
              alt=""
            />
          )}
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              color: "#fafafa",
              letterSpacing: "-0.03em",
            }}
          >
            Pranay Prakash
          </div>
        </div>
        <div
          style={{
            fontSize: 38,
            color: "#a3a3a3",
            marginTop: 32,
            lineHeight: 1.35,
            maxWidth: 950,
          }}
        >
          Engineer. I build developer tools, most recently the Workflow SDK at
          Vercel.
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 44,
            fontSize: 28,
            color: "#525252",
          }}
        >
          <span style={{ color: "#fb7185" }}>pranay.gp</span>
          <span>·</span>
          <span>Writing · Projects · Talks</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
