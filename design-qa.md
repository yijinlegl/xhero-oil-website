# Xhero Website Design QA

## Scope

- Reference: `https://www.goldwind.com/cn/equipment/`
- Local preview: `http://127.0.0.1:4173/?preview=20260711-goldwind-final`
- Pages: home, products, industries, about, contact, and 404
- Viewports: desktop `1440 x 1000`; mobile `390 x 844`

## Reference And Comparison Evidence

- Desktop top comparison: `../output/design-capture/qa-compare-desktop-top.png`
- Desktop scrolled-hero comparison: `../output/design-capture/qa-compare-desktop-scroll.png`
- Mobile top comparison: `../output/design-capture/qa-compare-mobile-top.png`
- Mobile navigation comparison: `../output/design-capture/qa-compare-mobile-menu.png`

The comparisons confirm the intended design language: full-viewport industrial imagery, restrained dark overlays, centered display type, transparent navigation over the hero, a white scrolled header, a right-side mobile navigation drawer, dark editorial transition bands, and large image-led content sections.

Intentional differences are limited to Xhero branding, industrial-lubrication content and imagery, the Xhero route structure, and a shorter navigation set. No Goldwind text, marks, links, or assets are included in the implementation.

## Functional Verification

- Global desktop and mobile navigation: passed
- Mobile drawer open, close, overlay, and scroll lock: passed
- Product category filters and URL state: passed
- Product search and one-result layout: passed
- Product detail dialog open and close: passed
- Contact product preselection (`Duramult`): passed
- Internal routes and custom 404 response: passed

## Responsive And Runtime Verification

At both target viewports, all five primary pages reported:

- horizontal overflow: `0`
- broken images: `0`
- unrevealed content blocks after traversal: `0`
- console and page errors: `0`

Desktop page heights were 10,742 px (home), 4,635 px (products), 4,176 px (industries), 2,784 px (about), and 2,321 px (contact). Mobile layouts were independently exercised at 390 px width. Product filtering returned exactly one visible metalworking-fluid result in both viewports.

## Iterations Resolved

- Reworked the home hero message into a static `希罗润滑 / 让工业运转更可靠` lockup using one shared, reduced font scale and a clearer background-coordinated steel silver-gray on desktop and mobile.
- Replaced the soft full-width manufacturing image with a locally hosted 3000 x 2000 industrial-robot production-line photograph and rebalanced the overlay for sharper equipment detail.
- Reframed the industrial-robot production-line image as the third image-plus-side-copy feature section to match the preceding transmission and manufacturing sections.
- Consolidated industrial gear oil into the equipment-oil taxonomy across filters, product cards, footer links, and home-page product architecture.
- Corrected inherited header positioning and retained the scroll-hide transition.
- Corrected subpage hero overlay selectors and color hierarchy.
- Added a reveal fallback for fast scrolling and legacy reveal classes.
- Corrected the industry grid against previous 12-column span rules.
- Expanded a single filtered product result to a deliberate full-width layout.
- Confirmed the humanoid-robot image is distinct from precision machining.

## Findings

- P0 blockers: none
- P1 functional or responsive issues: none
- P2 visible design mismatches requiring correction: none

The updated hero, three feature sections, and product taxonomy were rechecked at `1440 x 1000` and `390 x 844`: no horizontal overflow, broken images, or console errors were detected. The equipment-oil filter returns four products: industrial gear oil, hydraulic oil, slideway oil, and spindle oil.

final result: passed
