import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

// Carry the info string of a fence (```ts title="foo.ts") through to the hast
// <code> element, which is where @shikijs/rehype looks for it.
function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, "code", (node) => {
      if (!node.meta) return;
      node.data ??= {};
      node.data.hProperties = {
        ...(node.data.hProperties ?? {}),
        metastring: node.meta,
      };
    });
  };
}

// Build the processor once — instantiating Shiki per post makes the build crawl.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCodeMeta)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeShiki, {
    theme: "vesper",
    transformers: [
      {
        name: "code-title",
        pre(node) {
          // Surface `title="foo.ts"` as a data attribute; globals.css draws the
          // filename bar from it, so no extra wrapper markup is needed.
          const raw = this.options.meta?.__raw ?? "";
          const match = raw.match(/title="([^"]+)"/);
          if (match) node.properties["data-title"] = match[1];
        },
      },
    ],
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function renderMarkdown(content: string): Promise<string> {
  const file = await processor.process(content);
  return String(file);
}
