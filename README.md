# ItsZhop 🧶

A complete, production-quality e-commerce frontend for **ItsZhop** — a small Indian
store selling handmade crochet toys & bags, reusable shopping bags, women's
handbags and small-batch homemade pickles.

**Zero runtime dependencies. No build step.** A clean, componentised vanilla
ES-module SPA that loads fast and is easy to extend.

## Try it

```bash
npm run serve        # static server on :8080 (any static host works too)
```

Then open the printed URL. Everything (cart, wishlist, theme, orders) persists
in `localStorage`.

## What works

- **Storefront** — hero, featured categories & products, about, contact, policies, 404
- **Shop** — search (`pickle`, `crochet`, `bag`…), category/price/availability
  filters, 5 sort orders, active-filter chips, result counts, empty states
- **Product pages** — variants, quantity stepper clamped to live stock,
  Add to Cart, **Buy Now** (express checkout), wishlist, related items,
  out-of-stock handling (disabled buttons, honest labels)
- **Cart** — drawer + full page; add / remove / inc / dec / clear, per-line and
  grand totals in **₹ (Indian formatting)**, duplicate-line merging, stock caps,
  free-shipping progress (free ≥ ₹999, else flat ₹50), persistence
- **Checkout** — full Indian-address validation (10-digit mobile, 6-digit PIN,
  email…), order summary, honest *Cash-on-Delivery demo* notice (no fake
  payments), order confirmation + order history (`Account` icon)
- **Wishlist** — heart toggles everywhere, persisted, dedicated page
- **Light / Dark mode** — designed dark theme (not inverted), persisted,
  applied pre-paint (no flash)
- **UX details** — toasts for every cart/wishlist action, skeleton loading,
  sticky header with live cart count, hamburger nav, keyboard & screen-reader
  friendly (semantic landmarks, focus states, aria labels), responsive from
  375 px to 1920 px

## Architecture

```
index.html            app shell (theme pre-paint script, fonts, css, module entry)
css/                  tokens (design system + themes) / base / components / pages
js/
  lib/                format (INR), validate, dom, bus        — pure, unit-tested
  data/               catalog.js (categories + products), content.js (policies…)
  state/              cart-core (pure, unit-tested) + cart / wishlist / theme /
                      stock / orders / session (buy-now)      — persisted stores
  components/         header, footer, cart-drawer, product-card, rating, toast, icons
  pages/              home, shop, product, cart, checkout, wishlist, orders,
                      order-success, about, contact, policies, notfound
  router.js           hash router (#/shop?cat=pickles&sort=price-asc)
  main.js             bootstrap + global action delegation + cross-component sync
tools/                image pipeline used to source product photos
tests/                unit (cart math, validators), render smoke, jsdom e2e
```

### Brand logo

Source of truth: **`assets/img/brand/logo.png`** (1254x1254, supplied artwork).
Everything else is derived from it by crop + scale only - no recolouring, no
redrawing:

| File | Size | Used for |
|---|---|---|
| `mark-96/192.png` | square | header, mobile menu, footer, favicon, iOS icon |
| `lockup-512.jpg` | 1:1.07 | social share preview (`og:image`) |
| `logo.png` | 1254x1254 | untouched master |

`mark-*.png` crops to the bag + IZ monogram and squares it up so the artwork
fills ~92% of the frame. The full logo's own wordmark is illegible below
~120px, so the site pairs the mark with live HTML text for the name instead -
crisp and selectable at any size.

Rendered by `js/components/brand.js`, which serves the right file via
`srcset`. If an image 404s the `<img>` removes itself and a built-in SVG
yarn mark shows, so the header never renders broken.

To regenerate after replacing `logo.png`, see `tools/make_logo_assets.py`.

### Adding products / categories

Append to `PRODUCTS` / `CATEGORIES` in `js/data/catalog.js`. Search, filters,
cart, checkout, sitemap-style footer links and the home rails pick new entries
up automatically. Prices are **integer rupees** — all math is integer-safe.

### Integrating a real backend later

All persistence lives behind tiny store modules (`js/state/*`). Swap their
`readJSON/writeJSON` internals for API calls (or replace `js/data/catalog.js`
with a fetch) without touching UI components. Checkout already separates
*frontend flow* from *payment*: the Place Order handler is the single seam
where a UPI/card gateway would be wired in.

## Testing

```bash
npm test                 # pure-logic unit tests + SSR-style render smoke (no deps)
npm i jsdom              # once, for the functional suite
node tests/e2e.mjs       # boots the real app in jsdom and walks the whole
                         # journey: theme → cart → drawer → filters → sort →
                         # search → wishlist → checkout validation → order →
                         # buy-now → orders → 404
```

## Design system

- **Type** — *Fraunces* (display/wordmark) + *Manrope* (UI/body)
- **Light** — warm off-white `#faf7f2`, terracotta primary `#b0522a`, olive secondary
- **Dark** — true dark surfaces `#171310/#201b16`, warm amber primary `#e0824f`
- Radii 8–16 px, soft warm shadows, generous spacing, usability > decoration

---

*Demo store: orders are stored locally on the device; no real payments are processed.*
