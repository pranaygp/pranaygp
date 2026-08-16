import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs } from "@/lib/posts";
import { getKudos } from "@/lib/kudos";
import KudosButton from "@/components/KudosButton";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };
  const url = `https://pranay.gp/blog/${slug}`;
  const description = post.excerpt || `${post.title}. An essay by Pranay Prakash.`;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: "pranay.gp",
      type: "article",
      publishedTime: post.date || undefined,
      authors: ["Pranay Prakash"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: "@pranaygp",
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const kudos = await getKudos(slug);

  return (
    <main>
      <nav className="mb-12">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← Pranay Prakash
        </Link>
      </nav>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-100 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <time className="text-sm text-neutral-500 tabular-nums">
              {post.date}
            </time>
            {post.draft && (
              <span className="text-xs text-amber-500/80 font-medium uppercase tracking-wider">
                Draft
              </span>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-neutral-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      {/* Kudos — click the heart to show some love (up to 50, Svbtle-style) */}
      <div className="mt-14 flex flex-col items-center gap-3">
        <KudosButton slug={slug} initial={kudos} />
        <p className="text-xs text-neutral-600">
          Enjoyed this? Tap the heart.
        </p>
      </div>

      <footer className="mt-14 pt-8 border-t border-neutral-800">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All writing
        </Link>
      </footer>
    </main>
  );
}
