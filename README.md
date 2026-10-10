# Zhenbot

**Automated Multi-Asset Trading. Consistent Daily Growth.**

Zhenbot is a modern fintech / algorithmic trading investment platform — a landing page, authentication, and a full investor dashboard — with a Supabase backend that automates **1.2% daily dividends**, **2-tier referral commissions (15% / 5%)**, deposit confirmations, and email notifications (via Resend).

## Tech Stack

- **React 19 + TypeScript + Vite 8**
- **Tailwind CSS v4** (dark navy / electric cyan design system)
- **Lucide React** icons
- **Recharts** (fund performance charts)
- **Supabase** — Auth, PostgreSQL (RLS), Edge Functions
- **Resend** — transactional email (deposit confirmations, withdrawal 2FA)

## Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page (hero, trust badges, how-it-works, affiliate teaser, profit calculator, FAQ, legal risk disclosure) |
| `/auth?mode=register&ref=CODE` | Split-screen auth with referral-code auto-population |
| `/dashboard` | Overview — stats, bot tracker, trade feed, equity chart, quick actions |
| `/dashboard/deposit` | Multi-network deposit (USDT TRC20/ERC20/BEP20, BTC) with QR + TxID submission |
| `/dashboard/withdraw` | Balance display, $10 minimum, email-code verification (2FA) |
| `/dashboard/referrals` | Referral link/QR, 2-tier matrix, live downline table |
| `/dashboard/history` | Filterable transaction ledger |

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run lint
```

## Environment Variables

Copy `.env.example` → `.env` and fill in values. The Supabase project is already wired up (project ref `cxbevwccenradkjxoooh`).

The client bundle only ever sees `VITE_*/NEXT_PUBLIC_*`. **Never prefix** `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` — they are used only by Edge Functions.

## Database (already applied)

Schema lives in `supabase/migrations/20260101000000_init.sql`. Tables:

- `zhenbot_users` — profile, wallet_balance, active_deposit, total_earned, total_withdrawn, referral_code, referrer_id
- `zhenbot_transactions` — unified ledger (deposit / withdrawal / dividend / referral_bonus)
- `zhenbot_referrals` — 2-tier relationships + accumulated commission
- `zhenbot_verification_codes` — withdrawal 2FA one-time codes (service role only)
- `zhenbot_deposit_networks` — vault deposit addresses

Key DB functions (security-definer, service-role only):

- `zhenbot_handle_new_user()` — trigger on `auth.users` → profile + `ZBTR-XXXX` code + referrer link
- `zhenbot_on_deposit_completed()` — trigger → credits `active_deposit`
- `zhenbot_distribute_referral()` — 15% tier-1 / 5% tier-2, real time
- `zhenbot_approve_withdrawal(uuid)` — validates balance, debits wallet
- `zhenbot_credit_daily_dividends()` — 1.2% of every active deposit

The migration was applied directly to the live project.

## Edge Functions

```bash
# 1. Login to Supabase
supabase login

# 2. Link the project
supabase link --project-ref cxbevwccenradkjxoooh

# 3. Set secrets
supabase secrets set --env-file ./supabase/.env.production

# 4. Deploy
supabase functions deploy send-deposit-notification --no-verify-jwt
supabase functions deploy send-withdrawal-verification --no-verify-jwt
supabase functions deploy confirm-withdrawal --no-verify-jwt
supabase functions deploy process-deposit --no-verify-jwt
supabase functions deploy process-daily-dividends --no-verify-jwt
```

`supabase/.env.production` should contain:
```
RESEND_API_KEY=re_...
VITE_FROM_EMAIL=Zhenbot <notifications@zhenbot.io>
VITE_ADMIN_EMAIL=admin@yourdomain.com
PROCESS_DEPOSIT_ADMIN_TOKEN=<random-string>
```

> **Resend:** verify your sending domain/email in the Resend dashboard before emails will deliver.

### Daily dividend cron

Call `process-daily-dividends` every day at **00:00 UTC** — configure the Supabase Edge Schedule in the dashboard (or any cron) with the function URL and a service-role `Authorization: Bearer <service_role_key>` header.

### Referral attribution webhook

When a deposit is confirmed on-chain, `POST` to `process-deposit`:

```json
{ "deposit_id": "<zhenbot_transactions.id>", "admin_token": "<optional if env set>" }
```

The deposit trigger then credits `active_deposit` and pays 15% → referrer and 5% → grandparent automatically.

## Tested End-to-End

The following were verified against the live database:

1. Signup trigger generates `ZBTR-XXXX` code + profile.
2. Registrations using a referral code are attributed to the referrer.
3. Deposit → `active_deposit` credited, 15% tier-1 commission paid instantly with ledger rows.
4. `zhenbot_credit_daily_dividends()` credits 1.2% daily.
5. `zhenbot_approve_withdrawal()` validates balance and debits wallet.

## Security Notes

- All tables have **RLS enabled**; users can only read/write their own rows (plus downline visibility for the referral network).
- Withdrawal 2FA codes are **service-role only** and expire in 15 minutes.
- Wallet addresses are display placeholders — replace them with your own vault addresses (in `src/lib/constants.ts` and the `zhenbot_deposit_networks` seed).

## Deploy the frontend

```bash
vercel deploy --prod
```

SPA rewrites are included in `vercel.json`. Need to configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_REFERRAL_BASE_URL` on your host.

---

**Risk disclaimer:** This is a demo/investment product template. Trading strategies carry risk; the "daily dividend" is a projected target, not a guarantee. Only invest what you can afford to lose.