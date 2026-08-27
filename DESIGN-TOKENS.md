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
- **Background is an animated gradient video, not a static fill** (corrected 2026-08-27). Figma's
  export silently drops video fills to an empty, un-named `<div>` with no `src` — easy to miss since
  it looks like dead markup rather than an error. Initially approximated with a static gradient
  layer for Tablet/Mobile (Desktop's look came from the decorative blob's own fill); once the user
  supplied the actual source video (`hitels_20_gradient_light.mp4`, uploaded to R2 directly), it
  replaced that approximation entirely — same video used across all breakpoints. Transcoded from
  4.6MB to 700KB (MP4, H.264) / 117KB (WebM, VP9), with a WebP poster frame for pre-load paint.
  Rendered via `<video autoplay muted loop playsinline>` with WebM listed first (smaller) and MP4 as
  fallback.
  - **Loop point fix:** the raw source video isn't a seamless loop — its first and last frames show
    the gradient band at visibly different angles (confirmed by diffing the actual frames, not just
    eyeballing it), so playback jumped on every loop. Fixed by building a ping-pong version (forward
    + the same footage reversed, concatenated) so playback always ends on the exact frame it started
    from — verified the resulting boundary frames differ by only ~7/255 max pixel value (compression
    noise, imperceptible), vs. a completely different gradient position before. Doubles duration
    (10s -> 20s) and file size (700KB -> 1.4MB MP4, 117KB -> 270KB WebM) — still small enough not to
    matter for a background video. Uploaded over the same R2 keys, no code change needed.
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
  Desktop and Tablet, but **visible** on Mobile. Built in `AddOns.astro` as `hidden max-md:flex` —
  verified with Playwright that it's actually `display:none` on Desktop/Tablet and `display:flex`
  only below 768px, not just "looks right in a screenshot."
- **Stories, Pricing, and FAQ have real per-breakpoint layout differences beyond simple reflow**,
  confirmed via source before building (each one contradicted an initial reflow assumption):
  - **Stories** cards intentionally overflow their container at every breakpoint (confirmed via exact
    pixel widths: 604/391/391 desktop, 532/391/391 tablet, 253/253/253 mobile) — a horizontal-scroll
    card row (`overflow-x-auto` + scroll-snap), not a stack, at any breakpoint.
  - **Pricing** cards stack vertically on **both** Tablet and Mobile (only Desktop uses the 3-column
    row) — an exception to the more common "Desktop+Tablet row, Mobile stack" pattern seen elsewhere.
  - **FAQ** stacks (title above questions) on Tablet, not just Mobile — Desktop is the only breakpoint
    with the side-by-side layout.
- **Footer link content genuinely differs on Mobile**, confirmed via source (not assumed): Desktop
  and Tablet share "Product" (Booking Engine/Custom Website/Pricing) + "Company" (About us/Contact
  us/Resources). Mobile has different "Product" links (Product Overview/Hitels Awards/Hotel Managers)
  plus an entirely separate "Resources" column with its own sub-links, and a different "Company" list
  (About Hitels/Contact Us/Book a Demo).
- **Product Offerings' image treatment differs by breakpoint, confirmed via source (not a guess)**:
  Desktop/Tablet show a composited collage of miniature nested hotel-site mockups (dozens of
  sub-pixel elements, e.g. 2.9px font sizes — decorative, never meant to be legible). This was
  captured as a single flattened screenshot image rather than hand-coded, since reconstructing
  illegible sub-pixel content node-for-node would be both impractical and pointless. Mobile instead
  shows a plain flat photo directly (`image60`/`image59` used without the `opacity-0` hack Desktop
  applies to the same layer) — a real, distinct treatment, not a fallback/simplification on my part.

## Partner logo ticker is an animated marquee, not a static row

The Figma layer is literally named "Logo Ticker" — a static frame can't show that it moves, and this
was initially missed, built as a static `overflow-hidden` row instead. Fixed in `PartnerLogosTrack.astro`
(one full set of logos) + `PartnerLogos.astro` (renders the track twice back-to-back inside a `w-max`
flex container, animates `translateX(0)` -> `translateX(-50%)` over 40s, linear, infinite). Since both
copies are pixel-identical, the loop is seamless: the instant the first set scrolls fully offscreen,
the second is sitting exactly where the first one started. Respects `prefers-reduced-motion`.

## Judgment calls in the remaining sections (Testimonial through Footer)

- **Testimonial prev/next arrows are not wired to anything.** Figma shows the buttons but only one
  testimonial's content exists in the source — no second slide to cycle to. Rendered as shown rather
  than building fake carousel logic with nothing to switch between.
- **FAQ is a static list, not an interactive accordion.** Every question in Figma shows its answer
  permanently visible with a "Minus" icon — there is no "Plus"/collapsed-state asset anywhere in the
  source. Wiring up click-to-collapse would mean inventing a closed-state appearance with no design
  reference for it, which contradicts "don't add features not present in Figma." If real accordion
  behavior is wanted later, the closed-state visual needs to be defined first (likely a "Plus" icon).
- **Pricing's third card background is a CSS gradient approximation**, not the exact source. The
  original is a radial gradient defined via an inline SVG data-URI with a matrix transform (rotated
  ellipse centered below the card's visible area). Approximated with a simple `bg-gradient-to-b`
  matching the same color stops, since the effect is a subtle ambient glow, not precise content —
  pixel-perfect fidelity here would add a large embedded SVG string for a difference not visible at
  normal viewing distance. Flagged in case exact reproduction matters more than assumed.
- **Decorative blob positioning in Footer uses one asset with responsive repositioning**, rather than
  the 3 slightly different blob SVGs Figma exports per breakpoint (same simplification already applied
  to Hero's blob, and for the same reason: it's a soft background glow, not precise content).

The "Framer Partner" badge is **not** a scrolling partner logo — per the original Figma data it's
absolutely positioned, fixed at horizontal center, `z-10` above the scrolling track, with its own
white linear-gradient backdrop so logos passing behind it fade to white instead of an abrupt cut. It was
initially (wrongly) included as a regular item inside the scrolling track. Fixed in `PartnerLogos.astro`.

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
