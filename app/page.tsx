import Link from "next/link";
import Image from "next/image";
import { getVisiblePosts } from "@/lib/posts";
import { socials, contact, tools } from "@/lib/links";
import { appearances, youTubeThumb } from "@/lib/appearances";

export const metadata = {
  title: "Pranay Prakash",
  description: "Pranay Prakash — engineer. Writing, work, and links.",
};

const kindLabel: Record<string, string> = {
  podcast: "Podcast",
  talk: "Talk",
  keynote: "Keynote",
  video: "Video",
  article: "Article",
  interview: "Interview",
};

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.35.22.46.68.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.54-1.8c4.37-1.32 9.8-.68 13.5 1.6.44.27.58.85.3 1.29zm.13-3.4C15.24 8.4 8.82 8.2 5.1 9.33a1.12 1.12 0 1 1-.65-2.15c4.27-1.3 11.36-1.05 15.85 1.61a1.12 1.12 0 1 1-1.15 1.93z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

// Small brand-styled pill linking out to a platform.
function PlatformPill({
  href,
  icon,
  label,
  brand,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  brand: "youtube" | "spotify";
}) {
  const brandClasses =
    brand === "youtube"
      ? "hover:border-[#FF0000]/60 hover:text-[#FF4545] hover:bg-[#FF0000]/10"
      : "hover:border-[#1DB954]/60 hover:text-[#1DB954] hover:bg-[#1DB954]/10";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300 transition-colors ${brandClasses}`}
    >
      {icon}
      {label}
    </a>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-4">
      {children}
    </h2>
  );
}

function InlineLinks({
  items,
}: {
  items: { label: string; href: string; note?: string }[];
}) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            className="text-neutral-300 hover:text-blue-400 underline underline-offset-4 decoration-neutral-700 hover:decoration-blue-400/50 transition-colors"
          >
            {l.label}
          </a>
          {l.note && (
            <span className="text-neutral-600 text-sm ml-1">({l.note})</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const posts = getVisiblePosts().slice(0, 5);
  const talks = [...appearances].sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <main className="space-y-16">
      {/* Intro */}
      <header>
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.webp"
            alt="Pranay Prakash"
            width={56}
            height={56}
            priority
            className="rounded-full border border-neutral-800 shrink-0"
          />
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
            Pranay Prakash
          </h1>
        </div>
        <p className="text-neutral-400 mt-4 leading-relaxed max-w-prose">
          Engineer. I build developer tools — most recently the{" "}
          <a
            href="https://useworkflow.dev"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/30"
          >
            Workflow SDK
          </a>{" "}
          at Vercel. This is where I keep my writing, a few things I&apos;ve
          made, and the places you can find me.
        </p>
      </header>

      {/* Writing */}
      <section>
        <SectionHeading>Writing</SectionHeading>
        {posts.length === 0 ? (
          <p className="text-neutral-500 text-sm">Nothing published yet.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline gap-3"
                >
                  <time className="text-sm text-neutral-600 tabular-nums shrink-0 w-24">
                    {post.date}
                  </time>
                  <span className="text-neutral-200 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </span>
                  {post.draft && (
                    <span className="text-[10px] text-amber-500/80 font-medium uppercase tracking-wider shrink-0">
                      Draft
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4">
          <Link
            href="/blog"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            All essays →
          </Link>
        </p>
      </section>

      {/* Appearances */}
      {talks.length > 0 && (
        <section>
          <SectionHeading>Elsewhere</SectionHeading>
          <ul className="space-y-4">
            {talks.map((a) => {
              const thumb = youTubeThumb(a.href);
              return (
                <li key={a.href} className="group flex gap-4">
                  {thumb && (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative shrink-0 overflow-hidden rounded-md border border-neutral-800 w-28 sm:w-32 aspect-video bg-neutral-900"
                      aria-label={a.title}
                    >
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* play glyph */}
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-colors group-hover:bg-black/70">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 translate-x-[1px] fill-white"
                            aria-hidden
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  )}
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-baseline gap-2">
                      <time className="text-xs text-neutral-600 tabular-nums shrink-0">
                        {a.date.slice(0, 4)}
                      </time>
                      <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                        {kindLabel[a.kind] ?? a.kind}
                        {a.outlet ? ` · ${a.outlet}` : ""}
                      </span>
                    </div>
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block text-neutral-200 leading-snug group-hover:text-blue-400 transition-colors"
                    >
                      {a.title}
                    </a>
                    {a.note && (
                      <span className="mt-0.5 block text-xs text-neutral-600">
                        {a.note}
                      </span>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PlatformPill
                        href={a.href}
                        brand="youtube"
                        label="YouTube"
                        icon={<YouTubeIcon className="h-3.5 w-3.5" />}
                      />
                      {a.spotify && (
                        <PlatformPill
                          href={a.spotify}
                          brand="spotify"
                          label="Spotify"
                          icon={<SpotifyIcon className="h-3.5 w-3.5" />}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Links */}
      <section>
        <SectionHeading>Links</SectionHeading>
        <InlineLinks items={socials} />
      </section>

      {/* Contact */}
      <section>
        <SectionHeading>Reach me</SectionHeading>
        <InlineLinks items={contact} />
      </section>

      {/* Tools / linktree */}
      <section>
        <SectionHeading>Tools</SectionHeading>
        <InlineLinks items={tools} />
      </section>
    </main>
  );
}
