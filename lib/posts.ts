import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  tags: string[];
  excerpt: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

const BLOG_DIR = path.join(process.cwd(), "blog");

function getPostDirs(): { dir: string; isDraft: boolean }[] {
  const dirs: { dir: string; isDraft: boolean }[] = [];
  const draftsDir = path.join(BLOG_DIR, "drafts");
  const postsDir = path.join(BLOG_DIR, "posts");

  if (fs.existsSync(draftsDir)) {
    dirs.push({ dir: draftsDir, isDraft: true });
  }
  if (fs.existsSync(postsDir)) {
    dirs.push({ dir: postsDir, isDraft: false });
  }
  return dirs;
}

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  for (const { dir, isDraft } of getPostDirs()) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(dir, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      // Extract first paragraph as excerpt
      const excerpt =
        content
          .split("\n\n")
          .find((p) => p.trim() && !p.startsWith("#"))
          ?.replace(/[#*_`\[\]]/g, "")
          .trim()
          .slice(0, 200) || "";

      posts.push({
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        draft: data.draft ?? isDraft,
        tags: data.tags || [],
        excerpt,
      });
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllSlugs(): string[] {
  const slugs: string[] = [];
  for (const { dir } of getPostDirs()) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      slugs.push(file.replace(/\.md$/, ""));
    }
  }
  return slugs;
}

export async function getPost(slug: string): Promise<Post | null> {
  for (const { dir, isDraft } of getPostDirs()) {
    const filePath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      const result = await remark().use(html, { sanitize: false }).process(content);
      const contentHtml = result.toString();

      const excerpt =
        content
          .split("\n\n")
          .find((p) => p.trim() && !p.startsWith("#"))
          ?.replace(/[#*_`\[\]]/g, "")
          .trim()
          .slice(0, 200) || "";

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        draft: data.draft ?? isDraft,
        tags: data.tags || [],
        excerpt,
        contentHtml,
      };
    }
  }
  return null;
}
