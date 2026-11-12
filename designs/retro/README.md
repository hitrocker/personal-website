# MA/OS — retro desktop design (live)

The design served at `/` (hitrocker.dev). A 90s desktop built from the Stitch
"Retro Terminal OS" design system.

```
designs/retro/
├── components/
│   ├── desktop.tsx        # The whole page: menu bar, windows, taskbar
│   ├── windows.tsx        # Window frame + taskbar building blocks
│   ├── arcade.tsx         # ARCADE.EXE cabinet cycling the game previews
│   ├── dos-prompt.tsx     # Typeable MS-DOS prompt + "Terminal" shortcut
│   ├── extras.tsx         # Wallpapers (Display menu), boot screen, click sounds
│   ├── sfx.ts             # Web Audio sound effects (no audio files)
│   ├── retro-contact.tsx  # Contact form (Web3Forms)
│   └── clock.tsx          # Menu bar / taskbar clock
├── fonts.ts               # Space Grotesk, Space Mono, Courier Prime, VT323
├── retro.css              # Bevels, title bars, CRT, night mode, pixel cursors
└── stitch-export/         # Original Stitch export (DESIGN.md, code.html, screen.png)
```

The route files that use it live in `app/` (`layout.tsx`, `page.tsx`, `icon.tsx`,
`opengraph-image.tsx`, `twitter-image.tsx`). All text comes from `lib/content.ts`.
