// Projects to feature on the homepage. Each has a longer description than the
// essays/appearances (this section is meant to be more prominent) and ONE
// "featured" metric — either a live number fetched at request time, or a static
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
      "A durable execution framework for TypeScript, built at Vercel. Add \"use workflow\" to a function and it becomes a resumable, fault-tolerant workflow — every await is a checkpoint. It compiles plain async/await into durable state machines, so there's no DSL to learn.",
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
      "A VS Code extension that lets you peek and jump to CSS definitions directly from your HTML classes and IDs — like \"Go to Definition\" for stylesheets. One of the most-installed CSS tools in the marketplace.",
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
      "A personal writing script and font of my own design, inspired by Latin, Arabic, and Korean. A tinker project I actually use — I write and journal in it.",
    featured: { type: "static", value: "A personal font & script" },
  },
];
