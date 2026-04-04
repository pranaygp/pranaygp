import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs } from "@/lib/posts";

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
  return {
    title: post.title,
    description: post.excerpt,
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

  return (
    <main>
      <nav className="mb-12">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← Back
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
                <span
                  key={tag}
                  className="text-xs text-neutral-500"
                >
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

      <footer className="mt-16 pt-8 border-t border-neutral-800">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All posts
        </Link>
      </footer>
    </main>
  );
}
