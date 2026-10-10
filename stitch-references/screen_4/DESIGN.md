---
name: Cinematic Obsidian
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ffd795'
  on-secondary: '#422c00'
  secondary-container: '#fbb400'
  on-secondary-container: '#694900'
  tertiary: '#fff3f3'
  on-tertiary: '#67001e'
  tertiary-container: '#ffcdd0'
  on-tertiary-container: '#be003f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#ffba27'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4100'
  tertiary-fixed: '#ffdadc'
  tertiary-fixed-dim: '#ffb2b9'
  on-tertiary-fixed: '#40000f'
  on-tertiary-fixed-variant: '#91002e'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-fidelity cinematic dark-mode experience tailored for cinephiles, media collectors, and casual streamers. It bridges the prestige atmosphere of a darkened theatre with the precision of an editorial archive. 

Visual characteristics balance atmospheric depth with laser-focused utility:
- **Atmospheric Immersive Dark:** Grounded in deep pitch-blacks, cosmic slates, and charcoal depths, letting vibrant theatrical posters and ultra-wide backdrops drive visual energy.
- **Luminous Edge & Glass:** Translucent frosted overlays, subtle gradient borders, and focused ambient glows that direct attention without overwhelming metadata.
- **Editorial Precision:** Razor-sharp typography and micro-badges provide instant streaming availability, aspect ratios, ratings, and runtime readability.
- **Tone:** Authoritative, sleek, premium, and visually cinematic.

## Colors

The palette revolves around deep optical slates accented by high-energy neon hues:

- **Primary (`#00F0FF` - Electric Cyan):** Anchors primary actions, current play states, active timeline scrubs, and focused navigational highlights.
- **Secondary (`#FFB703` - Luminous Amber):** Reserved for star ratings, critical praise scores, watchlist bookmarks, and award indicators.
- **Tertiary (`#FF2A5F` - Neon Crimson):** Directs urgent calls-to-action, live broadcasts, premiere releases, and destructive states.
- **Neutral Base (`#0B0F19` - Deep Obsidian):** Forms the foundational viewport layer, elevated by subtle surface progressions (`#111827`, `#1A2234`, and `#242F48`).
- **Text & Foreground:** Pristine off-white (`#F8FAFC`) for primary titles, cool muted slate (`#94A3B8`) for secondary metadata, and deep slate (`#475569`) for disabled/structural strokes.

## Typography

The type system blends atmospheric exhibition with rigorous data legibility:

- **Display & Headlines (`Outfit`):** Geometric, striking, and modern. Crafted for high-impact film titles, carousel headers, and hero banners. Provides premium marquee presence at scale.
- **Body (`Inter`):** Systematic, ultra-clean neutral grotesque. Retains peak legibility in dense synopses, cast directories, user reviews, and technical streaming specs.
- **Labels & Badges (`Space Grotesk`):** Monospaced-influenced proportions used exclusively for audio/visual codecs (`4K HDR`, `ATMOS`), runtimes, release years, and numeric ratings.

## Layout & Spacing

A fluid 12-column grid anchored by responsive outer bounds provides seamless transitioning across viewports:

- **Desktop (≥ 1280px):** 12 columns with `3rem` margins and `1.5rem` gutters. Max-width container caps at `1680px` for ultra-wide monitors to maintain optimal scan lines.
- **Tablet (768px - 1279px):** 8 columns with `2rem` margins and `1rem` gutters. Horizontally scrolling media trays reveal partial card peeks (`15%`) to cue discovery.
- **Mobile (< 768px):** 4 columns with `1rem` margins and `0.75rem` gutters. Media grids switch to 2-column posters or full-bleed vertical carousels.
- **Rhythm:** Spacing intervals use a strict 4px/8px baseline matrix. Micro-spacings (`0.25rem` to `0.5rem`) cluster metadata chips to titles, while section gaps leverage `2.5rem` to emphasize cinematic breathability.

## Elevation & Depth

Visual hierarchy operates via tonal stacking, ambient light pollution, and frosted glass refraction:

- **Level 0 (Canvas Base):** Solid `#0B0F19`. All media shelves and background layers sit directly on this canvas.
- **Level 1 (Surface Containers):** Solid `#111827` or translucent `rgba(17, 24, 39, 0.7)` with `backdrop-filter: blur(16px)` and a subtle `1px` inner border (`rgba(255, 255, 255, 0.08)`).
- **Level 2 (Hovered Cards & Drawers):** `rgba(26, 34, 52, 0.85)` with `backdrop-filter: blur(24px)`, boosted inner stroke (`rgba(255, 255, 255, 0.16)`), and an ambient directional shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.6)`.
- **Level 3 (Modals & Overlays):** `#161F30` elevated over a `rgba(3, 7, 18, 0.85)` backdrop blur (`20px`). Accent glows diffuse outward using primary colors: `0 0 40px -10px rgba(0, 240, 255, 0.15)`.
- **Poster Focus Treatment:** Interactive elements don't just elevate on Z-axis; they cast a faint, colored dynamic floor glow matching the dominant palette of the key artwork.

## Shapes

The design system employs controlled, modern roundedness:
- **Base Geometry:** Standard components (posters, dialogs, media panes) use `0.5rem` (`8px`) radii to reflect contemporary hardware and screen bezels.
- **Containers & Glass Surfaces:** Modal sheets, spotlight panels, and video cards use `rounded-lg` (`1rem` / `16px`).
- **Interactive Badges & Pills:** Metadata badges, category filter chips, search fields, and play buttons scale to full pill geometries (`rounded-full`) to contrast against rectangular 16:9 and 2:3 aspect ratio video and poster containers.

## Components

### Buttons
- **Primary Watch Action:** Pill-shaped, solid white (`#FFFFFF`) or Neon Cyan (`#00F0FF`) fill with dark neutral text (`#0B0F19`), bold weight (`Space Grotesk`), accompanied by an optical neon glow on hover (`0 0 20px rgba(0, 240, 255, 0.4)`).
- **Secondary (Watchlist/Queue):** Frosted glass surface (`rgba(255, 255, 255, 0.08)`), crisp `1px` border (`rgba(255, 255, 255, 0.15)`), pure white icon/text, shifting to `rgba(255, 255, 255, 0.18)` on hover.
- **Tertiary / Icon Buttons:** Borderless `40px` circular tap targets with subtle `rgba(255, 255, 255, 0.05)` backdrop.

### Movie Cards & Poster Containers
- **Aspect Ratios:** Strictly locked to `2:3` for theatrical posters and `16:9` for episode stills/live backdrops.
- **Surface:** Wrapped in `rounded-md` with `overflow-hidden`. A seamless bottom gradient mask (`from-transparent via-neutral/60 to-neutral/95`) surfaces title, runtime, and genre overlays without obscuring artwork.
- **Active State:** Scale transform (`scale-105`) accompanied by an outline accent glow (`1px solid rgba(0, 240, 255, 0.6)`).

### Chips & Badges
- **Technical Specs (`4K`, `HDR10`, `DOLBY ATMOS`):** Compact height (`20px`), `label-sm` typography, encased in translucent obsidian with a subtle `1px` border (`rgba(255, 255, 255, 0.2)`).
- **Critic & Star Ratings:** Tinted glass pills utilizing Luminous Amber (`rgba(255, 183, 3, 0.15)`) background with `#FFB703` solid icon and score text.
- **Genre Pills:** Interactive, rounded-full chips; unselected in low-opacity slate, selected in glowing Electric Cyan tint.

### Inputs & Search Bars
- **Global Search:** Full pill or `rounded-lg` glass input (`rgba(17, 24, 39, 0.8)`). Features an integrated hotkey indicator (`⌘K`), subtle text glow, and instant cyan stroke border transition upon focus.

### Checkboxes & Toggle Switches
- **Checkboxes:** `rounded-sm` squares with `1.5px` border (`#475569`). Checked state transitions to Electric Cyan background with obsidian checkmark.
- **Streaming Provider Toggles:** Circular platform badges (Netflix, Max, Prime) that toggle from desaturated `50%` opacity to full vibrant brand color with a glowing bottom indicator light when tracking is enabled.

### Progress & Scrubbing Bars
- **Media Tracking:** Ultra-thin (`4px`) track in `rgba(255, 255, 255, 0.15)`. Progress fill in Electric Cyan, expanding to `6px` on scrub bar hover with a luminous cyan thumb indicator.