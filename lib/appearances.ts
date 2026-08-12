// Podcasts, talks, YouTube videos and other places I show up.
// Add entries here — newest first. `kind` drives the little label shown
// next to each item. Leave this list as-is until Pranay fills in real links.

export type AppearanceKind = "podcast" | "talk" | "video" | "article" | "interview";

export interface Appearance {
  title: string;
  href: string;
  outlet?: string; // show / channel / conference name
  date?: string; // YYYY or YYYY-MM-DD
  kind: AppearanceKind;
}

// TODO(pranay): replace these placeholders with your real appearances.
export const appearances: Appearance[] = [
  // {
  //   title: "How we built the Workflow SDK",
  //   href: "https://youtube.com/watch?v=...",
  //   outlet: "Some Podcast",
  //   date: "2026",
  //   kind: "podcast",
  // },
];
