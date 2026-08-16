import Link from "next/link";
import { privateLinks } from "@/lib/links";

// Never index or follow this page. The real access control is HTTP Basic Auth
// enforced in proxy.ts; this is defense-in-depth so it can't be cached/crawled.
export const metadata = {
  title: "Private",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
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
        <li key={l.href + l.label}>
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

export default function PrivateDashboard() {
  return (
    <main className="space-y-16">
      <header>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
          Private
        </h1>
        <p className="text-neutral-500 mt-2 text-sm max-w-prose">
          My personal jump list — every link and tool in one place. Not linked
          from anywhere public and blocked from search engines.
        </p>
      </header>

      <section>
        <SectionHeading>Links</SectionHeading>
        <InlineLinks items={privateLinks.socials} />
      </section>

      <section>
        <SectionHeading>Reach / Book</SectionHeading>
        <InlineLinks items={privateLinks.contact} />
      </section>

      <section>
        <SectionHeading>Tools</SectionHeading>
        <InlineLinks items={privateLinks.tools} />
      </section>

      <footer className="pt-8 border-t border-neutral-800">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← Public site
        </Link>
      </footer>
    </main>
  );
}
