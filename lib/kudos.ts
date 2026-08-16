import { neon } from "@neondatabase/serverless";

// Baseline kudos imported from the old Svbtle blog. These seed the DB the first
// time a post is seen so we never start below the historical count, then live
// clicks accumulate on top.
export const svbtleBaseline: Record<string, number> = {
  "how-to-learn-things-at-1000x-the-speed": 1552,
  "a-case-for-nihilism": 63,
  "musings-on-a-train-to-paris": 17,
  "rfc-request-for-company-a-videobook-platform": 27,
  "say-their-name": 55,
};

function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

let ensured = false;
async function ensureTable() {
  if (ensured) return;
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS kudos (
      slug TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `;
  ensured = true;
}

// Read current kudos for every known slug (baseline + any live rows), merged.
export async function getAllKudos(): Promise<Record<string, number>> {
  try {
    await ensureTable();
    const sql = db();
    const rows = (await sql`SELECT slug, count FROM kudos`) as {
      slug: string;
      count: number;
    }[];
    const result: Record<string, number> = { ...svbtleBaseline };
    for (const r of rows) result[r.slug] = r.count;
    return result;
  } catch {
    // If the DB is unreachable, fall back to the static baseline so the site
    // still renders sensible numbers.
    return { ...svbtleBaseline };
  }
}

export async function getKudos(slug: string): Promise<number> {
  const all = await getAllKudos();
  return all[slug] ?? 0;
}

// Atomically add `by` kudos to a slug, seeding from the Svbtle baseline the
// first time the row is created. Returns the new count.
export async function addKudos(slug: string, by: number = 1): Promise<number> {
  await ensureTable();
  const sql = db();
  const seed = svbtleBaseline[slug] ?? 0;
  const rows = (await sql`
    INSERT INTO kudos (slug, count)
    VALUES (${slug}, ${seed + by})
    ON CONFLICT (slug)
    DO UPDATE SET count = kudos.count + ${by}
    RETURNING count
  `) as { count: number }[];
  return rows[0]?.count ?? seed + by;
}
