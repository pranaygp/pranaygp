import Link from "next/link";
import { getVisiblePosts } from "@/lib/posts";
import { socials, contact, tools } from "@/lib/links";
import { appearances } from "@/lib/appearances";

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
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
          Pranay Prakash
        </h1>
        <p className="text-neutral-400 mt-3 leading-relaxed max-w-prose">
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
          <ul className="space-y-3">
            {talks.map((a) => (
              <li key={a.href} className="flex items-baseline gap-3">
                <time className="text-sm text-neutral-600 tabular-nums shrink-0 w-12">
                  {a.date.slice(0, 4)}
                </time>
                <span className="min-w-0">
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-200 hover:text-blue-400 transition-colors"
                  >
                    {a.title}
                  </a>
                  <span className="text-neutral-600 text-sm ml-2">
                    {kindLabel[a.kind] ?? a.kind}
                    {a.outlet ? ` · ${a.outlet}` : ""}
                  </span>
                  {a.note && (
                    <span className="block text-neutral-600 text-xs mt-0.5">
                      {a.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
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
