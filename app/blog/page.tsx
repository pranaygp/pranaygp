import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main>
      <header className="mb-16">
        <Link href="/blog" className="group">
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
            pranay.gp
          </h1>
        </Link>
        <p className="text-neutral-500 mt-1 text-sm">
          Pranay Prakash
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-neutral-500">No posts yet.</p>
      ) : (
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <time className="text-sm text-neutral-500 tabular-nums shrink-0">
                    {post.date}
                  </time>
                  {post.draft && (
                    <span className="text-xs text-amber-500/80 font-medium uppercase tracking-wider">
                      Draft
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-neutral-100 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-neutral-400 mt-2 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
