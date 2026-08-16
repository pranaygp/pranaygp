import { NextRequest, NextResponse } from "next/server";
import { getAllKudos, getKudos, addKudos } from "@/lib/kudos";

// Always run dynamically — kudos are live data, never cached at build.
export const dynamic = "force-dynamic";

// GET /api/kudos          -> { slug: count, ... } for all posts
// GET /api/kudos?slug=xyz -> { slug, count }
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (slug) {
    const count = await getKudos(slug);
    return NextResponse.json({ slug, count });
  }
  const all = await getAllKudos();
  return NextResponse.json(all);
}

// POST /api/kudos  body: { slug: string, by?: number }
// Adds kudos (clamped to 1..10 per request, matching Svbtle-style rapid taps).
export async function POST(req: NextRequest) {
  let body: { slug?: string; by?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const slug = (body.slug || "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  const by = Math.max(1, Math.min(10, Math.floor(Number(body.by) || 1)));
  try {
    const count = await addKudos(slug, by);
    return NextResponse.json({ slug, count });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
