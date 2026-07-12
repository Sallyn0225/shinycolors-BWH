---
name: 闪耀色彩三围资料
description: Bright fan data tool for raw B/W/H — Color Roster Desk clarity with unit/idol identity color.
colors:
  signal-blue: "#2455b7"
  signal-blue-hover: "#1c469d"
  signal-blue-dark: "#75a0ff"
  signal-blue-dark-hover: "#93b4ff"
  focus-ring: "#285cc7"
  focus-ring-dark: "#80a9ff"
  on-control: "#f8fbff"
  on-control-muted: "#dbe7ff"
  on-control-dark: "#0d1524"
  on-control-muted-dark: "#1a2740"
  page: "#f4f6fa"
  panel: "#fbfcfe"
  muted-surface: "#e9edf4"
  hover-surface: "#f0f4fa"
  ink: "#172033"
  ink-secondary: "#4d5b70"
  ink-muted: "#718096"
  border-subtle: "#dce3ee"
  border-strong: "#bac7d9"
  track: "#e5eaf2"
  chart-grid: "#c7d1df"
  danger: "#b13d4e"
  success: "#1f6b4a"
  page-dark: "#121a28"
  panel-dark: "#192333"
  muted-surface-dark: "#222d3e"
  hover-surface-dark: "#253248"
  ink-dark: "#edf2fa"
  ink-secondary-dark: "#b9c5d6"
  ink-muted-dark: "#8f9db1"
  border-subtle-dark: "#2d3a4e"
  border-strong-dark: "#52627b"
  track-dark: "#2b3749"
  chart-grid-dark: "#52627b"
  danger-dark: "#f1848e"
  success-dark: "#5dca98"
typography:
  display:
    fontFamily: "'Noto Sans JP', 'Noto Sans SC', 'Hiragino Sans', 'Yu Gothic UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)"
    fontWeight: 750
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Noto Sans JP', 'Noto Sans SC', 'Hiragino Sans', 'Yu Gothic UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Noto Sans JP', 'Noto Sans SC', 'Hiragino Sans', 'Yu Gothic UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.04em"
  body:
    fontFamily: "'Noto Sans JP', 'Noto Sans SC', 'Hiragino Sans', 'Yu Gothic UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Noto Sans JP', 'Noto Sans SC', 'Hiragino Sans', 'Yu Gothic UI', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "12px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "20px"
  2xl: "24px"
  3xl: "36px"
  control-height: "42px"
  shell-max: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.on-control}"
    rounded: "{rounded.sm}"
    padding: "0 15px"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-hover}"
    textColor: "{colors.on-control}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 15px"
    height: "{spacing.control-height}"
  segment-active:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.on-control}"
    rounded: "{rounded.sm}"
    height: "{spacing.control-height}"
  input-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "{spacing.control-height}"
    padding: "0 12px"
  panel-card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  rank-badge:
    backgroundColor: "{colors.muted-surface}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.xs}"
    size: "36px"
---

# Design System: 闪耀色彩三围资料

## 1. Overview

**Creative North Star: "The Color Roster Desk"**

This is a bright fan **reference desk**, not a stage show and not a judgment scoreboard. Surfaces stay cool-neutral so **raw centimeters** and **idol/unit identity colors** can carry personality. The chrome is crisp and ready: segmented metrics, searchable ranks, dual compare — playful enough for fandom, disciplined enough that a number is never buried.

Density is medium: roomy tables and 42px controls for touch and scan, without sparse marketing whitespace. Light and dark themes share the same structure; Signal Blue marks selection and action, while per-member and per-unit colors from the data stay the only “character” colors on the page.

The system explicitly rejects beauty ranking / thirst-bait scoreboards and objectifying copy. Sort order is a metric sort, never a verdict.

**Key Characteristics:**
- Cool paper neutrals + one Signal Blue control accent
- Identity color reserved for avatars, unit marks, and chart series — not whole-page washes
- Tabular numbers and mono for ranks/counts
- Soft panel lift; borders + tonal layers do most of the structure
- JP/SC-first sans stack; no display serif theatrics

## 2. Colors

A cool blue-gray neutral ramp with a single **Signal Blue** accent for controls; idol and unit colors arrive from data and never replace the chrome palette.

### Primary
- **Signal Blue** (`#2455b7` light / `#75a0ff` dark): Active segments, primary buttons, active nav underline, links. Hover deepens to `#1c469d` (light) / `#93b4ff` (dark). Used for “selected/action,” not as a full-bleed brand field.
- **Focus Ring** (`#285cc7` / `#80a9ff`): 3px solid focus outline with 2px offset on interactive elements.

### Neutral
- **Page Mist** (`#f4f6fa` / `#121a28`): Page background; optional faint cool radial wash only.
- **Panel Paper** (`#fbfcfe` / `#192333`): Cards, tables, inputs.
- **Muted Tray** (`#e9edf4` / `#222d3e`): Segment tracks, thead, rank badges, clear chips.
- **Hover Veil** (`#f0f4fa` / `#253248`): Row and control hover.
- **Ink** (`#172033` / `#edf2fa`): Primary text — high contrast mandatory.
- **Ink Secondary** (`#4d5b70` / `#b9c5d6`): Descriptions, labels.
- **Ink Muted** (`#718096` / `#8f9db1`): Meta, counts, placeholders (still aim ≥4.5:1).
- **Border Subtle / Strong** (`#dce3ee` / `#bac7d9` light; `#2d3a4e` / `#52627b` dark): Panel edges and control strokes.
- **Track / Chart Grid** (`#e5eaf2` / `#c7d1df` light; `#2b3749` / `#52627b` dark): Progress tracks and radar grid.

### Semantic
- **Danger** (`#b13d4e` / `#f1848e`): Errors only — not for “losing” a comparison in a judgmental way.
- **Success** (`#1f6b4a` / `#5dca98`): Affirmation states if needed; not “winner” celebration chrome.

### Named Rules
**The Signal, Not the Stage Rule.** Signal Blue marks selection and action (≤~10% of chrome). It never paints full hero backgrounds or scoreboard glows.

**The Identity Belongs to the Cast Rule.** Per-idol/unit hex from data frames avatars and chart series only. Do not recolor entire rows or pages with unit color washes.

**The No Judgment Hue Rule.** Never introduce gold/silver/bronze trophy colors or “hotness” pink gradients to imply ranking prestige beyond raw sort order.

## 3. Typography

**Display Font:** Noto Sans JP / Noto Sans SC (with Hiragino Sans, Yu Gothic UI, Microsoft YaHei, system-ui)
**Body Font:** Same stack
**Label/Mono Font:** `ui-monospace, SFMono-Regular, Consolas, monospace` for ranks, counts, tabular stats

**Character:** A single CJK-first humanist sans — clear, modern, slightly playful in weight, never decorative. Numbers stay tabular where they compete for scanning.

### Hierarchy
- **Display** (750, `clamp(1.7rem, 2.8vw, 2.4rem)`, 1.15, -0.04em): Page titles in `.page-intro h1`.
- **Headline** (700, 1.35rem, ~1.25, -0.025em): Results section titles.
- **Title** (700, ~0.95rem, 1.2, 0.04em): Brand wordmark, dense labels.
- **Body** (400, 15px, 1.5): Default UI and descriptions; intro prose max-width ~40rem.
- **Label** (700, 0.78rem, 1.2, 0.02em): Control legends, table headers (headers can use 0.72rem + 0.03em tracking).
- **Mono / Tabular** (0.75–0.78rem): Rank badges, results counts, measurement figures.

### Named Rules
**The Number Is the Headline Rule.** When a cm value and decorative type compete, the number wins — mono or tabular-nums, right-aligned when comparing.

**The Floor on Tracking Rule.** Display letter-spacing never tighter than -0.04em (already at the floor on page titles).

## 4. Elevation

Hybrid: **tonal surfaces + one soft ambient shadow** on major panels (control bars, table wraps). Depth is quiet; borders and muted trays carry most hierarchy. Sticky header uses translucent page color + light blur (disabled under `prefers-reduced-transparency`).

### Shadow Vocabulary
- **Soft panel** (`box-shadow: 0 8px 24px rgba(28, 49, 83, 0.06)` light / `0 8px 24px rgba(3, 8, 18, 0.25)` dark): Control panels, ranking table shell, major cards only.

### Named Rules
**The One Soft Lift Rule.** Only the soft panel shadow. No stacked multi-elevation systems, no 16px+ ghost cards paired with heavy borders for decoration.

**The Flat Row Rule.** Table rows and list items stay flat; hover is a surface tint, not a shadow.

## 5. Components

### Buttons
- **Shape:** Gently rounded controls (`8px`)
- **Primary:** Signal Blue fill, on-control text, min-height `42px`, horizontal padding `15px`, weight 700
- **Secondary / Ghost:** Transparent with strong border; hover border shifts to Signal Blue + hover surface
- **Hover / Focus / Active:** Color transitions ~160ms ease; active press `translateY(1px) scale(0.99)`; focus-visible 3px focus ring
- **Disabled:** `not-allowed` cursor; do not invent low-contrast gray that fails AA

### Segmented control (metric chips)
- **Style:** 3-column grid in muted tray, strong outer border, `8px` radius, min-height `42px`
- **State:** Active segment fills Signal Blue with on-control text; inactive secondary text; keyboard radiogroup with arrow keys

### Cards / Containers
- **Corner Style:** `12px` panels; `8px` nested controls
- **Background:** Panel paper
- **Shadow Strategy:** Soft panel shadow
- **Border:** 1px subtle
- **Internal Padding:** ~20px on control panels; table cells ~15×14px

### Inputs / Fields
- **Style:** Panel background, strong border, `8px`, height `42px`, padding `0 12px`
- **Search:** Clear chip inside field (`6px` radius) on muted surface
- **Focus:** Global 3px focus ring
- **Selects:** Same height family as text inputs for alignment in control grids

### Navigation
- Sticky header, blur/translucent page tint, bottom subtle border
- Nav links: stacked label + small description; active state gets Signal Blue 3px bottom bar (not a side stripe)
- Brand: mini 3-bar mark in Signal Blue inside an 8px frame

### Ranking table & identity
- Fixed table layout in a soft-lift panel; thead muted tray; row hover veil
- **Rank badge:** 36×28 mono chip on muted surface, `6px` radius
- **Avatar frame:** 54×54, `10px` radius, **2px border in identity color** + 1px subtle outline
- Progress bars use global metric range; track neutrals, not unit color floods

### Compare / radar
- Side-by-side identity cards; swap control is a secondary button in the middle slot
- Radar uses chart-grid neutrals + member identity series colors; halo matches panel

### Empty states
- Calm copy, primary/secondary actions to clear filters — never shaming or joke-objectifying language

## 6. Do's and Don'ts

### Do:
- **Do** keep raw cm values as the primary scannable content (mono/tabular, clear units).
- **Do** use Signal Blue only for selection, primary action, links, and active nav indicators.
- **Do** apply idol/unit identity color to avatars, small marks, and chart series.
- **Do** preserve light / dark / system themes with the same structure and token roles.
- **Do** keep control height near `42px` and panel radius at `12px` / control radius at `8px`.
- **Do** show focus rings (`3px` + `2px` offset) and honor reduced motion / reduced transparency.
- **Do** write empty and compare states as neutral data language (“选择两名不同成员…”), never evaluative.

### Don't:
- **Don't** build a **beauty ranking or thirst-bait scoreboard** (PRODUCT.md anti-reference): no hot-or-not framing, no trophy metals, no body-judgment copy.
- **Don't** invent composite scores, “overall attractiveness,” or emoji reactions on measurements.
- **Don't** wash entire rows/cards with saturated unit color; identity is a frame, not a flood.
- **Don't** use side-stripe accent borders (`border-left`/`border-right` > 1px) on rows or cards.
- **Don't** use gradient text, glassmorphism stacks, or decorative grid backgrounds.
- **Don't** pair thick decorative shadows with heavy borders on the same chrome element.
- **Don't** push display letter-spacing tighter than `-0.04em` or page titles larger than the current clamp ceiling without a real content need.
- **Don't** default to cream/sand paper backgrounds; stay on the cool Page Mist neutrals already in tokens.
