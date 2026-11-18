# 📜 Changelog

All notable changes to the **Maison Noir — Luxury Café & Single-Origin Roastery** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-11-18

### Added
- **7 Native-Resolution UI Showcase Captures**: Placed in `Images/` and mapped to `docs/screenshots/` for the complete visual walk-through.
- **VIP Invitation PDF Pass**: Integrated `jspdf` in `src/utils/invitationPdf.ts` to generate formal, gold-bordered A5 reservation certificates directly in the browser.
- **Roastery Telemetry 3-Tab Suite**: Added interactive switching between *Roast Dials* (live Probat sensor telemetry), *Bean Atlas* (micro-lot details), and *Roast Curve* (Rate-of-Rise SVG chart).
- **Verified Reviews System**: Added 12 verified culinary critiques with 5-star and 4-star filter pills and real-time average calculation.
- **Windows Bootstrap & Launcher**: Added `scripts/setup_windows.ps1`, `run.bat`, and `run.ps1` for instantaneous zero-friction startup from a downloaded ZIP.
- **Safety & Push Audits**: Added `docs/ASSUMPTIONS.md` and `docs/PUSH_AUDIT.md`.

### Changed
- **Zero-Echo Procedural Audio**: Completely re-engineered `src/utils/audio.ts` with 3 tranquil modes (*Vintage Vinyl Jazz*, *Roastery Slow Bar*, *Rain on Stained Glass*) using 3.2s equal-power crossfades, pure sine waves, and low-pass conditioning.
- **Tactile Silent Add-to-Tray**: Updated `ShopContext.tsx` and `Menu.tsx` so clicking `+ ADD TO TRAY` adds selections directly with gold checkmark feedback without opening the slide-over cart drawer.
- **System Architecture**: Updated Mermaid diagram in `README.md` to reflect the complete client layer, procedural audio core, serverless API gateway, and document generation pipeline.

### Fixed
- Fixed cart drawer popping open unintentionally on every menu click.
- Fixed salad photo display in affogato menu item by curating authentic Michelin-grade coffee imagery.
- Fixed Vite watcher `EBUSY` file locking conflict on Windows during video rendering by configuring `watch.ignored` in `vite.config.ts`.

---

## [1.1.0] - 2026-11-16

### Added
- Multi-currency conversion engine supporting INR (₹), USD ($), EUR (€), GBP (£), and AED (د.إ).
- Interactive Coffee Sommelier questionnaire with 5-axis cupping radar meters.
- Slide-over Tasting Tray cart drawer with dine-in table assignment and gratuity tiers.

---

## [1.0.0] - 2026-11-15

### Added
- Initial production release of Maison Noir luxury coffeehouse platform.
- React 19, Vite 7, TypeScript, and Tailwind CSS v4 foundation.
- Fullscreen photo gallery with category filtering and interactive lightbox.
- Contact concierge, location maps, and VIP Inner Circle subscription.
