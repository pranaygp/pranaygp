// Read-only kudos display (heart + count) for listings. Server-renderable.
export default function KudosBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 text-neutral-500 tabular-nums">
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 fill-rose-400/80 stroke-rose-400/80"
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 4.8 5.2 4.2 7.3 3.8 9 4.9 12 8c3-3.1 4.7-4.2 6.8-3.8C22 4.8 23.6 8.3 22 11.7 19.5 16.4 12 21 12 21z" />
      </svg>
      {count.toLocaleString()}
    </span>
  );
}
