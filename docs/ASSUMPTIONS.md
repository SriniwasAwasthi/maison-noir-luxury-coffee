# 📋 Release Engineering Assumptions & Audit Baseline

**Document Version:** 1.0.0  
**Timestamp:** 2026-11-18  
**Release Engineer:** Senior Release Engineer & Technical Writer  
**Repository Target:** `SriniwasAwasthi/maison-noir-luxury-coffee`  

---

## 1. Context & Workspace Alignment

1. **Target Project Identity**:
   - The active workspace directory is `e:\W c One Drive\Projects\maison-noir-luxury-coffee-main`.
   - The user provided a standardized production-grade release prompt. In adherence to the prompt rule (*"Do not ask me questions. Make the safest assumption, record it in docs/ASSUMPTIONS.md, and continue"*), all release engineering protocols (Phase 0 through Phase 5) are executed on the active production workspace: **Maison Noir — Luxury Café & Single-Origin Roastery**.

2. **Git Remote & Author Identity**:
   - Global Git user is configured as `SriniwasAwasthi <sriawasthi164@gmail.com>`.
   - The upstream remote is configured and verified as `origin https://github.com/SriniwasAwasthi/maison-noir-luxury-coffee.git`.
   - The default production branch is `main`.

---

## 2. Secrets & Security Isolation

1. **Zero Committed Credentials**:
   - API keys, service role tokens, and secret strings are strictly excluded from git tracking.
   - All backend client initializations (`api/db-client.js`) read dynamically from environment variables (`process.env.VITE_SUPABASE_URL`, `process.env.SUPABASE_SERVICE_ROLE_KEY`).
   - If no external database credentials exist, the application automatically activates its bundled in-memory gastronomy catalog and reservation store without crashing or warning.
   - A sanitized `.env.example` is committed with zero actual secrets.

2. **Secret Scan Verification**:
   - Both the working tree and the entire Git history (`git log -p`) were scanned using regex patterns covering Google API keys (`AIza...`), OpenAI keys (`sk-...`), GitHub tokens (`ghp_...`), Bearer tokens, and high-entropy key-value pairs.
   - Result: **Zero secrets detected**.

---

## 3. Media & File Size Management (The 100MB GitHub Boundary)

1. **Heavy Video & Uncompressed Audio Isolation**:
   - Raw screen capture video files (`Maison_Noir.mp4`, `Maison_Noir_Luxury_Overview.mp4`, `Maison_Noir_Walkthrough_With_VoiceAgent.mp4` ranging from 71 MB to 93 MB) and raw WAV files (`Maison_Noir_Vintage_Vinyl_Jazz.wav`) are excluded in `.gitignore` to prevent GitHub push rejections or Git repository bloat.
   - The optimized lightweight hero loop video (`public/videos/hero.mp4` ~4.7 MB) is explicitly tracked and preserved.
   - The broadcast-quality 320 kbps MP3 soundscapes (`Maison_Noir_Vintage_Vinyl_Jazz.mp3` ~6 MB, `Maison_Noir_Voice_Agent_Narration.mp3` ~2.9 MB) are tracked.

2. **UI Showcase Screenshots**:
   - The 7 high-resolution user screenshots in `Images/` (`Screenshot 2026-11-16 175341.png` through `Screenshot 2026-11-16 175506.png`) are tracked in `Images/` and mapped into `docs/screenshots/` to power the visual tour in `README.md`.

---

## 4. "ZIP Download = Same Experience" Guarantee

1. **Self-Contained Bootstrap**:
   - Any guest, reviewer, or developer downloading the GitHub repository as a ZIP archive can run `scripts/setup_windows.ps1` (or `npm install`) followed by `run.bat` (or `npm run dev`) to experience the exact same luxury audio, live roaster telemetry, tasting tray, and table reservation PDF generation.
   - An automated smoke test and production build (`npm run build`) is executed prior to release.
