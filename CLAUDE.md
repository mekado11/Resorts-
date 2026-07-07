# Eldorado — Uyo, Akwa Ibom · Project Guide

Luxury hotel website for the Eldorado project on the Lagos–Calabar Coastal
Highway, Uyo, Akwa Ibom State, Nigeria. This repo is the **canonical site**.

## How this repo is worked on

- **`main` belongs to the site-builder tool / the human developer.** Their
  workflow pushes directly to `main`. Never force-push `main`, never rebase it,
  and expect it to move underneath you.
- **Claude sessions work on `claude/...` branches** and hand changes over via
  pull request (opened only when the owner asks). Before starting work, always
  `git fetch origin main` and branch from the latest `main`.
- Large binary assets live in `assets/` (real photography, ~18 MB). Don't
  duplicate or losslessly re-encode them without reason.

## Site architecture (do not restructure without discussion)

- **Single-page app in one file:** `index.html` contains all six pages as
  `<div class="page" id="page-...">` sections — `home`, `rooms`, `dining`,
  `experiences`, `membership`, `contact` — switched by the `showPage()`
  JavaScript function. Navigation uses `onclick="showPage('...')"` spans,
  not `<a href>` links.
- `style.css` — the full design system ("Tropical Neoclassicism").
  `base.css` — reset. No build step, no framework, no dependencies.
- Fonts: Cormorant Garamond (display) + Jost (body/labels), loaded via
  `@import` in `style.css`.

## Design tokens (from `style.css` — follow strictly)

- Navy `#0D1B2A` / `#152336` / `#1a2d42` · Gold `#C9A84C` / `#dfc278` /
  `#f0e0b0` · Ivory `#FAF8F2` / `#F5F0E8` · Cream `#EDE9DF` · Ebony `#1C1410`.
- Spacing scale `--space-xs` … `--space-xxl`; radii 4/8/16px; the standard
  transition is 180ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- Named venues use Ibibio names — e.g. the **Nkpa Ufan Spa** and the
  **Ekom Iban Cultural Wedding Pavilion**. Keep this convention for any new
  venue or experience.

## Source of truth for brand & content

`docs/heights-of-eldorado-concept.md` — the investor-ready brand and design
blueprint (brand story, pillars, guest experience, room specs, F&B concepts,
sustainability, taglines). Use it when writing or extending site copy:
room sizes and counts, venue concepts, service rituals, and the Akwa Ibom
specifics (Ibibio culture, Ikot Ekpene raffia, Qua Iboe estuary, afang /
ekpang nkukwo cuisine) all come from there.

**Known naming divergence (unresolved):** the site brands itself
"Eldorado Luxury Hotels & Resorts"; the blueprint names the property
"Heights of Eldorado — Member, Eldorado Hotels and Resorts". The owner
decides which naming wins; don't unilaterally rename either way.

## Tone

Refined, warm, confident; never flashy. Akwa Ibom specificity is a feature.
Ritz-Carlton is a quality benchmark only — never copy its phrasing.
