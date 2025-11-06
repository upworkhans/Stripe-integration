## Stripe Integration Roadmap

Use these checklists to track implementation. Update the status boxes as we ship items.

### 1) Core Payments
- [x] Card Element one-time payment (manual confirm)
- [x] Payment Element (unified methods)
- [x] Checkout Sessions (one-time + subscription)
- [ ] Partial payments / deposits (split or top-up flows)

Notes:
- Partial payments options:
  - [ ] Create multiple PaymentIntents to collect deposit + remaining balance
  - [ ] Use `amount_capturable` with manual capture (Card present in some cases) for staged capture
  - [ ] Use Invoices with partial amounts and incremental payments

### 2) Bank Accounts & Transfers
- [ ] ACH Debit (US bank accounts)
- [ ] SEPA Direct Debit (EU)
- [ ] Bacs (UK) / BECS (AU)
- [ ] Bank Transfers with Customer Balance (virtual accounts)

Notes:
- ACH/SEPA/Bacs require mandates; often use SetupIntent first. Handle micro-deposits/mandate events via webhooks.

### 3) Wallets
- [x] Apple Pay / Google Pay via Payment Request Button (PRB)
- [ ] Link (one-click checkout)

### 4) BNPL & Redirect Methods
- [ ] Klarna
- [ ] Afterpay/Clearpay
- [ ] iDEAL (NL)
- [ ] Bancontact (BE)
- [ ] EPS (AT), giropay (DE), FPX (MY), PayNow (SG)

### 5) Saved Methods & Mandates
- [x] SetupIntent to save card (Payment Element)
- [ ] SetupIntent to save bank account (ACH/SEPA)
- [ ] Reuse saved method for off-session payments

### 6) Subscriptions & Billing
- [x] Basic subscriptions (default_incomplete) with Payment Element/Checkout
- [ ] Subscriptions with trial periods
- [ ] Proration previews and scheduled changes
- [ ] Metered billing and usage records
- [ ] Invoices and hosted Invoice links
- [x] Billing Portal session

Notes:
- Trials: set `trial_period_days` in Subscription or use Trial in Price; ensure collection on trial end.

### 7) Webhooks & Operational Flows
- [x] Webhook endpoint skeleton (signature verification)
- [ ] Handle `payment_intent.succeeded/processing/payment_failed`
- [ ] Handle `setup_intent.succeeded`
- [ ] Handle bank transfer reconciliation events (cash_balance)
- [ ] Disputes simulation (`charge.dispute.created`) and evidence upload

### 8) Connect (Marketplaces)
- [x] Create connected accounts (Express)
- [x] Create transfers
- [ ] Account onboarding via Account Links + dashboard return
- [ ] Application fees and destination charges
- [ ] Instant Payouts (where supported)

### 9) Fraud & Risk (Radar)
- [ ] Add Radar rules examples (allowlist/blocklist, SCA exemptions)
- [ ] Display risk insights (redacted) in demo logs

### 10) Tax & Currency
- [ ] Stripe Tax automatic calculation in Checkout/Elements
- [ ] Multi-currency PaymentIntents with currency select

### 11) Optimization & UX
- [x] Homepage hero + categorized navigation
- [x] Test card guidance on payment pages
- [x] Redaction of secrets in UI responses/logs
- [x] Server-side throttling (10 min gap, max 6/hour across endpoints)
- [ ] Domain verification for Apple Pay (prod)

### 12) Developer Utilities
- [x] Typed routes fixes and stable build
- [ ] Feature flags to toggle payment methods in UI
- [ ] Per-method test data panel

---

## Implementation Order (suggested)
1. Subscriptions with trials
2. Partial payment flows (deposit + balance)
3. ACH Debit (US) via Payment Element (bank account)
4. Bank Transfers (customer balance)
5. BNPL/Redirect methods (Klarna, iDEAL, etc.)
6. Webhook event handling (success/failure/mandates)
7. Connect onboarding (Account Links) + fees
8. Stripe Tax + multi-currency selector
9. Radar examples and dispute simulation

---

## Useful Docs
- Payments overview: https://stripe.com/docs/payments#payment-methods
- Payment Element: https://stripe.com/docs/payments/payment-element
- ACH (US bank): https://stripe.com/docs/ach
- Bank Transfers: https://stripe.com/docs/payments/bank-transfers
- SEPA Direct Debit: https://stripe.com/docs/payments/sepa-debit
- Klarna: https://stripe.com/docs/payments/klarna
- Apple Pay: https://stripe.com/docs/apple-pay
- Subscriptions + trials: https://stripe.com/docs/billing/subscriptions/trials
- Webhooks: https://stripe.com/docs/webhooks

