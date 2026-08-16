// Podcasts, talks, keynotes, and other places I show up.
// Sorted for display by date (newest first) in app/page.tsx — you can add
// entries here in any order. `kind` drives the little label shown next to each.

export type AppearanceKind =
  | "podcast"
  | "talk"
  | "keynote"
  | "video"
  | "article"
  | "interview";

export interface Appearance {
  title: string;
  href: string;
  outlet?: string; // show / channel / conference name
  date: string; // YYYY-MM-DD (used for sorting; rendered as the year)
  kind: AppearanceKind;
  note?: string; // optional extra context (e.g. "My segment: 32:34–39:36")
}

export const appearances: Appearance[] = [
  {
    title: "If you can ship anything, you shouldn't ship everything",
    href: "https://www.youtube.com/watch?v=qSwGy-jK-yA",
    outlet: "Augment Code",
    date: "2026-06-11",
    kind: "podcast",
  },
  {
    title: "Vercel Ship AI '25 — Opening Keynote",
    href: "https://www.youtube.com/watch?v=mZzAuFq5C6Q&t=1954s",
    outlet: "Vercel",
    date: "2025-10-24",
    kind: "keynote",
    note: "My segment: 32:34–39:36",
  },
  {
    title: "Building and selling a startup in the current market",
    href: "https://www.youtube.com/watch?v=eYVxF3c14u4",
    outlet: "Techsylvania",
    date: "2025-07-22",
    kind: "interview",
  },
  {
    title: "Deepfakes — a talk about tech, ethics, and business",
    href: "https://www.youtube.com/watch?v=5NAFTdE2crY",
    outlet: "Techsylvania",
    date: "2024-08-11",
    kind: "talk",
  },
  {
    title: "Entrepreneurship and the Shopify ecosystem",
    href: "https://www.youtube.com/watch?v=Wn8PE0jM0B8",
    outlet: "Brandon Amoroso",
    date: "2023-01-17",
    kind: "podcast",
  },
  {
    title: "On building Windsor.io",
    href: "https://www.youtube.com/watch?v=TzGFJOcwXEg",
    outlet: "Business Banter",
    date: "2022-05-18",
    kind: "podcast",
  },
  {
    title: "Leaving Facebook, joining ZEIT, and founding Windsor",
    href: "https://www.youtube.com/watch?v=rS-R_MXUco4",
    outlet: "The Lean Hire Podcast",
    date: "2020-09-22",
    kind: "podcast",
  },
  {
    title: "Presenting Windsor to Patrick McKenzie",
    href: "https://www.youtube.com/watch?v=toxIfSW1x9w",
    outlet: "Pioneer",
    date: "2019-08-19",
    kind: "interview",
  },
  {
    title: "Async Generators in JavaScript",
    href: "https://www.youtube.com/watch?v=YroA9XbXvQY",
    outlet: "CU JavaScript",
    date: "2018-11-07",
    kind: "talk",
  },
];
