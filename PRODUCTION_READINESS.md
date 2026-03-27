# USVI Explorer Production Readiness Plan

This checklist turns the current prototype into a production-grade product.

## Current baseline

The app is currently a frontend-first Vite React application with mocked/derived operational data and client-side integrations for AI and payments.

## P0 — Must complete before production launch

### 1) Move AI calls to a backend API
- Build a server endpoint (`POST /api/v1/tour-guide/chat`) that performs all OpenAI requests server-side.
- Remove direct OpenAI SDK usage from browser code.
- Use request validation, per-session/IP rate limits, timeout/retry strategy, and structured logs with request IDs.
- Add basic abuse prevention and prompt/content moderation.

### 2) Build a real Stripe backend flow
- Implement `POST /api/v1/payments/create-intent` and server-side webhook handling (`/api/v1/payments/webhook`).
- Keep only one publishable key convention and one checkout path.
- Persist payment intent lifecycle state in durable storage.
- Add idempotency keys and webhook signature verification.

### 3) Introduce auth + authorization
- Add identity (e.g., Firebase Auth/Auth0/Clerk/custom JWT) for rider, driver, and admin personas.
- Protect `/admin` and `/driver` routes with role-based access controls.
- Enforce backend authorization checks (not only UI route guards).

### 4) Replace demo/static operations data with APIs
- Replace hard-coded metrics, queue entries, demand status, and mock driver profiles with backend data.
- Define API contracts for operations dashboards, ride requests, driver state, and alerts.
- Add database schema for users, drivers, trips, payments, and incidents.

### 5) Production-grade config + secrets management
- Standardize environment variables (`VITE_` client-safe only, non-`VITE_` server secret only).
- Store secrets in CI/CD + cloud secret manager.
- Add startup config validation and fail-fast checks.

## P1 — Launch hardening (high priority)

### 6) Reliability and observability
- Add centralized logging, metrics dashboards, and error tracking.
- Track SLOs: API error rate, p95 latency, checkout success rate, and ride request completion.
- Implement health checks, synthetic checks, and on-call alerting.

### 7) Testing and quality gates
- Expand automated tests:
  - Unit tests for core business logic.
  - Integration tests for APIs (AI proxy, payment intent, webhooks).
  - End-to-end tests for explore → chat → checkout flows.
- Add CI gates for test pass, lint/typecheck, and build-size budgets.

### 8) Accessibility and UX compliance
- Add automated accessibility checks (axe/Lighthouse) to CI.
- Complete keyboard navigation and screen-reader labels for key flows.
- Add clear loading, empty, and error states across all key screens.

### 9) Performance and delivery
- Enforce route-level code splitting (already partly present) and set chunk-size budgets.
- Add caching/CDN strategy, compression, and cache-control headers.
- Monitor Web Vitals in production and set thresholds.

### 10) Security baseline
- Add CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- Add dependency vulnerability scanning and regular updates.
- Add rate limiting, input sanitization, and audit trails for admin operations.

## P2 — Product completeness and scale

### 11) Data/content operations
- Add CMS/admin workflow for places and content revisions.
- Add approval flow and version history for content changes.

### 12) Analytics and experimentation
- Define event taxonomy for user journeys.
- Add analytics ingestion endpoint and dashboards.
- Run experiments on onboarding, route planning, and donation conversion.

### 13) Geospatial and dispatch intelligence
- Introduce geospatial storage and nearby search.
- Add route estimation APIs with traffic/ferry awareness.
- Improve matching logic for driver/rider balancing.

## Suggested release milestones

### Milestone A (2–3 weeks)
- AI backend proxy live.
- Stripe PaymentIntent + webhook flow live.
- Secrets removed from client.

### Milestone B (3–6 weeks)
- Auth + RBAC in place.
- Core ride/admin data from backend.
- Observability + CI quality gates enabled.

### Milestone C (6–10 weeks)
- Full launch readiness: reliability targets, accessibility checks, security headers, and runbooks.

## Exit criteria for "production-ready"

- No secret-bearing integrations executed in browser code.
- Payments are webhook-confirmed and auditable.
- AuthN/AuthZ enforced for admin/driver capabilities.
- Critical user journeys are covered by automated end-to-end tests.
- Monitoring, alerting, incident process, and rollback procedure are documented and exercised.
- Accessibility/security/performance checks are part of CI and release gates.
