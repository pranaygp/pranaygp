// Projects to feature on the homepage. Each has a short description (max ~2
// lines) and ONE "featured" metric: either a live number fetched at request
// time, or a static highlight string.

export type FeaturedMetric =
  | { type: "vscode-installs"; extensionId: string; label: string }
  | { type: "npm-weekly"; pkg: string; label: string }
  | { type: "github-stars"; repo: string; label: string }
  | { type: "static"; value: string };

export interface Project {
  name: string;
  href: string;
  description: string;
  featured: FeaturedMetric;
  archived?: boolean;
  // optional secondary links (source, docs)
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    name: "Workflow SDK",
    href: "https://workflow-sdk.dev/",
    description:
      "A durable execution framework for TypeScript. Add \"use workflow\" and your async functions become resumable and fault-tolerant. No DSL, just JavaScript.",
    featured: { type: "npm-weekly", pkg: "workflow", label: "weekly npm downloads" },
    links: [
      { label: "Docs", href: "https://workflow-sdk.dev/" },
      { label: "GitHub", href: "https://github.com/vercel/workflow" },
    ],
  },
  {
    name: "CSS Peek",
    href: "https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek",
    description:
      "A VS Code extension to peek and jump to CSS definitions from your HTML classes and IDs. Like \"Go to Definition\" for stylesheets.",
    featured: {
      type: "vscode-installs",
      extensionId: "pranaygp.vscode-css-peek",
      label: "installs on VS Code",
    },
    links: [
      { label: "GitHub", href: "https://github.com/pranaygp/vscode-css-peek" },
    ],
  },
  {
    name: "Windsor",
    href: "https://windsor.io",
    description:
      "My startup for 5 years (YC W19). Personalized video at scale for D2C brands. Acquired by Front in 2023.",
    featured: { type: "static", value: "YC W19 · acquired 2023" },
  },
  {
    name: "Qiuling",
    href: "https://qiuling.pranay.gp",
    description:
      "A personal writing script and font of my own design, inspired by Latin, Arabic, and Korean. A tinker project I write and journal in.",
    featured: { type: "static", value: "Personal project" },
  },
  {
    name: "Inclusive Avatars",
    href: "https://avatar.pranay.gp/",
    description:
      "A tiny service that generates inclusive, diverse default avatars for users from a seed.",
    featured: { type: "static", value: "Side project" },
  },
  {
    name: "mdx-code",
    href: "https://github.com/pranaygp/mdx-code",
    description:
      "An MDX Deck layout that turns code blocks on a slide into a live, runnable RunKit playground.",
    featured: { type: "github-stars", repo: "pranaygp/mdx-code", label: "GitHub stars" },
    archived: true,
    links: [{ label: "GitHub", href: "https://github.com/pranaygp/mdx-code" }],
  },
  {
    name: "browse",
    href: "https://github.com/windsorio/browse",
    description:
      "An early exploration in language design: a declarative language for web scraping, automation, and UI testing.",
    featured: { type: "github-stars", repo: "windsorio/browse", label: "GitHub stars" },
    links: [{ label: "GitHub", href: "https://github.com/windsorio/browse" }],
  },
  {
    name: "keynote-parser",
    href: "https://github.com/pranaygp/keynote-parser",
    description:
      "A Node library that parses Apple Keynote (.key) files.",
    featured: {
      type: "github-stars",
      repo: "pranaygp/keynote-parser",
      label: "GitHub stars",
    },
    links: [
      { label: "GitHub", href: "https://github.com/pranaygp/keynote-parser" },
    ],
  },
  {
    name: "pedit",
    href: "https://github.com/pranaygp/pedit",
    description:
      "One of my first open-source devtools, made to learn. An easy way to make any website editable, from before I knew what a CDN was.",
    featured: { type: "static", value: "2016 · early project" },
    archived: true,
    links: [{ label: "GitHub", href: "https://github.com/pranaygp/pedit" }],
  },
  {
    name: "birdle",
    href: "https://github.com/pranaygp/birdle",
    description:
      "An MP3 downloader I built in high school, used by me and my classmates. One of my oldest projects, from just after I learned Git.",
    featured: { type: "static", value: "2015 · high school" },
    archived: true,
    links: [{ label: "GitHub", href: "https://github.com/pranaygp/birdle" }],
  },
];
