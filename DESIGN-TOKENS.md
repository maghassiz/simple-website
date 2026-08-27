# Hitels Design Tokens

Extracted from Figma: `Hitels Website` (fileKey `0bx3Si4ObEyKJ6XgLEETra`), isolated from the
homepage hero (node `122:28637`) and cross-checked against a screenshot.

These are wired into Tailwind's theme in `src/styles/global.css` via the `@theme` block, so
`bg-brand`, `text-navy`, `font-heading text-h1`, etc. are available as utility classes in any
future generated page.

## Colors

| Token | Hex | Figma variable | Usage |
|---|---|---|---|
| `brand` | `#5D4BFF` | `Primary/Brand` | Primary accent, hero gradient |
| `navy` | `#130C3C` | `Primary/Blue` | Dark backgrounds, header |
| `yellow` | `#FFD641` | `Primary/Yellow` | Primary CTA buttons ("Book a demo") |
| `background` | `#FBFBFF` | `Primary/Background` | Page background |
| `gray` | `#676479` | `Secondary/Gray` | Muted/secondary text |
| `basalt` | `#252625` | `Secondary/Basalt Black` | Body copy on light backgrounds |
| `border` | `#E1E1EC` | `Secondary/Border` | Dividers, input borders |
| `light-gray` | `#F2F2F7` | `Secondary/Light Gray` | Subtle section backgrounds |
| `brand-blue` | `#0C475C` | `Brand/Blue` | Secondary brand color (usage unconfirmed — flag if unused) |

## Typography

- **Headings** — `Garnett Medium`, weight 500, negative letter-spacing (-2.5px)
- **Body** — `Inter`, weights 400/500, letter-spacing -1px to 0

| Token | Size | Line-height | Letter-spacing |
|---|---|---|---|
| `text-h1` | 56px | 1.1 | -2.5px |
| `text-h2` | 48px | 1.1 | -2.5px |
| `text-h3` | 40px | 1.2 | -2.5px |
| `text-h4` | 32px | 1.2 | -2.5px |
| `text-h5` | 24px | 1.4 | -2.5px |
| `text-h6` | 20px | 1.4 | -2.5px |
| `text-body-lg` | 20px | 1.5 | -1px |
| `text-body-md` | 16px | 1.5 | -1px |
| `text-body-sm` | 14px | 1.5 | 0 |

## ⚠️ Action needed: fonts

- **Garnett Medium** is a licensed/commercial font, not on Google Fonts — it is NOT bundled yet.
  `font-heading` currently falls back to `Georgia, serif`, which will look wrong. You'll need to
  either supply the licensed font files (WOFF2) to self-host, or confirm a substitute.
- **Inter** is free and available via Google Fonts — not yet linked in the project. Trivial to add
  once we start building real pages.

## Excluded from these tokens (and why)

Querying Figma variables against the full "Desktop - Home" page (node `43:3671`) initially
returned a much larger, conflicting set — including `Hotel/Dark Green` (#0D2937),
`Primary/Moss Green` (#495C4E), `Primary/Soft Sand` (#EAE3D5), `Other/Background` (#F9F6F3),
`Other/Text` (#5A7C88), and font families `TT Ramillas Trl` / `Founders Grotesk`.

These belong to **embedded portfolio mockups** in the "Product Offerings" section — literal
screenshots/mockups of other hotel clients' sites (e.g. "Eyja", "Knox") shown as case studies on
Hitels' own homepage, not Hitels' own brand. They were deliberately excluded. If a future page
needs to recreate one of those portfolio mockups faithfully, re-extract variables scoped to that
specific client card rather than reusing the tokens above.
