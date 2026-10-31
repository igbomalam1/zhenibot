# Zhen Automation

**Autonomous Business Operations Engine & AI Workflows**

Zhen Automation turns everyday business operations into self-driving workflows. Built for high-growth businesses, e-commerce brands, logistics fleets, and busy operational teams, Zhen Automation connects your communication channels, dispatch fleets, and financial rails to automate:

- ✉️ **Autonomous Email Concierge & Smart Auto-Responder**: Inbound triage, entity/RFQ extraction from attachments, instant context-aware replies sent in under 2 seconds.
- 🛵 **On-Demand Delivery & Okada Booking**: Instant dispatch to closest available bike riders (SendMe, GIGL, Bolt, internal fleet), route distance calculation, and live WhatsApp tracking links sent to customers.
- 💬 **24/7 AI Customer Care Representative**: Multilingual conversational support (English, Nigerian Pidgin, French, Hausa, Yoruba, Spanish) across WhatsApp Business, Web Chat, and Instagram DMs resolving 88%+ of tickets autonomously.
- 🧾 **Autonomous Invoicing & Payment Reconciliation**: Instant branded PDF invoices upon closed deals, Paystack/Stripe/bank webhook sync, and ledger reconciliation.
- ⚡ **Visual Workflow Studio & 150+ Native Integrations**: Gmail, Outlook, WhatsApp, Shopify, WooCommerce, Slack, Paystack, Stripe, HubSpot, Google Sheets, and custom webhooks.
- 🎁 **20% Recurring Agency & Partner Program**: Generous recurring monthly commissions for consultants and agencies onboarding client businesses.

---

## Tech Stack

- **React 19 + TypeScript + Vite 8**
- **Tailwind CSS v4** (Deep tech slate obsidian `#090d16`, electric violet/indigo `#6366f1`, hyper-cyan `#06b6d4`, autonomous emerald `#10b981`)
- **Lucide React** icons
- **Recharts** (automation throughput & operations analytics charts)
- **Supabase** — Auth, PostgreSQL (RLS), Edge Functions
- **Resend** — transactional enterprise email notifications

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page (Hero with interactive live workflow simulator, 4 core engines, 150+ integrations, interactive ROI calculator, pricing tiers, FAQ) |
| `/auth?mode=register&ref=CODE` | Split-screen enterprise authentication with partner code auto-population |
| `/dashboard` | Operations Command Center — real-time automation switcher, live execution telemetry stream, 30-day throughput chart, quick test runs |
| `/dashboard/deposit` | Automation Fuel & Compute Credits — quota provisioning, task capacity estimator, and multi-network settlement |
| `/dashboard/withdraw` | Dispatch & Fleet Settings — on-demand courier configuration (SendMe, GIGL, Bolt), auto-dispatch rules, and agency revenue payouts |
| `/dashboard/referrals` | Agency & Partner Program — 20% recurring monthly payout tracking, client roster, and shareable QR code |
| `/dashboard/history` | Execution Logs & Audit Trail — immutable record of all automated tasks, latencies, and transactions |
| `/admin` | Enterprise Control Panel — cluster management, business accounts, and multi-agent operations |

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build (tsc -b && vite build)
npm run lint
```

---

© 2026 Zhen Automation Inc. All rights reserved.
