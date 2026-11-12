# Muhammad Ahmed - Personal Portfolio

Portfolio site for **Muhammad Ahmed**, an LLM Engineer and Software Developer. Content is taken from his CV, including the LinkedIn, GitHub, and project links embedded in the PDF.

Live: [https://hitrocker.dev](https://hitrocker.dev)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

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

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add `hitrocker.dev` under Project → Settings → Domains and point its DNS at Vercel.
4. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
