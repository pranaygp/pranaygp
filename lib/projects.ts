// Projects to feature on the homepage. Each has a longer description than the
// essays/appearances (this section is meant to be more prominent) and ONE
// "featured" metric: either a live number fetched at request time, or a static
// highlight string.

export type FeaturedMetric =
  | { type: "vscode-installs"; extensionId: string; label: string }
  | { type: "npm-weekly"; pkg: string; label: string }
  | { type: "static"; value: string };

export interface Project {
  name: string;
  href: string;
  description: string;
  featured: FeaturedMetric;
  // optional secondary link shown as a pill (e.g. source, docs)
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
    name: "Qiuling",
    href: "https://qiuling.pranay.gp",
    description:
      "A personal writing script and font of my own design, inspired by Latin, Arabic, and Korean. A tinker project I write and journal in.",
    featured: { type: "static", value: "Personal project" },
    links: [
      // TODO(pranay): confirm the real repo URL for Qiuling.
      { label: "GitHub", href: "https://github.com/pranaygp/qiuling" },
    ],
  },
];
