"use client";

import { useState } from "react";

export interface ProjectView {
  name: string;
  href: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  links?: { label: string; href: string }[];
}

// How many projects to show before "Show all".
const COLLAPSED_COUNT = 3;

function ProjectRow({ p }: { p: ProjectView }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/name font-medium text-neutral-100 hover:text-rose-400 transition-colors"
        >
          {p.name}
          <span className="ml-1 text-neutral-600 transition-colors group-hover/name:text-rose-400">
            ↗
          </span>
        </a>
        <span className="shrink-0 text-xs text-neutral-500 tabular-nums text-right">
          {p.metricLabel ? (
            <>
              <span className="text-neutral-300">{p.metricValue}</span>{" "}
              {p.metricLabel}
            </>
          ) : (
            p.metricValue
          )}
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-neutral-500 line-clamp-2 max-w-prose">
        {p.description}
      </p>
      {p.links && p.links.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 underline underline-offset-4 decoration-neutral-700 hover:text-neutral-200 hover:decoration-neutral-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectList({ projects }: { projects: ProjectView[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = projects.length > COLLAPSED_COUNT;
  const visible = expanded ? projects : projects.slice(0, COLLAPSED_COUNT);

  return (
    <div>
      <div className="relative">
        <div className="space-y-5">
          {visible.map((p) => (
            <ProjectRow key={p.name} p={p} />
          ))}
        </div>
        {/* Fade-out gradient hint when collapsed */}
        {hasMore && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        )}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="group mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-rose-400 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : `Show all ${projects.length}`}
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
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
      )}
    </div>
  );
}
