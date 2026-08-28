export default function RepostCallout({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return (
    <aside className="mb-10 flex gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
      <span aria-hidden="true" className="mt-px select-none text-neutral-600">
        ↩
      </span>
      <p className="text-sm leading-relaxed text-neutral-400">
        This is a repost. It originally appeared on the{" "}
        <a
          href={url}
          className="text-rose-400 underline decoration-rose-400/30 underline-offset-2 transition-colors hover:text-rose-300 hover:decoration-rose-300/50"
        >
          {name}
        </a>
        , where I wrote it.
      </p>
    </aside>
  );
}
