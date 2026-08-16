// Single source of truth for all links on pranay.gp.
//
// PUBLIC lists (socials/contact/tools) render on the homepage and are safe to
// index. PRIVATE items (email, calendar, video room) live ONLY in
// `privateLinks`, which is rendered on the auth-gated /private dashboard and is
// never exposed publicly or to crawlers.

export interface LinkItem {
  label: string;
  href: string;
  note?: string;
}

// --- individual link definitions ---
const X: LinkItem = { label: "X", href: "https://x.com/pranaygp" };
const GITHUB: LinkItem = { label: "GitHub", href: "https://github.com/pranaygp" };
const LINKEDIN: LinkItem = {
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/pranaygp",
};
const INSTAGRAM: LinkItem = {
  label: "Instagram",
  href: "https://instagram.com/pranaygp",
};
const EMAIL: LinkItem = { label: "Email", href: "mailto:hey@pranay.gp" };

const CALENDAR: LinkItem = { label: "Book a call", href: "https://cal.com/pranay" };
const VIDEO_ROOM: LinkItem = { label: "Video room", href: "https://call.pranay.gp" };
const PGP: LinkItem = { label: "PGP key", href: "https://pgp.pranay.gp" };
const RESUME: LinkItem = {
  label: "Résumé",
  href: "https://resume.pranay.gp",
  note: "outdated",
};

const MIRROR: LinkItem = {
  label: "mirror.pranay.gp",
  href: "https://mirror.pranay.gp",
  note: "A mirror",
};
const QIULING: LinkItem = {
  label: "qiuling.pranay.gp",
  href: "https://qiuling.pranay.gp",
  note: "The Qiuling font",
};
const CALL_TOOL: LinkItem = {
  label: "call.pranay.gp",
  href: "https://call.pranay.gp",
  note: "Video call room",
};

// --- PUBLIC (homepage) ---
// Email is intentionally excluded to keep it off the public web.
export const socials: LinkItem[] = [X, GITHUB, LINKEDIN, INSTAGRAM];

// Calendar + video room intentionally excluded from the public site.
export const contact: LinkItem[] = [PGP, RESUME];

// The video-call subdomain is intentionally excluded from the public tools.
export const tools: LinkItem[] = [MIRROR, QIULING];

// --- PRIVATE (auth-gated /private dashboard only) ---
export const privateLinks: {
  socials: LinkItem[];
  contact: LinkItem[];
  tools: LinkItem[];
} = {
  socials: [X, GITHUB, LINKEDIN, EMAIL, INSTAGRAM],
  contact: [CALENDAR, VIDEO_ROOM, PGP, RESUME],
  tools: [MIRROR, QIULING, CALL_TOOL],
};
