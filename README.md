# HackiOS website

Next.js 15 (App Router, TypeScript) site for HackiOS by OOSEX GANG.
Four languages (`/en`, `/ru`, `/uk`, `/zh`, English by default), a live Telegram subscriber counter,
a 3D dot-matrix Oosy (three.js), press kit downloads and SEO metadata.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # http://localhost:3000
```

`/?still` (or `/en?still`) turns the preloader and heading animations off, which is handy for screenshots.

## Where to change things

| What | File |
|---|---|
| GitHub link (header button, footer) | `lib/site.ts` → `GITHUB_URL`, or env `NEXT_PUBLIC_GITHUB_URL` |
| Site address (canonical, OG, sitemap) | env `NEXT_PUBLIC_SITE_URL` |
| Team, token, press kit list | `lib/site.ts` |
| All texts in 4 languages | `lib/dict.ts` |
| Styles | `app/globals.css` |
| Page sections | `app/[locale]/page.tsx` |
| 3D mascot | `components/Mascot.tsx` |
| Share image, icons | `app/[locale]/opengraph-image.png`, `icon.png`, `apple-icon.png` |
| Press kit files, teaser video | `public/press/`, `public/media/` |

Copy `.env.example` to `.env.local` for local values.

## Server side

- `GET /api/telegram` returns `{ channel, subscribers }`, read from the public t.me page and cached for 30 minutes.
- The page is rendered on the server and re-generated every 30 minutes (ISR), so the counter stays fresh without a database.
- Add your own endpoints as `app/api/<name>/route.ts`.

## Deploy

**Vercel (simplest).** Push this folder to GitHub, import the repo at vercel.com/new, set
`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GITHUB_URL` in Project → Settings → Environment Variables, deploy.
Then Project → Settings → Domains → add your domain and copy the DNS records Vercel shows.

**Your own server (VPS).**

```bash
docker build -t hackios-web \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  --build-arg NEXT_PUBLIC_GITHUB_URL=https://github.com/oosexgang .
docker run -d --restart unless-stopped -p 3000:3000 hackios-web
```

Put Caddy or Nginx in front for HTTPS. With Caddy the whole config is:

```
your-domain.com {
    reverse_proxy localhost:3000
}
```
