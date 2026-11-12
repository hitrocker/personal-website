---
name: Retro Terminal OS
colors:
  surface: '#fff9ec'
  surface-dim: '#e0dac9'
  surface-bright: '#fff9ec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e2'
  surface-container: '#f4eddd'
  surface-container-high: '#eee8d7'
  surface-container-highest: '#e8e2d2'
  on-surface: '#1e1c12'
  on-surface-variant: '#3e4949'
  inverse-surface: '#333025'
  inverse-on-surface: '#f7f0e0'
  outline: '#6e7979'
  outline-variant: '#bdc9c8'
  surface-tint: '#006a6a'
  primary: '#006565'
  on-primary: '#ffffff'
  primary-container: '#008080'
  on-primary-container: '#e3fffe'
  inverse-primary: '#76d6d5'
  secondary: '#5a5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dfe3e7'
  on-secondary-container: '#606568'
  tertiary: '#006a06'
  on-tertiary: '#ffffff'
  tertiary-container: '#00860a'
  on-tertiary-container: '#eeffe4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f2f2'
  primary-fixed-dim: '#76d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#dfe3e7'
  secondary-fixed-dim: '#c3c7cb'
  on-secondary-fixed: '#181c1f'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#76ff65'
  tertiary-fixed-dim: '#00e61b'
  on-tertiary-fixed: '#002201'
  on-tertiary-fixed-variant: '#005303'
  background: '#fff9ec'
  on-background: '#1e1c12'
  surface-variant: '#e8e2d2'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-md:
    fontFamily: Courier Prime
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Space Mono
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-md:
    fontFamily: Space Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45rem
  body-sm:
    fontFamily: Space Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Courier Prime
    fontSize: 0.875rem
    fontWeight: '700'
    lineHeight: 1.25rem
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Courier Prime
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.08em
  code-terminal:
    fontFamily: Courier Prime
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system channels the tactile, utilitarian golden era of computing spanning early Macintosh System 6/7 through Windows 95, synthesized into a developer portfolio platform. The aesthetic is deeply rooted in early desktop metaphors: physical beveled edges, mechanical affordances, simulated CRT scanlines, and high-contrast information density. 

The brand serves developers who value technical authenticity, hardware history, and craftsmanship over homogenized modern SaaS minimalism. The interface evokes fond memories of early computing, technical curiosity, and deliberate tactile interaction while delivering pristine usability and modern responsive performance.

Visual motifs draw heavily from:
- **Physical OS Chromes**: Inset and outset 3D beveled surfaces simulating light sources from the top-left (light edges on top/left, deep shadow on bottom/right).
- **CRT Phosphor Displays**: Terminal environments featuring crisp monochromatic phosphor glow (amber and matrix green) against matte deep charcoal backgrounds.
- **Dithered Patterns**: Subtle 1-bit or 2-bit checkerboard stippling for disabled states, window title bar backgrounds, and desktop wallpaper textures.

## Colors

The color palette captures the warmth of early desktop plastics and the punchy saturation of early VGA/EGA displays. 

- **Primary (`#008080` Desktop Teal)**: The classic 90s system desktop backdrop. Used for canvas environments, active title-bar gradients, and high-level navigational context.
- **Secondary (`#C3C7CB` System Bevel Gray)**: The quintessential 3D chrome surface. Serves as the foundation for window frames, dialogue boxes, pushbuttons, and menu strips.
- **Tertiary (`#33FF33` CRT Green)**: Classic P1 phosphor green. Reserved for live code consoles, interactive terminal components, active status LEDs, and developer telemetry indicators.
- **Neutral (`#D4CEBE` Retro Computer Beige)**: A warm, aged ABS plastic tone reminiscent of classic Macintosh casing. Used for paper-like card containers, documentation backgrounds, and retro window canvases.

### Accent & Functional Tones
- **Amber Phosphor (`#FFB000`)**: Warning states, build logs, and alternative terminal colorways.
- **Bevel Highlight (`#FFFFFF`)**: Pure specular light applied to top and left edges of raised elements.
- **Bevel Shadow (`#808080`)**: Intermediate drop-shadow applied to bottom and right edges.
- **Bevel Dark Shadow (`#000000`)**: Deep grounding edge applied to outermost bottom/right borders and primary terminal surfaces.
- **Active Title Bar Navy (`#000080`)**: Optional classic window focus tone alongside Desktop Teal.

## Typography

Typography fuses monospaced code authenticity with the mechanical geometry of early computing.

- **Headlines (`Space Grotesk`)**: Provides sharp, angular, retro-futuristic structure for portfolio headings and feature banners. Letter tracking is kept snug to evoke early desktop typographic tight-kerning algorithms.
- **Body (`Space Mono`)**: Delivers authentic typewriter-like fixed-pitch prose without sacrificing reading comfort on modern displays. Used across biography sections, case study briefs, and project descriptions.
- **Labels & System Meta (`Courier Prime`)**: Anchors window headers, file directory paths, system timestamps, and push button text. All uppercase when deployed to primary controls or system status bars.
- **Terminal Display (`code-terminal`)**: Crisp rendering optimized for dark CRT consoles and CLI simulations, with fixed spacing that ensures ASCII art and project trees line up on strict character grids.

## Layout & Spacing

The layout model simulates a multi-window desktop operating system superimposed on an organized responsive grid. 

- **Structure**: Uses a 12-column layout on desktop and tablet, collapsing to a single-column stacked window system on mobile devices.
- **Grid Alignment**: Layout elements snap to strict 4px / 8px sub-units. Windows and desktop icons behave predictably with hard horizontal and vertical boundaries.
- **Responsive Adaptations**:
  - **Desktop (1024px+)**: Windows can tile or overlap with draggable appearances, accompanied by a fixed top System Menu Bar and a bottom Taskbar. Window frames use `gutter-desktop` (24px) separation.
  - **Tablet (768px - 1023px)**: Windows automatically cascade or snap to 50/50 dual-pane splits.
  - **Mobile (< 768px)**: Floating windows become full-width faux panels stacked sequentially. Title bars remain sticky at the top of each project module to maintain the OS metaphor while optimizing touch access.

## Elevation & Depth

This system strictly rejects diffuse modern drop shadows and blurred transparent glassmorphism in favor of classic **mechanical 3D bevels and physical extrusion**.

### Light Source Rules
A single global light source is positioned at the top-left of the viewport:
- **Raised (Outset) State**: Used for inactive window bodies, toolbars, unpressed buttons, and desktop icons.
  - Top & Left Outer Border: `1px solid #FFFFFF`
  - Bottom & Right Outer Border: `1px solid #000000`
  - Inner Top & Left: `1px solid #DFDFDF`
  - Inner Bottom & Right: `1px solid #808080`
- **Sunken (Inset) State**: Used for input fields, terminal screens, status indicators, and pressed button states.
  - Top & Left Outer Border: `1px solid #000000`
  - Bottom & Right Outer Border: `1px solid #FFFFFF`
  - Inner Top & Left: `1px solid #808080`
  - Inner Bottom & Right: `1px solid #DFDFDF`

### Window Layering & Hierarchy
- **Desktop Floor**: Teal or patterned surface (`#008080`).
- **Base Canvas**: Inset viewport frame.
- **Active Window**: High-contrast title bar (`#000080` or vibrant gradient), solid `#C3C7CB` window body, rendering above siblings with a sharp 2px solid `#000000` hard non-blurred offset silhouette shadow (`box-shadow: 4px 4px 0px 0px rgba(0,0,0,0.7)`).
- **Inactive Window**: Dithered or neutral gray title bar, pushed visually backward.

## Shapes

The shape system is strictly zero-radius (`0px` roundedness). 

Every component—buttons, windows, toolbars, badges, image wrappers, and tabs—features hard, squared-off corners. Any attempt at softening corners breaks the authentic 80s/90s pixel-aligned raster grid. 

- **Pixel Framing**: All borders are strictly 1px or 2px thick, rendered with integer pixel alignment (`image-rendering: pixelated` where applicable).
- **Notches & Grippers**: Decorative grabber handles for window dividers use repeating 2px by 2px square dots.
- **Interactive Focus Rings**: High-contrast dotted line outlines (`1px dotted #000000`), offset by 2px inside buttons or around selected list items.

## Components

### Window Frames & Dialogs
- **Structure**: Outer 2px raised bevel border enclosing a `#C3C7CB` frame with 4px padding.
- **Title Bar**: Horizontal band spanning the window width. 
  - **Active State**: Deep blue (`#000080`) or teal (`#008080`) with white bold text (`Space Grotesk` or `Courier Prime`).
  - **Window Controls**: Right-aligned square buttons (Close `×`, Maximize `□`, Minimize `_`) featuring raised 1px bevels. Active clicks trigger sunken inset states.
  - **Macintosh Variant**: Title bar with horizontal parallel pinstripes running through the background and a single square close box on the left.

### Push Buttons
- **Default State**: Surface `#C3C7CB`, classic raised bevel (top/left white, bottom/right black), text centered in bold uppercase monospace.
- **Hover**: Cursor transforms to vintage pointer; subtle background tint shift to `#D0D4D8`.
- **Active / Pressed**: Bevel inverts immediately (top/left black, bottom/right white); content shifts 1px down and 1px right to simulate physical depression.
- **Disabled**: Text rendered with double drop-shadow effect (top/left dark gray `#808080`, offset 1px down/right white `#FFFFFF`).

### Chips & Tags (System Badges)
- Built as sunken inset plates (simulating LED cutouts or punched chassis labels) with a dark charcoal or gray fill (`#242424`).
- Label displayed in glowing phosphor green (`#33FF33`) or amber (`#FFB000`) monospaced typography.

### Input Fields & Textareas
- Inset sunken bevel with a solid white (`#FFFFFF`) or pure terminal black (`#0C0C0C`) interior.
- Text selection appears as solid inverted blocks (black background with white text or bright green with black text).
- Flashing block cursor (`█`) pulsing at 1Hz rate.

### Terminal & Code Consoles
- Sunken container with a deep matte black (`#101010`) background and a faint horizontal CRT scanline overlay effect.
- Text rendered in `code-terminal` (`#33FF33` CRT green).
- Scrollbars styled with classic square track, dithered thumb, and bevelled top/bottom arrow steppers.

### Lists & Directories
- Tree-style layout using vintage ASCII connector pipes (`├──`, `└──`).
- Selected list items highlighted with a full-width solid navy blue background (`#000080`) and crisp white text.
- Folder and file icons rendered in authentic 16x16 pixelated aesthetics.

### Cards & Project Showcases
- Formatted as nested sub-windows or disk volume previews.
- Contains an upper image/demo frame rendered with an inset bezel, a lower metadata section formatted as an engineering spec sheet, and action buttons in a bottom utility rack.