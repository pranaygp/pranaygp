"use client";

import { useEffect, useRef, useState } from "react";

// Max kudos a single visitor can add to one post (Svbtle capped at 50).
const PER_VISITOR_CAP = 50;

function heartKey(slug: string) {
  return `kudos:given:${slug}`;
}

export default function KudosButton({
  slug,
  initial,
}: {
  slug: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [given, setGiven] = useState(0);
  const [burst, setBurst] = useState(false);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(0);

  // Load how many this visitor has already given + refresh the live count.
  useEffect(() => {
    try {
      const g = parseInt(localStorage.getItem(heartKey(slug)) || "0", 10);
      if (!Number.isNaN(g)) setGiven(g);
    } catch {}
    let alive = true;
    fetch(`/api/kudos?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug]);

  const maxedOut = given >= PER_VISITOR_CAP;

  // Debounce rapid taps into one POST so a flurry of clicks is a single write.
  function flush() {
    const by = pending.current;
    pending.current = 0;
    if (by <= 0) return;
    fetch("/api/kudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, by }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
  }

  function give() {
    if (maxedOut) return;
    const nextGiven = Math.min(PER_VISITOR_CAP, given + 1);
    const delta = nextGiven - given;
    if (delta <= 0) return;

    setGiven(nextGiven);
    setCount((c) => c + delta);
    pending.current += delta;
    try {
      localStorage.setItem(heartKey(slug), String(nextGiven));
    } catch {}

    // pop animation
    setBurst(true);
    window.setTimeout(() => setBurst(false), 260);

    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, 650);
  }

  return (
    <button
      onClick={give}
      disabled={maxedOut}
      aria-label={maxedOut ? "Kudos maxed out, thank you!" : "Give kudos"}
      title={
        maxedOut
          ? "You've given the max kudos, thank you!"
          : "Give kudos"
      }
      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        given > 0
          ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
          : "border-neutral-700 text-neutral-300 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300"
      } ${maxedOut ? "cursor-default opacity-90" : "cursor-pointer"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-transform duration-200 ${
          burst ? "scale-125" : "scale-100"
        } ${given > 0 ? "fill-rose-400 stroke-rose-400" : "fill-none stroke-current group-hover:fill-rose-400/30"}`}
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 4.8 5.2 4.2 7.3 3.8 9 4.9 12 8c3-3.1 4.7-4.2 6.8-3.8C22 4.8 23.6 8.3 22 11.7 19.5 16.4 12 21 12 21z" />
      </svg>
      <span className="tabular-nums font-medium">{count.toLocaleString()}</span>
    </button>
  );
}
