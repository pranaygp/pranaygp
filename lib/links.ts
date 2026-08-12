// Single source of truth for all links on pranay.gp.
// The subdomain map here mirrors middleware.ts so the site and the redirects
// never drift apart. If you add a redirect in middleware.ts, add it here too.

export interface LinkItem {
  label: string;
  href: string;
  note?: string;
}

// Primary places to find me / reach me.
export const socials: LinkItem[] = [
  { label: "X", href: "https://x.com/pranaygp" },
  { label: "GitHub", href: "https://github.com/pranaygp" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pranaygp" },
  { label: "Email", href: "mailto:hey@pranay.gp" },
  { label: "Instagram", href: "https://instagram.com/pranaygp" },
];

export const contact: LinkItem[] = [
  { label: "Book a call", href: "https://cal.com/pranay" },
  { label: "Video room", href: "https://call.pranay.gp" },
  { label: "PGP key", href: "https://pgp.pranay.gp" },
  { label: "Résumé", href: "https://resume.pranay.gp", note: "outdated" },
];

// The linktree of little tools / utilities living on subdomains.
export const tools: LinkItem[] = [
  { label: "mirror.pranay.gp", href: "https://mirror.pranay.gp", note: "A mirror" },
  { label: "qiuling.pranay.gp", href: "https://qiuling.pranay.gp", note: "The Qiuling font" },
  { label: "call.pranay.gp", href: "https://call.pranay.gp", note: "Video call room" },
];
