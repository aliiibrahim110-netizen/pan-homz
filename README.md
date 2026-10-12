# PAN HOMZ

An independent, Arabic-first RTL furniture marketplace presentation prototype. React 19, TypeScript, Vite, React Router, locally hosted Cairo fonts, and a custom warm living design system. Built from the supplied [project brief](docs/PROJECT_BRIEF.md).

This is a working browser-local demonstration, **not a live commerce platform**. It does not collect money, reserve inventory, dispatch deliveries, authenticate users, or send contact messages. No Shopify storefront connection is required.

## Run

Validated with Node 24.19.0 and npm 11.9.0. Node 22+ is required.

```bash
cd /workspace/pan-homz
npm ci
npm run dev -- --port 5173
```

Use `/?demo=1` for discreet presentation controls. The guided sequence is optional and can be stopped at any step. For a static production build, run `npm run build`, then `npm run preview -- --port 4173`. A deployment host must rewrite application routes to `index.html` for direct navigation.

```bash
npm run build
npm test
npm run test:e2e
npm run format:check
```

Playwright uses `/usr/bin/chromium` in this cloud environment and expects the development server on port 5173. On another machine, set `launchOptions.executablePath` to its Chromium binary or install Playwright Chromium and remove that override.

## What is implemented

- Original warm ivory / forest green / terracotta visual system, Cairo typography, true RTL, responsive layouts, reduced motion, keyboard navigation, dialog focus trapping and local imagery.
- Exact category hierarchy, desktop mega menus, nested mobile navigation, breadcrumbs, editorial category landing pages, and honest empty collections.
- Seven supplied catalog products; original SKUs, numeric prices, dimensions, material descriptions and image URLs preserved. Corner direction variants remain under one listing.
- Product discovery, normalized Arabic and SKU search, suggestions, numeric price sorting, manual ranking, contextual price/material/color/fabric/dimension/direction filters.
- Product detail, zoom, wishlist, recently viewed products, direction selection, quantity and cart management, and browser persistence.
- PAN10 demonstration discount, destination-dependent shipping, Egyptian checkout validation, three simulated payment choices, DEMO order confirmation and local phone verification.
- Item-level tracking and presenter controls that never falsely mark an entire mixed order as delivered.
- Seller-scoped records, staged customer detail visibility, proof-of-delivery file selection before delivery, cancellation and returns as distinct states.
- Admin orders, vendor assignment, product active/draft visibility and ranking, supplier views, delivery management, settlement tables, real downloadable UTF-8 CSV, weekly pending-payable grouping, calculated charts and persistent activity log.
- Account demonstration, about, contact simulation, FAQ, shipping, warranty, returns, privacy and terms pages.
- Unique titles/descriptions, canonical paths, product JSON-LD without fictitious live offers or reviews. Search indexing is disabled for this presentation prototype.

## Presentation walkthrough

1. Open `/?demo=1`. Explore a category and search for `كنبة`, `ركنة`, `كومود`, or a source SKU.
2. Open `/product/corner-419`. Choose **شمال**; observe `Sofa L-Shape-419-L`, unchanged source image and price.
3. Add the corner sofa and a wardrobe to the cart. Change quantities and apply `PAN10`.
4. Complete demo checkout using test information. No raw name, address or phone is stored; only a SHA-256 phone verification fingerprint is retained. Keep the generated DEMO identifier.
5. Track that order with the same phone. Alternatively, use the fictional `DEMO-1001` example and its non-real verification string `00000000000`.
6. Open `/seller-center/demo`. Switch between the two expressly fictional supplier roles. Each sees only its assigned items. Before ready-for-shipping, delivery address and phone are hidden in the seller interface.
7. Open an item. Advance execution stages, select a local PDF or image proof (max 5 MB), then mark it delivered. The file itself is never uploaded or stored; only its name is kept for this simulation.
8. Open `/admin/demo`: assign vendors, hide a product as a draft, change recommended rank, examine calculated SLA and finance records, download CSV, or register a cancellation/return.
9. In `/account`, reset local demo data before a fresh presentation if desired. This requires explicit confirmation in the UI.

## Catalog and operational accuracy

`src/data/catalog.ts` contains the authoritative seven historical sample records. `scripts/product-images.json` preserves the exact supplied URLs. Original product image files are cached byte-for-byte under `public/images`; generated editorial imagery is separate and never used as a product listing photo. Original generated sources remain outside the checkout in `/workspace/generated_images` in this cloud instance.

```bash
npm run fetch:images
```

This idempotent helper downloads only missing catalog files through verified HTTPS. It does not overwrite existing files or substitute imagery. Refreshing from source requires `cdn.shopify.com` network access. If a local file and its original remote URL both fail, a product-specific unavailable-image state appears.

Prices preserve the supplied exact numeric values internally, including fractional compare-at values. The UI rounds consistently to whole Egyptian pounds. Discounts derive from the source price pair. No current price, stock, sales ranking, rating, supplier credential or customer review is invented. Unverified bed sizes, wardrobe door types and other absent specifications are not offered. Newest sorting is omitted because the source records have no publication dates. Collections without supplied records remain navigable but empty.

Demo settings:

- Shipping: Cairo / Giza 250 EGP; other Egyptian governorates 450 EGP. No universal free-shipping promotion.
- PAN10: 10% of the exact product subtotal, excluding delivery.
- VAT-inclusive pricing, one-year manufacturing warranty and 7–15 business-day delivery are expressly qualified presentation policies, not verified live commercial commitments.
- Quantity cap: 20 per variant is a presentation control, not a stock claim.
- SLA: deadline exactly 14 × 24 hours after order creation. At risk starts when 3 days or fewer remain, including the deadline; late begins strictly after it.
- Late penalty: 10% of the fictional supplier line cost after 4 full overdue days; financial eligibility starts at delivery. The delivery timestamp freezes the penalty. Fully returned lines reverse their cost and waive the demo penalty, maintaining `gross − returns − penalty = net`.
- Customer selling prices are never used as supplier costs. Initial operational costs and roles are clearly fictional. Newly checked-out lines start with unspecified supplier cost (0); the presenter can set a fictional line-total cost in admin details. Quantities and selected SKUs remain attached to each line.
- Weekly payable grouping uses delivery timestamps; date filters use order creation dates on the Cairo calendar. Payouts are pending simulations; no transfer is made.

## Local data and security boundaries

All cart, wishlist, demo catalog overrides, orders, fictional operational records and logs are stored under `ph-` browser storage keys. Checkout name/address/notes are discarded. The account demonstration does not ask for a password. Contact information is not retained or transmitted. Roles and phone verification illustrate UX, **not secure access control**; all demonstration records are browser-local and inspectable. Never enter real confidential supplier or customer records.

Production activation requires a real backend, authenticated roles, server-side validation, secure fulfillment integrations, approved policies, authoritative catalog/inventory, and configured payment services. Those live services are intentionally outside the presentation scope.

## Validation

Meaningful unit tests cover exact cart mathematics, shipping rules, SLA boundary instants, four-full-day penalties, fixed delivery timestamps, return arithmetic and proof requirements. Browser tests cover discovery, sorting/filtering, variant continuity, persistence, validated checkout, verification, item routing, seller privacy, proof gating, returns, CSV download, presentation controls, catalog overrides, image fallbacks, and document overflow across 1920 / 1440 / 1024 / 768 / 390 / 360 widths.

The browser suite blocks the external product CDN so successful local image tests demonstrate independence from that host. This does not validate a real payment, delivery, user authentication or supplier service. Generated screenshots and Playwright reports are ignored artifacts, not the deliverable itself.
