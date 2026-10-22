// Everything about the project that is not translated lives here.

// ↓↓↓ Paste your GitHub link here (or set NEXT_PUBLIC_GITHUB_URL in the hosting dashboard).
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/oosexgang";

// The public address of the site. Used for canonical URLs, Open Graph tags and the sitemap.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hackios.example").replace(/\/$/, "");

export const TELEGRAM = {
  channel: "oosexgangdevs",
  url: "https://t.me/oosexgangdevs",
  // shown until the live count from t.me arrives (and if t.me is unreachable)
  fallbackSubscribers: 16305,
};

export const CONTACT_HANDLE = "netusd";

export type Member = { handle: string; country: "UA" | "RU"; role: "founder" | "ceo" | "team" };
// Order matters: this is the order on the site.
export const TEAM: Member[] = [
  { handle: "oodze", country: "RU", role: "founder" },
  { handle: "netusd", country: "UA", role: "ceo" },
  { handle: "wannqn", country: "UA", role: "team" },
  { handle: "hxfuxyyXD", country: "UA", role: "team" },
];

export const TOKEN = {
  ticker: "$HackiOS",
  network: "BNB Chain",
  platform: "flap.sh",
  contract: "0x5be8dca38cff485d3a80809195284c7f74c77777",
  url: "https://flap.sh/bnb/0x5be8dca38cff485d3a80809195284c7f74c77777",
  supply: "1,000,000,000",
};

export const PRESS = [
  { file: "hackios-icon.png", size: "1024×1024", key: "icon_dark" },
  { file: "hackios-icon-red.png", size: "1024×1024", key: "icon_red" },
  { file: "oosy-avatar.png", size: "1024×1024", key: "avatar" },
  { file: "hackios-x-header.png", size: "1500×500", key: "x_header" },
  { file: "hackios-og.png", size: "1200×630", key: "og" },
  { file: "hackios-github-git.png", size: "1000×1000", key: "github" },
] as const;
