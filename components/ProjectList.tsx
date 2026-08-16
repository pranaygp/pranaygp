import Collapsible from "@/components/Collapsible";

export interface ProjectView {
  name: string;
  href: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  links?: { label: string; href: string }[];
}

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
  return (
    <Collapsible collapsedCount={3} spacingClass="space-y-5">
      {projects.map((p) => (
        <ProjectRow key={p.name} p={p} />
      ))}
    </Collapsible>
  );
}
