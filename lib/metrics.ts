// Fetches "live-ish" featured metrics for projects. Results are cached at the
// fetch layer (revalidate: 3600s) so we show fresh numbers without hammering
// upstream APIs on every request. All fetchers fail soft (return null) so a
// slow/down upstream never breaks the page.

const HOUR = 3600;

// VS Code Marketplace install count for an extension (e.g. "pranaygp.vscode-css-peek").
export async function getVscodeInstalls(
  extensionId: string
): Promise<number | null> {
  try {
    const res = await fetch(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          Accept: "application/json;api-version=7.2-preview.1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: [
            { criteria: [{ filterType: 7, value: extensionId }] },
          ],
          flags: 914,
        }),
        next: { revalidate: HOUR },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const ext = data?.results?.[0]?.extensions?.[0];
    const stat = ext?.statistics?.find(
      (s: { statisticName: string }) => s.statisticName === "install"
    );
    return stat ? Math.round(stat.value) : null;
  } catch {
    return null;
  }
}

// Weekly npm downloads for a package (e.g. "workflow").
export async function getNpmWeekly(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
      { next: { revalidate: HOUR } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.downloads === "number" ? data.downloads : null;
  } catch {
    return null;
  }
}

// Compact human number: 7924821 -> "7.9M", 896539 -> "897K".
export function compactNumber(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M";
  }
  if (n >= 1_000) {
    return Math.round(n / 1_000) + "K";
  }
  return String(n);
}
