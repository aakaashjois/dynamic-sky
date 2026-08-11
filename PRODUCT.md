# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are frontend / web developers who need a living sky background in a site or app without building atmospheric rendering themselves. They evaluate via the homepage demo, then install and wire the library into their own UI.

## Product Purpose

Dynamic Sky renders physically grounded day/night sky atmospheres for the web — Rayleigh/Mie-style scattering, twilight transitions, and an animated starfield — driven by time and location. Success means the homepage convincingly proves the effect, and developers can embed the same quality quickly via CDN or npm.

## Positioning

The immersive homepage demo is the primary product surface; the published vanilla JS library is how that experience ships into other projects. Neighboring tools can fake a static gradient; this product earns trust by making the sky respond to real time and place, with night stars, in plain JavaScript.

## Operating Context

- Developers open the live site (or local `index.html`) to scrub the hero Time Desk, then walk Product chrome, Four cities, and Travel demos before copying the Install snippet or opening Code snippets.
- Integration path: include `dynamic-sky.js` (CDN/jsDelivr or local), provide or auto-create sky/star containers, call `init()` / `updateSky(date)`. Own any time UI; optional minute helpers map scrubbers to `Date`.
- Location can be auto-detected (IP geolocation) or set manually; sun position depends on SunCalc.
- Authoring/evaluation happens in modern browsers; no build step is required for the library itself.

## Homepage path

Main demo path (in order):

1. **Hero / Time Desk** — scrub the full-bleed sky across a day
2. **Product chrome** — embedded sky inside a product surface with its own scrubber
3. **Four cities** — locations pinned; one scrub moves time across all four frames
4. **Travel** — time pinned (e.g. 4:00 PM); city / longitude chips change atmosphere
5. **Install** — one jsDelivr script + two containers quick start
6. **Code snippets** — collapsed recipes (custom container, programmatic control, dynamic location, auto-updating)

## Capabilities and Constraints

Confirmed capabilities:
- Physically-based sky gradient rendering (single-scattering approximation)
- Multi-layer starfield with twilight fade and time-based rotation (decorative, not a star catalog)
- Time via `updateSky(date)`; optional `minutesToDate` / `dateToMinutes` for minute-based UIs
- Location awareness (auto IP or manual lat/long)
- Defaults that work with two containers; CSS injected by the library
- Demo site with interactive examples and copyable install / snippet patterns

Constraints:
- Vanilla JavaScript, single-file distribution (`dynamic-sky.js`); no framework requirement
- Bring-your-own time controls; library paints atmosphere only
- Depends on SunCalc for solar position; IP geolocation via `ipwho.is`
- License on package metadata: Apache-2.0
- Homepage: https://dynamic-sky.aakaashjois.com
- Open: whether library ergonomics ever outrank demo craft in future prioritization (user confirmed demo-first for now)

## Brand Commitments

- Name: **Dynamic Sky**
- Author / copyright: Aakaash Jois
- Voice in shipping copy: atmospheric, inviting, technically credible (sunrise-to-stars, ship-it-in-one-script)
- Identity: the live sky is primary brand proof; the stacked sky-swatch mark (night / day / amber / dawn cards) is the compact glyph for wordmark and favicon
- Design system: Atmosphere Theater (`DESIGN.md`) — Syne + Sora, sodium amber, ink plates over the living sky

## Evidence on Hand

- Live / local demo: `index.html` (hero Time Desk, Product chrome, Four cities, Travel, Install, Code snippets)
- Brand mark / favicon: stacked card mark in the hero; `favicon.png` at site root
- Library source: `dynamic-sky.js`
- Package metadata: `package.json` (npm name `dynamic-sky`, keywords, jsDelivr entry)
- Docs: `README.md`, `DESIGN.md`
- Credits / lineage: inspired by Horizon (dnlzro); sun math via SunCalc (mourner)
- Do not fabricate: testimonials, usage metrics, enterprise customers, benchmarks, or pricing

## Product Principles

1. **Demo is proof** — the homepage must make the sky feel alive before anyone reads an API table.
2. **Physics over decoration** — sky color and day/night behavior should remain location- and time-believable.
3. **Plain JS, easy embed** — stay zero-framework and single-file so adoption stays a script tag away.
4. **Controls stay optional** — the library renders atmosphere; product UIs own their own time controls.
5. **Honest astronomy** — stars are atmospheric craft, not a star catalog; do not overclaim celestial accuracy.

## Accessibility & Inclusion

No product-specific accessibility standard was committed in init. The demo already uses some ARIA on interactive controls; future work should not regress keyboard/label support on those controls.
