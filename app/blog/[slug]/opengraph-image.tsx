import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";
import { getKudos } from "@/lib/kudos";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Essay by Pranay Prakash";

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "Pranay Prakash";
  const date = post?.date ?? "";
  let kudos = 0;
  try {
    kudos = await getKudos(slug);
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "80px",
          position: "relative",
        }}
      >
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
        <div style={{ display: "flex", fontSize: 28, color: "#737373" }}>
          Essay
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 66 : 82,
            fontWeight: 800,
            color: "#fafafa",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "#a3a3a3",
          }}
        >
          <span style={{ color: "#fb7185" }}>pranay.gp</span>
          <span>
            {date}
            {kudos > 0 ? `   ♥ ${kudos.toLocaleString()}` : ""}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
