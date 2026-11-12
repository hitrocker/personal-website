# Classic — previous dark design (archived)

The dark, animated design that hitrocker.dev used before MA/OS. It is kept complete
for reference but is **not routed**: nothing in `app/` imports it, so it isn't part
of the live site.

```
designs/classic/
├── classic-layout.tsx     # Its root layout (fonts, ambient background, cursor, theme)
├── classic-home.tsx       # Its homepage (all sections)
├── classic.css            # Its global styles (Tailwind + design tokens)
├── loading.tsx            # Its route loading screen
├── components/            # Sections (hero, experience, projects, ...) + chrome/ and ui/
├── metadata/              # Its favicon, Open Graph and Twitter images
└── assets/favicon.ico
```

It shares `lib/content.ts`, `lib/site.ts` and `components/game-previews.tsx` with the
retro design, so content edits apply to both.

## Restoring it

1. Replace `app/layout.tsx` with the contents of `classic-layout.tsx`
   (fix the CSS import to `@/designs/classic/classic.css`), and drop `app/globals.css`.
2. Make `app/page.tsx` render `ClassicHome` from `classic-home.tsx`.
3. Move the files in `metadata/` and `loading.tsx` back into `app/`, and
   `assets/favicon.ico` to `app/favicon.ico`.
