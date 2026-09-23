---
name: Paul's Cookbook
description: A personal, ad-free, bilingual recipe site presented as photographs on a light table.
colors:
  wall: "#F1F1EF"
  paper: "#FAFAF9"
  ink: "#17181B"
  pencil: "#50545B"
  pencil-soft: "#62666D"
  hairline: "#DCDDDD"
  silver: "#B7B9BD"
  frame: "#E2E3E3"
  china-marker: "#C4352B"
  on-marker: "#FFFFFF"
  darkroom: "#121315"
  darkroom-paper: "#1A1B1E"
  fixer-white: "#EDEDEA"
  darkroom-pencil: "#A8ABB1"
  darkroom-pencil-soft: "#93969D"
  darkroom-hairline: "#2A2C30"
  darkroom-silver: "#46494F"
  darkroom-frame: "#1F2124"
  darkroom-marker: "#F0675B"
  on-darkroom-marker: "#121315"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 3.4vw, 4.25rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 116"
  display-desktop:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1rem + 4.4vw, 5.5rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 116"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 112"
  headline-tablet:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 112"
  headline-desktop:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 112"
  feature-title-desktop:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 106"
  section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 110"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 116"
  label-title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 520
    lineHeight: 1.3
    letterSpacing: "-0.003em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  ui:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 520
    lineHeight: 1.4
  meta:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "'tnum' 1"
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
  wordmark:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 680
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 125"
  wordmark-tablet:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 680
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 125"
rounded:
  print: "2px"
  control: "3px"
  round: "9999px"
spacing:
  hair: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "72px"
  gutter-mobile: "16px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "46px"
  button-text:
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    height: "44px"
  button-icon:
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "44px"
  chip:
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
  tag-removable:
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "0 10px 0 12px"
    height: "44px"
  segmented:
    textColor: "{colors.pencil}"
    rounded: "{rounded.control}"
    padding: "2px"
    height: "46px"
  segmented-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.print}"
  badge:
    backgroundColor: "{colors.china-marker}"
    textColor: "{colors.on-marker}"
    typography: "{typography.small}"
    rounded: "{rounded.round}"
    height: "20px"
  print:
    backgroundColor: "{colors.frame}"
    rounded: "{rounded.print}"
  drawer-sheet:
    backgroundColor: "{colors.paper}"
    width: "min(420px, calc(100vw - 36px))"
  search-field:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "44px"
---

# Design System: Paul's Cookbook

## Overview

**Creative North Star: "The Light Table"**

Every page is a table of photographic prints under even light. The food photography carries all of the colour; the interface recedes into what a gallery would add to a wall: quiet labels, hairline rules, a neutral wall colour, and a single grease-pencil mark that shows what the reader has chosen. The reader should feel they are browsing a curated contact sheet of real dishes, not using an app.

The system is image-first and sparse. Chrome is thin and typographic, never boxed: no cards with shadows, no pills on photos, no emoji. Hierarchy comes from one variable typeface, Archivo, whose width axis does the work a second font would normally do (wide and light for wall titles, normal width for labels, tabular figures for minutes and lei). Density is calm: generous vertical rhythm between "rooms" (category sections), tight and precise inside a label.

Light is the gallery wall by day (cool paper grey, never cream); dark is the darkroom (graphite, never pure black). Both themes are designed, not inverted. The site is mobile first: 2 columns of prints on a phone, 3 on a tablet, 4 on a desktop.

**Key Characteristics:**
- Square, sharp-cornered prints (2px) with captions set below the photo, like museum wall labels.
- One variable family (Archivo, wdth 62–125, wght 100–900); width + weight = hierarchy.
- Neutral paper / graphite / silver palette; one china-marker red reserved for "chosen" marks.
- Flat surfaces separated by hairlines; the only shadow is the side-menu sheet.
- 44px minimum targets, 15px minimum UI text, 13px absolute minimum for metadata.
- Motion that feels photographic: prints "develop" on load, lists re-sort with a glide.

## Colors

A neutral gallery system in two lighting conditions. Every UI colour is a grey; the photographs and one red mark are the only chroma.

### Primary
- **China Marker** (#C4352B light / #F0675B dark): the grease-pencil mark. The editor's hand on the table: the underline under the active sort field or tab, the filter-count badge, step numbers (recipe instructions, Cooking Basics), contact-sheet frame numbers on homepage rooms, ticked checklist boxes, the hover underline on recipe titles, stepper hover, and — at 7% opacity as **Marker Wash** — the background of the cook's personal notes. Text on it uses **On-Marker** (#FFFFFF light / #121315 dark).

### Neutral (light theme — "Gallery Wall")
- **Gallery Wall** (#F1F1EF): the page background everywhere. Also the text colour on ink-filled buttons.
- **Paper** (#FAFAF9): raised sheets — the side menu, notes, receipts. Also the text colour on selected chips/segments.
- **Graphite Ink** (#17181B): primary text, selected chips, selected segments, the primary button fill, focus rings.
- **Pencil** (#50545B): secondary text — subtitles, metadata numbers, inactive controls, filter group labels (6.9:1 on wall).
- **Soft Pencil** (#62666D): tertiary text — units ("min", "lei"), counts, the "≈" partial-estimate marker, placeholder text (5.2:1 on wall).
- **Hairline** (#DCDDDD): dividers, sticky-bar underline, section separators, table rules.
- **Silver** (#B7B9BD): control outlines — chips, tags, segmented controls, search underline, text-button underline.
- **Frame** (#E2E3E3): the empty print mount shown while a photo loads.
- **Hover wash** (rgba(23, 24, 27, .06)): background of icon/text buttons on hover.
- **Scrim** (rgba(14, 15, 17, .44)): backdrop behind the side menu.

### Neutral (dark theme — "Darkroom")
- **Darkroom** (#121315): page background.
- **Darkroom Paper** (#1A1B1E): side menu and raised sheets.
- **Fixer White** (#EDEDEA): primary text and ink-filled controls.
- **Darkroom Pencil** (#A8ABB1) / **Darkroom Soft Pencil** (#93969D): secondary / tertiary text.
- **Darkroom Hairline** (#2A2C30) / **Darkroom Silver** (#46494F) / **Darkroom Frame** (#1F2124): rules, outlines, empty mounts.
- **Hover wash** (rgba(237, 237, 234, .07)); **Scrim** (rgba(0, 0, 0, .62)).
- Photographs get `filter: brightness(.94)` in the darkroom so they don't glare.

### Implementation
Colours live as CSS custom properties (RGB channels) on `:root` (light) and `.dark` (dark) in `src/index.css`, and Tailwind maps them in `tailwind.config.ts` via `src/design/tokens.ts`: `wall`, `paper`, `ink`, `ink-2` (Pencil), `ink-3` (Soft Pencil), `line` (Hairline), `line-strong` (Silver), `frame`, `mark` (China Marker), `on-mark`. Components use these semantic names only — never raw hex, never `dark:` colour overrides.

### Named Rules
**The Photograph Owns the Colour Rule.** The UI is grey. No tinted surfaces, no brand greens or yellows, no category colours. If a screen needs colour, it needs a photograph.

**The One Mark Rule.** China Marker is the only hand on the table and the only accent: it marks what the reader chose or did (active sort/tab, filter badge, ticked boxes, hover underlines), numbers things (steps, frame numbers), and washes the personal notes at 7%. Solid fills stay badge- or checkbox-sized; it is never body text, never a large field, never used for data.

## Typography

**Display Font:** Archivo (variable, wdth 62–125, wght 100–900) with `ui-sans-serif, system-ui, sans-serif`
**Body Font:** Archivo (same family, normal width)
**Numerals:** Archivo with tabular figures (`font-variant-numeric: tabular-nums`)

**Character:** a museum signage system — expanded, light wall titles above compact, even labels. One family keeps the page quiet; width changes make the hierarchy legible without a second voice.

Loaded from Google Fonts: `family=Archivo:wdth,wght@62..125,100..900&display=swap`.

### Hierarchy
- **Display** (300, wdth 116, `clamp(2rem, 1.25rem + 3.4vw, 4.25rem)`, lh 1.02, ls −0.028em; ≥1100px: `clamp(3rem, 1rem + 4.4vw, 5.5rem)`, lh 0.98): the homepage greeting and top-level page titles (About, Cooking Basics, Prices, recipe title on desktop). One per page.
- **Headline** (400, wdth 112, 1.5rem → 1.875rem ≥768px → 2.125rem ≥1100px, lh 1.1, ls −0.018em): category "room" titles, recipe title on mobile, major section titles on content pages.
- **Title** (400, wdth 116, 1.25rem, lh 1.2): side-menu heading, empty-state heading (1.375rem, wdth 112), sub-sections on content pages.
- **Section label** (600, wdth 110, 1.0625rem): side-menu section heads (Filters, Categories, More, Preferences), panel headings.
- **Label title** (520, 1rem → 1.0625rem ≥768px, lh 1.3, max 2 lines): recipe titles under prints; featured-recipe title (560, 1.0625rem; ≥1100px 500, wdth 106, 1.375rem).
- **Body** (400, 1rem, lh 1.5; prose lh 1.6, max 65ch): instructions, notes, About and Cooking Basics text.
- **UI** (500–520, 0.9375rem): buttons, chips, switches, sort buttons (active: 620), links. Never below 15px.
- **Meta** (400, 0.875rem, tabular): minutes and lei under a print, counts. Units and "≈" drop to Soft Pencil.
- **Small** (500–650, 0.8125rem): badges, the mobile "rețete" count label. The absolute floor; never used for sentences.
- **Wordmark** (wdth 125, 1.0625rem → 1.1875rem ≥768px): "Paul's" at 680, "Cookbook" at 330.

Large-text preference scales the root to 112.5% (`html[data-text="large"]`), so every rem-based size scales together.

### Named Rules
**The Width Is Hierarchy Rule.** Don't add a second typeface. Reach for width (wdth 100 → 125) and weight before size; titles get wider and lighter as they get bigger.

**The Plain Case Rule.** No all-caps tracked labels. Labels are sentence case at Small or Meta size in Pencil.

## Layout

- **Container:** max-width 1400px, centred. Side gutter 16px (<375px: 14px; ≥768px: 32px; ≥1100px: 48px).
- **Header bar:** sticky, 56px tall (64px ≥768px), background Gallery Wall, gains a Hairline bottom border only once content scrolls under it.
- **Print grid:** 2 columns on mobile (gap 28px row / 12px column), 3 columns ≥768px (40 / 20), 4 columns ≥1100px (48 / 24). Grid tracks are `minmax(0, 1fr)`.
- **Rooms (category sections):** heading row (China Marker frame number "01", title, count; baseline aligned, 10px gap), 14px to the grid; 52px between rooms (72px ≥768px). Scroll targets offset by header + control strip height.
- **Control strip:** sticky under the header, one row, min 52px tall, wraps only when it must; gains a Hairline underline when stuck.
- **Opening (homepage):** the greeting alone (no subtitle or tagline), then today's featured print full-bleed at 3:2 on mobile; ≥1100px a 5fr / 7fr split with the greeting and featured label on the left, a 16:9 print on the right. Hidden while searching or filtering so results come first.
- **Content pages** (About, Cooking Basics, Prices): single reading column, max 720px (65–70ch), starting with a Display title; tables may widen to 960px.
- **Recipe page:** compact by rule — the reader wants the ingredients fast. Hero print full-bleed on mobile at 3:2, then the title (no category label) 12px below, the fact box 12px below that, and the tabs 8px after; on a 390 × 844 phone the first ingredient rows are visible without scrolling. ≥1100px a two-column layout — print left (7fr), title + fact box right (5fr) — with ingredients/instructions below in a 720px reading column and notes beside them.
- **Footer:** 96px above it, a single Hairline, the wordmark and underlined links.
- **Spacing rhythm:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72px. Inside labels use 2–10px; between blocks 16–24px; between sections 48–72px.

### Named Rules
**The 44 Rule.** Every interactive target is at least 44 × 44px, including chips, sort buttons, tags and footer links.

**The No-Overflow Rule.** Nothing scrolls horizontally at 360px, in either language, at either text size.

## Elevation & Depth

The system is flat. Surfaces sit on the wall and are separated by Hairlines and whitespace, not shadows. Depth appears only when something physically slides over the page.

### Shadow Vocabulary
- **Sheet** (`box-shadow: -18px 0 48px -20px rgba(20, 21, 24, .28)`; dark: `rgba(0, 0, 0, .7)`): the side menu sheet only.

### Named Rules
**The Flat Wall Rule.** No card shadows, no hover lifts, no glass, no gradients over photographs. A print is a flat rectangle on the wall.

## Shapes

Precise and nearly square. Prints use a 2px radius (a trimmed photographic print), controls a 3px radius (a mounted label). Only true circles are round: icon buttons, badges, the switch. Borders are 1px (1.5px for the switch track and the dashed empty slot). Photos are cropped with `object-fit: cover`; recipe prints are square (1:1), featured and hero prints 3:2 (16:9 in the desktop opening).

### Named Rules
**The Sharp Print Rule.** Never round a photograph more than 2px, and never put text, pills or gradients on it. Captions go below.

## Components

### Buttons
- **Primary** (Graphite Ink fill, Gallery Wall text, 3px radius, 46px tall, 0 20px padding, UI 600): the one decisive action on a surface, e.g. "Clear filters" in the empty state. Pressed: `scale(.97)`.
- **Text button** (no fill, Ink text, 1px Silver underline offset 4px; hover underline → currentColor): secondary actions — "clear all", footer links.
- **Icon button** (44px circle, no fill; hover Hover wash; icons 22px, 1.6 stroke, round caps): search, close, menu, "another recipe" (with a 1px Silver outline).
- **Focus:** 2px solid Ink outline, 3px offset, following the element's radius. Never removed.

### Chips (filters)
- **Style:** transparent, 1px Silver border, 3px radius, 44px tall, 0 14px padding, UI 480.
- **Selected:** Ink fill, Paper text, weight 560. Hover: border → Ink. `aria-pressed` reflects state.
- Grouped by filter type with a Meta-sized Pencil label above each group.

### Removable tags (active filters)
- Same outline as chips with a 16px ✕ icon in Pencil, shown in a row under the control strip whenever search or filters are active, followed by a "Clear filters" text button.

### Segmented control (preferences)
- Two equal cells inside a 1px Silver outline (3px radius, 2px inner padding, max 210px wide). Selected cell: Ink fill, Paper text, 2px radius. Used for Language (RO / EN), Theme (Light / Dark) and Text size (Normal / Large), as `role="radiogroup"` with arrow-key support.

### Switch (group by category)
- 30 × 18px track, 1.5px currentColor border, 10px knob. Off: Pencil. On: Ink track, Wall knob. Label beside it at UI size. `role="switch"` + `aria-checked`.

### Sort buttons
- Plain text buttons at UI size in Pencil; active one in Ink at 620 with a 12px arrow (rotates 180° for descending) and the **grease-pencil mark**: a hand-drawn 7px SVG stroke in China Marker under the label that draws itself in with a left-to-right clip-path wipe (500ms). Tapping the active one flips direction.

### Prints (recipe cards)
- **Print:** square, 2px radius, Frame background while loading (image fades in over 500ms), photo `object-fit: cover`. Hover (pointer devices): photo scales to 1.04 over 900ms. Pressed: print scales to .985.
- **Label:** 10px below the print — title (Label title, 2-line clamp), then a Meta line: `30 min` and `2.04 lei`, 12px apart. Partial estimates prefix a Soft Pencil "≈" and carry the explanation in `title` and the accessible label; unavailable costs show "— lei". No icons, no emoji.
- The whole print + label is one link. Hover underlines the title in China Marker (1.5px, offset 4px).

### Featured print ("today's plate", homepage)
- One real recipe chosen per day (seeded by date), shown large with a label and an outlined "another recipe" arrow button. The photo "develops" on load: from `blur(12px) brightness(1.4) contrast(.72) saturate(.15)` and `scale(1.025)` to normal over 1.7s. Swapping fades the old image out in 280ms first.

### Inputs / Search
- An underlined field, like a caption rule: no box, 1px Silver bottom border (Ink on focus), 20px search icon in Pencil, 1rem text, Soft Pencil placeholder. On mobile it lives behind a search icon and replaces the wordmark while open; ≥768px it is always visible (up to 360px wide).

### Navigation
- **Header:** wordmark left (scrolls to top on the homepage, links home elsewhere), search, and a menu button ("Meniu" label ≥768px + two-line icon) with the filter-count badge.
- **Side menu:** a Paper sheet sliding in from the right (`min(420px, 100vw − 36px)`, 520ms), Scrim backdrop, 56px head with Title "Meniu" and a close button. Sections separated by Hairlines: Filters (chips), Categories (44px thumbnail + name + count rows, 56px tall; empty categories disabled), More (48px link rows with a → that nudges 3px on hover), Preferences (segmented controls). Escape, backdrop click and the close button close it; the page behind is inert and scroll-locked; focus returns to the trigger.
- **Footer:** wordmark, then About / Cooking Basics / Ingredient Prices as underlined text links. No tagline.

### Badge
- 20px China Marker pill with On-Marker Small text (650, tabular). Only for the number of active filters.

### Empty state
- "An empty slot on the table": a 120px dashed Silver square with Soft Pencil corner crop marks, a Title heading, a Pencil sentence (max 34ch) and a Primary "Clear filters" button.

### Tabs (recipe page)
- Text tabs at UI size, inactive Pencil, active Ink at 620 with the same grease-pencil mark underneath; counts in Soft Pencil Meta after the label. A Hairline runs under the row. `role="tablist"` / `tab` / `tabpanel`.

### Fact box (recipe page)
- One framed rectangle (1px Silver, 3px radius) of three centred cells separated by Hairlines: prep time, servings stepper (middle), cost per serving. Each cell is a figure (wdth 112, 400, tabular, 1.25rem → 1.5rem ≥768px) with its unit beneath in Small Soft Pencil ("min", "porții", "lei / porție"); no separate label row. The stepper's "−" / "+" are 36px outlined squares (1px Silver, 3px radius) with a 44px hit area, turning China Marker on hover.

### Checklist rows (ingredients)
- Full-width rows separated by Hairlines, min 48px tall. Quantity in tabular Ink 600, name in Body. The checkbox is a 22px square (3px radius, 1.5px Silver border); checked: China Marker fill with an On-Marker tick, and the row text drops to Soft Pencil with a line-through. Section headers inside the list use Section label style.

### Instructions
- Numbered steps: the number in Headline-width figures (wdth 112, 400, China Marker), text in Body at 1.6 line-height, 24px between steps, max 65ch.

### Receipt (ingredient cost breakdown) and tables (prices)
- Rows separated by Hairlines, numbers right-aligned and tabular, totals in Ink 600 above a 1px Ink rule. Header cells in Small Pencil, sentence case. On narrow screens tables scroll inside their own container, never the page.

### Notes and callouts
- Paper sheet, 3px radius, 16–20px padding, no border or shadow; heading in Section label style. The cook's personal notes use Marker Wash (China Marker at 7%) with the heading in China Marker.

## Do's and Don'ts

### Do:
- **Do** let photographs be the largest and only colourful thing on every screen.
- **Do** put captions (title, minutes, lei) below the photo, in the Meta style, with units in Soft Pencil.
- **Do** use the semantic tokens (`bg-wall`, `text-ink`, `text-ink-2`, `border-line`, `border-line-strong`, `text-mark`) so both themes work without `dark:` overrides.
- **Do** keep every target ≥44px and UI text ≥15px (0.9375rem); 13px (0.8125rem) is the floor for badges and short labels only.
- **Do** use tabular figures for every number (minutes, lei, servings, quantities, counts).
- **Do** respect `prefers-reduced-motion`: disable the develop animation, view transitions and scaling.
- **Do** test at 360px, 390px, 768px and 1440px, in RO and EN, light and dark, normal and large text.

### Don't:
- **Don't** use emoji as icons (no ⏱ 💰 🥐). Use typography or a 1.6-stroke line icon.
- **Don't** put text, pills, badges or gradients on top of photographs.
- **Don't** use card shadows, hover lifts, glassmorphism, gradient text, or rounded "bubbly" cards (>3px) for content.
- **Don't** introduce brand colours (greens, yellows, terracotta) or cream backgrounds; the wall is a cool grey.
- **Don't** use China Marker outside the uses listed under The One Mark Rule, and never as a large fill.
- **Don't** add a second typeface or all-caps tracked labels.
- **Don't** hide the side menu's features elsewhere; filters, categories, links and preferences all stay in the menu.
