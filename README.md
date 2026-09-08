# Muhammad Ahmed - Personal Portfolio

Portfolio site for **Muhammad Ahmed**, an LLM Engineer and Software Developer.

Live: [https://muhammad-ahmed-phi.vercel.app](https://muhammad-ahmed-phi.vercel.app)

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

Most profile and project URLs came from the CV. The **2048 Google Play** link was not on the CV, so that button is disabled until you add it in `lib/content.ts`.

Set the production URL before deploying:

```bash
cp .env.example .env.local
```

Then edit `NEXT_PUBLIC_SITE_URL`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
4. Deploy.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
