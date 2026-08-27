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

Confirmed with the user (2026-08-27): `Hotel/Dark Green` and `Primary/Moss Green` are **not** part of
the Hitels brand — they belong to the embedded client portfolio mockups as described below.

## Typography

- **Headings** — `Garnett Medium`, weight 500, letter-spacing -2.5% of font size
- **Body** — `Inter`, weights 400/500, letter-spacing -1% of font size (small: 0)

> **Correction (2026-08-27):** the values below were originally hardcoded as flat `-2.5px`/`-1px`,
> which was wrong — Figma expresses letter-spacing as a **percentage of font size**, not a flat
> value. Confirmed by cross-checking rendered instances directly (e.g. h1 at 56px renders
> `tracking-[-1.4px]` = 56 × -2.5%; the "Trusted by partners" text at 16px renders
> `tracking-[-0.16px]` = 16 × -1%). Fixed in `global.css`; table below now shows the corrected px values.

| Token | Size | Line-height | Letter-spacing |
|---|---|---|---|
| `text-h1` | 56px | 1.1 | -1.4px |
| `text-h2` | 48px | 1.1 | -1.2px |
| `text-h3` | 40px | 1.2 | -1.0px |
| `text-h4` | 32px | 1.2 | -0.8px |
| `text-h5` | 24px | 1.4 | -0.6px |
| `text-h6` | 20px | 1.4 | -0.5px |
| `text-body-lg` | 20px | 1.5 | -0.2px |
| `text-body-md` | 16px | 1.5 | -0.16px |
| `text-body-sm` | 14px | 1.5 | 0 |

## Fonts

- **Garnett Medium** is a licensed/commercial font from Sharp Type Co. Sourced from the team's
  Drive folder, converted TTF -> WOFF2, and served from Cloudflare R2 (not committed to git —
  commercial font EULAs often restrict redistribution, even in a private repo). The `@font-face`
  URL in `global.css` must match `R2_PUBLIC_URL` — see `scripts/upload-to-r2.mjs` for how assets
  get pushed to the bucket, and `scripts/set-r2-cors.mjs` for the one-time CORS setup fonts need
  (browsers enforce CORS on cross-origin fonts, unlike images).
- **Inter** is free and available via Google Fonts — not yet linked in the project. Trivial to add
  once we start building real pages.

## Responsive breakpoints

Per spec: Desktop = default, Tablet = `max-width: 1024px` (Tailwind `max-lg:`), Mobile =
`max-width: 768px` (Tailwind `max-md:`). Figma has separate Desktop/Tablet/Mobile frames for every
section — these are **not** simple reflows of each other. Confirmed real differences found in Hero:

- **Texture overlay opacity** differs: `opacity-10` on Desktop, `opacity-40` on Tablet/Mobile.
- **Background**: Desktop's gradient look comes entirely from the decorative blob SVG's own fill;
  Tablet/Mobile *additionally* have an explicit `bg-gradient-to-b from-[#3d2c99] to-[#654aff]`
  layer that Desktop doesn't have.
- **Layout direction**: Desktop is a left-aligned two-column row (copy left, mockup right).
  Tablet/Mobile are centered and stacked.
- **Body copy text differs by breakpoint** — not a truncation, genuinely different wording. Desktop/
  Tablet: "...No templates. No DIY builders. Just a premium digital presence...". Mobile: shortened
  to "We build award-winning, bespoke hotel websites and seamless booking engines."
- **CTA buttons**: Desktop/Tablet are content-width. Mobile buttons are `flex-1` (equal-width, fill
  the row).
- **Nav collapse is not uniform across "tablet and mobile"**: Tablet keeps the "Book a demo" button
  visible next to the hamburger (only the link list hides). True Mobile (<768px) hides both the
  links *and* the button, showing only logo + hamburger. Implemented as `md:flex` on the button
  (visible from 768px up) vs `lg:flex` on the links (visible only from 1024px up).
- **Mobile Hero has an extra "Stories" row** (12 hotel-showcase cards with photos + logo badges)
  positioned inside the hero itself, between the nav and headline. This does not exist on Desktop or
  Tablet at all — confirmed via the Mobile frame's own metadata, not a guess. **Not yet implemented**
  — deferred pending user direction, since it requires ~15 more image assets and is structurally
  unlike anything on the other breakpoints.
- **"Add-ons" section visibility differs by breakpoint**: hidden (`hidden="true"` in Figma) on both
  Desktop and Tablet, but **visible** on Mobile. Not yet built (still in the remaining sections), but
  noted here so it isn't accidentally hidden on all breakpoints when it is.

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
