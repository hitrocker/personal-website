# Muhammad Ahmed - Personal Portfolio

Portfolio site for **Muhammad Ahmed**, an LLM Engineer and Software Developer.

Live: [https://hitrocker.dev](https://hitrocker.dev)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

## Project structure

```
app/                  Next.js routes: serves the MA/OS design at /
designs/
  retro/              MA/OS, the live retro-desktop design (see designs/retro/README.md)
  classic/            Previous dark design, archived and not routed (see designs/classic/README.md)
components/           Shared by both designs: game previews, JSON-LD structured data
lib/                  Shared content (content.ts) and site config (site.ts)
cv/                   Source for the downloadable CV (resume.html, build.sh)
public/               Static files, including Muhammad_Ahmed_CV.pdf
```

All on-site text lives in `lib/content.ts`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Replace remaining placeholders

Most profile and project URLs came from the CV. The **2048 Google Play** link was not on the CV, so that button stays hidden until you add it in `lib/content.ts`.

Set the production URL before deploying:

```bash
cp .env.example .env.local
```

Then edit `NEXT_PUBLIC_SITE_URL`.

## Contact form

The contact form sends through [Web3Forms](https://web3forms.com). Get a free access key for your inbox there, then set it as `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.local` and in Vercel (Project → Settings → Environment Variables). Without a key, the form falls back to opening the visitor's mail app.

## CV

The downloadable résumé (`public/Muhammad_Ahmed_CV.pdf`) is generated from `cv/resume.html`. Edit the HTML, then run `npm run cv` (needs Google Chrome; it fails if the PDF grows past one page).

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add `hitrocker.dev` under Project → Settings → Domains and point its DNS at Vercel.
4. Add `NEXT_PUBLIC_WEB3FORMS_KEY` under Project → Settings → Environment Variables.
5. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
