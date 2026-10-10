# DIRECTION.md — Zhenbot Redesign

## 1. The Brief

- **Product:** Zhenbot — Automated Multi-Asset Quantitative Trading Fund & Investor Platform.
- **Audience:** Global crypto & algorithmic investors looking for consistent daily dividends (1.2%/day) without emotional trading or speculative drawdowns.
- **The One Job:** 
  - *Public Landing:* Instill unwavering institutional confidence within 8 seconds by demonstrating disciplined quantitative execution, verified 5% risk stops, real exchange connectivity, and transparent daily yields.
  - *Investor App:* Provide a calm, precise, terminal-grade dashboard to monitor daily yield crediting, manage segregated deposits/withdrawals, and track referral downline earnings.
- **Tone & Feel:** Institutional, mathematical, calm, surgically precise. Like an elite quantitative trading desk terminal (Jane Street meets Swiss private horology), not a meme crypto pump-and-dump.
- **Category Cliché Refused:** 
  - *The 2023 Launch Page Slop:* Murky dark-navy backgrounds with massive blurry purple/cyan radial glow orbs, generic Inter font with gradient text, generic pill badges, and template cards.
  - *The Toy Crypto Slop:* Neon lasers, rocket emojis, fake countdown timers, and tacky gradients.

---

## 2. The Concept

> **"Zhenbot is a Swiss Precision High-Frequency Chronometer / Algorithmic Execution Instrument."**

- **Source Family:** Precision Instruments & Mechanical Horology (high-frequency oscillators, aerospace telemetry, laboratory grade chronometers).
- **Ground:** Deep Obsidian & Tungsten Slate (`#08090E`, `#0D0F18`, `#131722`) with architectural micro-dividers and crisp hairlines.
- **Type:** Architectural Display Grotesk (`Space Grotesk` / `Plus Jakarta Sans`) paired with monospace tabular figures (`JetBrains Mono` / `SF Mono` with `tabular-nums font-variant-numeric`).
- **Accent:** 
  - **Phosphor Jade** (`#00E599` / `#05D184`): Realized daily profits, active engine status, positive alpha.
  - **Laser Amber** (`#F59E0B`): Tier-2 downlines, pending operations.
  - **Subtle Ice Cobalt** (`#38BDF8` / `#60A5FA`): Institutional exchange routing & API telemetry.
- **Richness Source:** Real-time canvas mathematical liquidity sweeps, micro-radar execution visuals, tabular ledger grids, fine coordinate markers (`LATENCY // 12MS`, `STOP // 5.0%`).
- **The Signature Moment:** 
  - An interactive **High-Frequency Sweep Matrix** in the Hero: lightweight 2D canvas simulating algorithmic order-book sweeps across Bybit, Binance, Bitget, and MEXC, responding with subtle micro-parallax to cursor movements, and pausing cleanly when out of viewport.

---

## 3. Design Tokens

### Color Palette
- Ground Base: `#08090E`
- Ground Surface 1 (Cards & panels): `#0D0F17`
- Ground Surface 2 (Sub-panels & inputs): `#121522`
- Ground Surface Hover: `#181C2B`
- Hairline Border: `rgba(255, 255, 255, 0.07)`
- Hairline Highlight: `rgba(255, 255, 255, 0.14)`
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`
- Text Muted: `#64748B`
- Accent Profit (Emerald Phosphor): `#00E599` / text `#10B981`
- Accent Alert (Laser Amber): `#F59E0B`
- Accent Risk (Signal Red): `#EF4444`
- Accent Telemetry (Ice Blue): `#38BDF8`

### Typography
- Headings & Display: `'Space Grotesk', system-ui, sans-serif`
- UI & Body: `'Plus Jakarta Sans', system-ui, sans-serif`
- Technical & Data: `'JetBrains Mono', ui-monospace, monospace` (all with `font-variant-numeric: tabular-nums`)

### Radii & Spacing
- Surface Corner Radius: `16px` (outer cards), `10px` (inner controls), `8px` (badges & buttons).
- Spacing Scale: Strict 4px/8px modular rhythm with breathable whitespace.

---

## 4. Preservation Guarantee
- 100% of routes (`/`, `/auth`, `/dashboard`, `/dashboard/deposit`, `/dashboard/withdraw`, `/dashboard/referrals`, `/dashboard/history`) preserved.
- 100% of Supabase Auth, database queries, edge function triggers, form handlers, QR code generators, calculations, and 2FA flows remain functional and intact.
