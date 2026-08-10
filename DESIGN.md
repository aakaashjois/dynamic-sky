---
name: Dynamic Sky
description: Cinematic atmosphere theater with ink desks and sodium accent over a living sky.
colors:
  accent: "#E8A838"
  accent-hover: "#F0C060"
  ink-plate: "rgba(8, 10, 14, 0.82)"
  ink-plate-solid: "#080A0E"
  ink-soft: "rgba(8, 10, 14, 0.55)"
  silver-edge: "rgba(232, 236, 242, 0.18)"
  silver-edge-strong: "rgba(232, 236, 242, 0.32)"
  text-primary: "rgba(248, 250, 252, 0.96)"
  text-secondary: "rgba(226, 232, 240, 0.72)"
  text-tertiary: "rgba(226, 232, 240, 0.48)"
  ink-on-accent: "#0A0A0A"
  code-surface: "rgba(0, 0, 0, 0.45)"
  success: "#10b981"
  mark-night: "#0B1F3A"
  mark-day: "#3B7DC4"
  mark-dawn: "#B8D4EA"
  code-token-keyword: "#66d9ef"
  code-token-string: "#a6e22e"
  code-token-literal: "#f92672"
  code-token-function: "#e6db74"
  code-token-variable: "#fd971f"
typography:
  display:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(2rem, 12cqi, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  display-install:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  display-mobile:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(3rem, 16vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline-compact:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline-mobile:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 10vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  stage-title:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-frame:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  desk-title:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  more-toggle:
    fontFamily: "Syne, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  section-lede:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  micro:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  affordance:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  mono-dense:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label-cta:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  pill: "999px"
  track: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "5rem"
  section: "0"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink-on-accent}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.6rem"
    typography: "{typography.label-cta}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.ink-on-accent}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.6rem"
  desk-plate:
    backgroundColor: "{colors.ink-plate}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "1.5rem"
  chip-location:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xs}"
    padding: "0.5rem 0.9rem"
  chip-location-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink-on-accent}"
    rounded: "{rounded.xs}"
    padding: "0.5rem 0.9rem"
  copy-button:
    backgroundColor: "rgba(232, 236, 242, 0.1)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xs}"
    padding: "4px 8px"
---

# Design System: Dynamic Sky

## Overview

**Creative North Star: "Atmosphere Theater"**

The homepage is a darkened cinema. The live DynamicSky render is the only full-bleed picture plane. Interface chrome is hard editorial type on near-black ink plates with a single sodium amber accent - a lighting desk over the atmosphere, not soft observatory frost.

Density is cinematic and airy. The page reads as staged acts, not a docs grid: hero title card with a bottom Time Desk, then vertical example stages (Product chrome, Four cities, Travel), Install, and a collapsed Code snippets drawer. Code stays out of the main stages. Motion is light: slight plate tilts that straighten when a section is centered, plus a stacked sky-mark that deals in on enter. Interaction stays first-class (sliders, chips, copy).

**Key Characteristics:**
- Live sky as the sole full-bleed visual plane
- Opaque ink plates with silver hairline edges
- Syne display + Sora body
- One sodium amber accent locked across the page
- Pill CTAs only; sharp 8px desks for panels
- Stacked sky mark (night / day / amber / dawn cards) as the brand glyph
- CSS tilt + section focus settle; reduced-motion collapses transforms

## Colors

### Primary
- **Sodium Amber** (`{colors.accent}`): Active chips, slider fill, primary CTA, focus emphasis, mark card.
- **Sodium Lift** (`{colors.accent-hover}`): Hover companion for amber controls.

### Brand mark
- **Mark Night** (`{colors.mark-night}`): Back card, full height.
- **Mark Day** (`{colors.mark-day}`): Second card, ~3/4 height from bottom.
- **Mark Dawn** (`{colors.mark-dawn}`): Front card, ~1/4 height from bottom.
- Amber middle card uses `{colors.accent}` at ~1/2 height.

### Neutral
- **Ink Plate** (`{colors.ink-plate}`): Primary floating desk fill.
- **Ink Solid** (`{colors.ink-plate-solid}`): Solid desks over bright sky (hero console, install panel) and reduced-transparency fallback.
- **Ink Soft** (`{colors.ink-soft}`): Quieter secondary plates and chips.
- **Silver Edge** (`{colors.silver-edge}` / `{colors.silver-edge-strong}`): Hairline borders.
- **Screen White** (`{colors.text-primary}`): Primary type.
- **Haze Silver** (`{colors.text-secondary}`): Secondary labels.
- **Dim Silver** (`{colors.text-tertiary}`): Tertiary muted labels.
- **Ink on Accent** (`{colors.ink-on-accent}`): Text on amber fills.
- **Code Well** (`{colors.code-surface}`): Code block bed.
- **Signal Green** (`{colors.success}`): Transient copy success only.

**The Sky Owns Color Rule.** Do not introduce purple gradients or competing brand hues. Sodium amber is the only UI accent; atmospheric color comes from the sky.

**The One Solid Rule.** Solid amber appears on active controls, slider progress, and primary CTAs - never as large page washes.

## Typography

**Display / Headlines:** Syne
**Body / UI:** Sora
**Mono:** system monospace stack

**The Display Reserve Rule.** Syne is for brand wordmark and act titles. Operational UI stays Sora.

## Layout

Vertical act sequence. No persistent top nav.

1. **Hero** — full-viewport title card (wordmark + stacked mark + lead) with bottom Time Desk scrubber
2. **Examples intro** — short bridge line
3. **Product chrome** — copy + embedded scrubbable sky frame
4. **Four cities** — one shared time scrub across four pinned locations
5. **Travel** — time pinned; city / longitude chips change the sky
6. **Install** — title + jsDelivr quick-start panel
7. **Code snippets** — collapsed reference drawer with short recipes
8. **Made by** — compact author credit

Wide stage where needed (`max-width: 1400px` on snippet stage). Example rows are two-column on desktop, stacked on narrow. Prefer content-height sections over forcing every act to `100dvh` (hero stays full viewport).

**The Sky Plane Rule.** Page background stays transparent so DynamicSky shows through.

## Elevation & Depth

Ink plates lead. Selective `backdrop-filter` on floating desks; use solid ink where frost washes over bright sky. Prefer silver edge over glow. No neon halos.

## Shapes

Panels `8px`. CTAs full pill. Slider tracks fully rounded. Preview frames `8px` with silver edge. Sky mark ~22% corner radius, stacked cards bottom-aligned.

## Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Stage plates: slight `tilt-a` / `tilt-b` rotation; the section nearest viewport center gets `is-focused` and all tilts inside straighten
- Sky mark: cards deal in on load / re-enter viewport; collapse when off-screen; hover opens slightly
- Controls: lift/press via transform only
- Reduced motion: no tilts or mark deal; keep interactive controls

## Do's and Don'ts

### Do:
- Keep the live sky full-bleed behind ink desks.
- Put the primary time control in the hero Time Desk.
- Keep one focused section straighten at a time.
- Preserve interactive demos and stable element IDs.
- Treat the stacked sky mark as the favicon and wordmark companion.

### Don't:
- Return to equal feature-card grids or emoji icons.
- Use Playfair / Inter / white-frost glass as the primary system.
- Claim decorative stars are astronomically accurate.
- Ship bounce/elastic easing, letterboxing, or GSAP pin theater unless deliberately reintroduced.
- Let frosted plates wash out over bright daytime sky; use solid ink instead.
