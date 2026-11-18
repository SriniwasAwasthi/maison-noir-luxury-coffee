# 🛡️ Release Engineering Push Audit & Manifest

**Audit Date:** 2026-11-18  
**Repository:** `https://github.com/SriniwasAwasthi/maison-noir-luxury-coffee.git`  
**Branch:** `main`  
**Audit Status:** ✅ **PASSED (100% Secure · 0 Secrets · 0 Personal Data)**  

---

## 1. Secret Scanning Report

| Target | Tool / Command Used | Pattern Signatures Scanned | Result | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Working Tree (All 117+ Tracked Files)** | Custom AST & Regex Scanner (`scan_secrets.py`) | `AIza[0-9A-Za-z_-]{35}`, `sk-[A-Za-z0-9]{20,}`, `ghp_[A-Za-z0-9]{36}`, `Bearer `, `api_key`, `secret`, `password` | **0 Secrets Found** | All credentials are env-var dynamic |
| **Git Commit History (`git log -p`)** | `git log -p` + Regex Filter Engine | All regex patterns across every diff commit | **0 Secrets Found** | History is completely clean; no rebase/scrubbing needed |
| **Environment Configs** | Manual Audit of `.env.example` | Placeholder keys only | **Clean** | No live production credentials present |

---

## 2. File Classification Matrix (KEEP vs. EXCLUDE)

### A. KEEP (Committed & Tracked in Repository)
- **Application Source Code**:
  - `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/App.css`
  - `src/context/ShopContext.tsx` (Global multi-currency, cart state & audio management)
  - `src/components/AudioBar.tsx`, `src/components/Gramophone.tsx`
  - `src/components/Hero.tsx`, `src/components/Story.tsx`, `src/components/RoasterTelemetry.tsx`
  - `src/components/Menu.tsx`, `src/components/Experience.tsx`, `src/components/Gallery.tsx`
  - `src/components/Reservation.tsx`, `src/components/Reviews.tsx`, `src/components/Visit.tsx`
  - `src/components/CartDrawer.tsx`, `src/components/ItemDetailModal.tsx`, `src/components/CoffeeSommelierModal.tsx`
  - `src/utils/audio.ts` (Zero-echo procedural Web Audio API engine)
  - `src/utils/invitationPdf.ts` (jsPDF gold-bordered VIP invitation generator)
- **API & Serverless Middleware**:
  - `api/db-client.js`, `api/db-wake.js`, `api/menu-items.js`, `api/mock-data.js`, `api/newsletter.js`, `api/reservations.js`, `api/reviews.js`
- **Configuration & Build Manifests**:
  - `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `vercel.json`
- **Documentation & User Assets**:
  - `README.md`, `LICENSE`, `.gitignore`, `.env.example`, `CHANGELOG.md`
  - `docs/ASSUMPTIONS.md`, `docs/PUSH_AUDIT.md`
  - `docs/screenshots/*` (9 section screenshots for UI tour)
  - `Images/*` (7 original native-resolution screenshot captures)
  - `public/audio/*` (Optimized 320 kbps MP3 soundscapes)
  - `public/images/*` (Culinary gastronomy catalog photography)
  - `public/videos/hero.mp4` (Lightweight 4.7 MB cinematic video loop)
- **Automation & Startup Scripts**:
  - `scripts/setup_windows.ps1` (One-click automated environment setup)
  - `run.bat` & `run.ps1` (One-click development server launcher)

---

### B. EXCLUDE (Strictly Ignored via `.gitignore`)

| File / Folder Pattern | Reason for Exclusion |
| :--- | :--- |
| `.env`, `*.env.local` | Security: Local environment variables containing personal keys or overrides. |
| `node_modules/` | Build Dependency: External package binaries (reconstructed via `npm install`). |
| `dist/`, `dist-ssr/` | Build Artifacts: Minified output bundles generated automatically by `npm run build`. |
| `Maison_Noir.mp4` (~93 MB) | Size Limit: Raw screen recording exceeding Git standard thresholds. |
| `Maison_Noir_Luxury_Overview.mp4` (~71 MB) | Size Limit: Intermediate video render exceeding Git standard thresholds. |
| `Maison_Noir_Walkthrough_With_VoiceAgent.mp4` (~92 MB) | Size Limit: Master video walkthrough exceeding Git standard thresholds. |
| `Maison_Noir_Vintage_Vinyl_Jazz.wav` (~26 MB) | File Size: Uncompressed audio master (served via 320k MP3 equivalent). |
| `media/*.wav`, `media/*.mp4` | Intermediate clips: Render fragments used during offline composite rendering. |
| `voice_segments/` | Intermediate TTS cache generated during speech synthesis. |
| `render_*.py`, `build_*.py` | Local compilation utilities not required for runtime application execution. |
| `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db` | System & Editor Junk: Machine-specific metadata. |

---

## 3. Pre-Push Verification Checklist

- [x] Full TypeScript compiler check (`tsc -b`) passed with 0 errors.
- [x] Production build (`npm run build`) succeeded in under 35 seconds.
- [x] Zero API keys or private tokens detected in code or Git commit history.
- [x] All 7 user screenshots in `Images/` tracked and committed.
- [x] All documentation links in `README.md` verified without broken paths.
- [x] One-click Windows setup (`scripts/setup_windows.ps1`) and run scripts (`run.bat`) verified.
- [x] Remote synchronization with `origin/main` verified clean.
