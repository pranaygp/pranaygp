"use client";

import { useState, Children } from "react";

// Wraps a list of children and shows only the first `collapsedCount` with a
// fade-out gradient + a "Show all / Show less" toggle. Used for Projects and
// the Elsewhere section so they share the same treatment.
export default function Collapsible({
  collapsedCount = 3,
  spacingClass = "space-y-5",
  noun,
  children,
}: {
  collapsedCount?: number;
  spacingClass?: string;
  noun?: string; // e.g. "10" -> "Show all 10"; falls back to count
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const hasMore = items.length > collapsedCount;
  const visible = expanded ? items : items.slice(0, collapsedCount);
  const label = noun ?? String(items.length);

  return (
    <div>
      <div className="relative">
        <div className={spacingClass}>{visible}</div>
        {hasMore && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        )}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-5 py-2.5 text-sm font-medium text-neutral-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show all ${label}`}
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
