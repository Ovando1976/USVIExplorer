# USVI Explorer — Ranked Implementation Backlog

This backlog turns the prior improvement recommendations into an execution-ready plan with concrete epics, API contracts, and data schema.

---

## Ranked backlog at a glance

| Priority | Epic | Target Sprint | Dependencies | Primary API(s) | Primary Schema Table(s) |
|---|---|---|---|---|---|
| P0 | P0.1 Secure AI Tour Guide Backend Proxy | Sprint 1 | None | `POST /api/v1/tour-guide/chat` | `ai_chat_session`, `ai_chat_message` |
| P0 | P0.2 Consolidate Payments to PaymentIntent | Sprint 2 | P0.1 logging standards | `POST /api/v1/payments/create-intent`, `POST /api/v1/payments/webhook` | `payment_intent`, `payment_event` |
| P1 | P1.1 Shared Place Content Model | Sprint 3 | None | `GET /api/v1/places` | `place` |
| P1 | P1.2 Route-level Code Splitting | Sprint 3 | P1.1 optional | N/A (frontend perf) | N/A |
| P1 | P1.3 UX + Accessibility Baseline | Sprint 4 | P1.1 | N/A (frontend) | N/A |
| P2 | P2.1 Analytics Pipeline | Sprint 5 | P0.1 request IDs | `POST /api/v1/analytics/events` | `analytics_event` |
| P2 | P2.2 CMS + Admin Workflow | Sprint 6 | P1.1 place model | `/api/v1/admin/places*` | `place_revision` |
| P2 | P2.3 Geospatial Enhancements | Sprint 6+ | P1.1 place model | `GET /api/v1/routes/estimate`, `GET /api/v1/places/nearby` | `place.geom` (PostGIS) |

### Delivery gates

- **Gate A (end Sprint 1):** no secret-bearing API keys in client bundle; AI chat only via backend.
- **Gate B (end Sprint 2):** one Stripe flow in production; webhook-backed payment state.
- **Gate C (end Sprint 4):** place model unified + accessibility checks in CI.

---

## Prioritization scorecard (why this order)

Scoring model: **Impact (1-5) × Urgency (1-5) × Risk Reduction (1-5)**.

| Epic | Impact | Urgency | Risk Reduction | Score | Priority |
|---|---:|---:|---:|---:|---|
| P0.1 Secure AI Tour Guide Backend Proxy | 5 | 5 | 5 | 125 | P0 |
| P0.2 Consolidate Payments to PaymentIntent | 5 | 4 | 5 | 100 | P0 |
| P1.1 Shared Place Content Model | 4 | 4 | 4 | 64 | P1 |
| P1.2 Route-level Code Splitting | 4 | 3 | 3 | 36 | P1 |
| P1.3 UX + Accessibility Baseline | 4 | 3 | 4 | 48 | P1 |
| P2.1 Analytics Pipeline | 3 | 3 | 3 | 27 | P2 |
| P2.2 CMS + Admin Workflow | 3 | 2 | 2 | 12 | P2 |
| P2.3 Geospatial Enhancements | 3 | 2 | 2 | 12 | P2 |

---

## Current-state gap map (from existing app)

| Area | Current State | Gap | Backlog Link |
|---|---|---|---|
| Tour guide AI | Frontend-driven interaction pattern with limited operational controls | Secrets/runtime boundaries, retries, and observability need server control | P0.1 |
| Payments | Multiple UX/payment paths have existed over time | Must keep one canonical flow and durable webhook-backed status | P0.2 |
| Place data | Place/location data spread across multiple feature components | Single source-of-truth model needed for consistency | P1.1 |
| Performance | Build has shown chunk-size pressure in prior runs | Route split + CI budgets required to prevent regressions | P1.2 |
| Accessibility | Core flows are usable but not fully hardened for a11y checks | Automated a11y gates and keyboard path QA needed | P1.3 |

---

## Priority model

- **P0**: Security/reliability-critical, blocks safe production usage.
- **P1**: High value, directly improves core product quality and maintainability.
- **P2**: Nice-to-have improvements and optimization follow-ups.

---

## P0 Epics (Do first)

## Epic P0.1 — Secure AI Tour Guide via Backend Proxy

### Problem
The app currently invokes OpenAI logic from frontend-facing code patterns. This risks key exposure and makes operational controls difficult.

### Outcomes
- No OpenAI secret in browser code.
- One controlled backend endpoint for tour guide requests.
- Better observability, rate limiting, and abuse protection.

### API design

#### `POST /api/v1/tour-guide/chat`
Request:
```json
{
  "message": "What is special about Fort Christian?",
  "context": {
    "selectedFeature": {
      "name": "Fort Christian",
      "type": "historic_site",
      "lat": 18.3419,
      "lng": -64.9307,
      "description": "..."
    },
    "route": "/explore"
  },
  "sessionId": "optional-client-session-id"
}
```

Response:
```json
{
  "reply": "Fort Christian is...",
  "citations": [
    {
      "title": "USVI Archives",
      "url": "https://example.org/source"
    }
  ],
  "requestId": "req_abc123",
  "latencyMs": 823
}
```

Errors:
- `400` invalid payload
- `401` unauthenticated (if auth enabled)
- `429` rate-limited
- `500` provider/internal failure

### JSON schema (request validation)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": { "type": "string", "minLength": 1, "maxLength": 1200 },
    "context": {
      "type": "object",
      "properties": {
        "route": { "type": "string", "maxLength": 120 },
        "selectedFeature": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "maxLength": 120 },
            "type": { "type": "string", "enum": ["historic_site", "beach", "transport_hub", "other"] },
            "lat": { "type": "number", "minimum": -90, "maximum": 90 },
            "lng": { "type": "number", "minimum": -180, "maximum": 180 },
            "description": { "type": "string", "maxLength": 2000 }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "sessionId": { "type": "string", "maxLength": 128 }
  },
  "additionalProperties": false
}
```

### Backend schema (SQL)

```sql
create table ai_chat_session (
  id uuid primary key,
  user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active','closed'))
);

create table ai_chat_message (
  id uuid primary key,
  session_id uuid not null references ai_chat_session(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  context jsonb null,
  token_count int null,
  latency_ms int null,
  created_at timestamptz not null default now()
);

create index ai_chat_message_session_created_idx
  on ai_chat_message(session_id, created_at);
```

### Tasks
- Build server endpoint in `server/` or cloud function.
- Move OpenAI SDK calls server-side only.
- Add request validation (Zod/JSON schema).
- Add structured logging with `requestId`.
- Add basic per-IP/session rate limiting.
- Update frontend `TourGuidePanel` to call backend endpoint.

### Acceptance criteria
- OpenAI key absent from client bundle/env.
- End-to-end chat works with backend endpoint.
- 95th percentile API latency < 2.5s for normal queries.

---

## Epic P0.2 — Consolidate Payments Into One Flow

### Problem
Two overlapping checkout paths and two publishable key names create confusion and operational risk.

### Outcomes
- One canonical payment route and one env key.
- Predictable payment UX and maintainable code.

### API design

#### `POST /api/v1/payments/create-intent`
Request:
```json
{
  "amount": 2500,
  "currency": "usd",
  "purpose": "donation",
  "metadata": {
    "source": "web",
    "campaign": "heritage-support"
  }
}
```

Response:
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

#### `POST /api/v1/payments/webhook` (Stripe webhook)
- Handles `payment_intent.succeeded`, `payment_intent.payment_failed`.

### JSON schema (request validation)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["amount", "currency", "purpose"],
  "properties": {
    "amount": { "type": "integer", "minimum": 100, "maximum": 500000 },
    "currency": { "type": "string", "pattern": "^[a-z]{3}$" },
    "purpose": { "type": "string", "enum": ["donation", "ride", "ticket", "other"] },
    "metadata": { "type": "object", "additionalProperties": { "type": "string", "maxLength": 200 } }
  },
  "additionalProperties": false
}
```

### Backend schema (SQL)

```sql
create table payment_intent (
  id uuid primary key,
  stripe_payment_intent_id text not null unique,
  amount int not null,
  currency text not null,
  purpose text not null,
  status text not null,
  metadata jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_event (
  id uuid primary key,
  stripe_event_id text not null unique,
  type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
```

### Tasks
- Choose canonical route: `/donate` (or `/checkout`) and remove duplicate path/component.
- Standardize to `VITE_STRIPE_PUBLISHABLE_KEY` in frontend and docs.
- Switch from token creation demo flow to PaymentIntent flow.
- Add webhook processing and event persistence.

### Acceptance criteria
- Exactly one payment entrypoint in nav/routes.
- One env var for Stripe publishable key in frontend.
- Successful and failed payment states observable in DB/logs.

---

## P1 Epics

## Epic P1.1 — Shared Content Model for Sites, Beaches, and Ride Locations

### Problem
Location/content data is duplicated in multiple components, causing drift risk.

### Outcomes
- Single source of truth for map/list/search content.
- Easier expansion to more islands and POIs.

### API design

#### `GET /api/v1/places`
Query params:
- `type` (optional): `historic_site|beach|transport_hub`
- `island` (optional): `st_thomas|st_john|st_croix`
- `q` (optional text search)

Response:
```json
{
  "items": [
    {
      "id": "place_fort_christian",
      "name": "Fort Christian",
      "type": "historic_site",
      "island": "st_thomas",
      "lat": 18.3419,
      "lng": -64.9307,
      "shortDescription": "Oldest standing structure in the USVI",
      "tags": ["museum", "history"]
    }
  ],
  "nextCursor": null
}
```

### Backend schema (SQL)

```sql
create type place_type as enum ('historic_site','beach','transport_hub');
create type island_type as enum ('st_thomas','st_john','st_croix','other');

create table place (
  id text primary key,
  name text not null,
  type place_type not null,
  island island_type not null,
  lat double precision not null,
  lng double precision not null,
  short_description text null,
  long_description text null,
  tags text[] not null default '{}',
  source_url text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index place_type_island_idx on place(type, island);
create index place_name_trgm_idx on place using gin (name gin_trgm_ops);
```

### Tasks
- Create `src/data/places.js` as interim source-of-truth before backend.
- Refactor map/list/ride components to consume shared model.
- Normalize naming (`lat/lng`, `type`, `island`).

### Acceptance criteria
- No duplicate hardcoded place definitions across components.
- Search/map/list all derive from same place model.

---

## Epic P1.2 — Route-level Code Splitting and Performance Budgets

### Problem
Build reports oversized chunks and initial payload can be improved.

### Outcomes
- Faster first load and better mobile performance.
- Explicit performance budgets in CI.

### API/contract
No user-facing API change; CI contract:
- Main JS initial chunk target < 350KB gzip (or agreed threshold).
- Lighthouse performance score target >= 85 (mobile test profile).

### Tasks
- Lazy-load route components in `App` (map, explore, payments).
- Split vendor chunks via `rollupOptions.manualChunks` where needed.
- Add CI check for bundle size regressions.

### Acceptance criteria
- Build warning for >500KB chunk eliminated.
- Measurable drop in initial JS download size.

---

## Epic P1.3 — UX + Accessibility Baseline

### Problem
Core flows work, but accessibility and interaction polish can improve significantly.

### Outcomes
- Better keyboard navigation and screen-reader support.
- Clearer interactions for search/chat/navigation.

### API/contract
No backend API requirement. Accessibility contract:
- WCAG 2.1 AA checks pass for key routes (`/`, `/sites`, `/map`, `/explore`, `/donate`).

### Tasks
- Add explicit labels/aria for search and chat input.
- Add active nav state (`NavLink`) and focus-visible styles.
- Add Enter-to-send in chat; disable send while loading.
- Improve loading and empty states across maps/lists.

### Acceptance criteria
- Keyboard-only user can complete core flows.
- Automated axe checks pass for key screens.

---

## P2 Epics

## Epic P2.1 — Observability and Product Analytics

### Outcomes
- Understand route usage, drop-offs, and API reliability.

### API design

#### `POST /api/v1/analytics/events`
Request:
```json
{
  "event": "place_selected",
  "properties": {
    "placeId": "place_fort_christian",
    "route": "/explore"
  },
  "sessionId": "sess_123",
  "ts": "2026-02-05T12:34:56.000Z"
}
```

### Schema (SQL)

```sql
create table analytics_event (
  id uuid primary key,
  session_id text not null,
  event text not null,
  properties jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index analytics_event_event_idx on analytics_event(event);
create index analytics_event_created_idx on analytics_event(created_at);
```

---

## Epic P2.2 — Content CMS and Admin Workflow

### Outcomes
- Non-dev maintainers can update sites, descriptions, and featured places.

### API design
- `GET /api/v1/admin/places`
- `POST /api/v1/admin/places`
- `PATCH /api/v1/admin/places/:id`
- `POST /api/v1/admin/places/:id/publish`

### Schema (SQL)

```sql
create table place_revision (
  id uuid primary key,
  place_id text not null references place(id) on delete cascade,
  revision_number int not null,
  draft jsonb not null,
  status text not null check (status in ('draft','published')),
  author_user_id uuid null,
  created_at timestamptz not null default now(),
  unique(place_id, revision_number)
);
```

---

## Epic P2.3 — Geospatial Enhancements

### Outcomes
- Better route quality and richer map features.

### API design
- `GET /api/v1/routes/estimate?pickupId=...&dropoffId=...`
- `GET /api/v1/places/nearby?lat=...&lng=...&radiusMeters=...`

### Schema extension
If using Postgres + PostGIS:

```sql
alter table place add column geom geography(point, 4326);
update place set geom = st_setsrid(st_makepoint(lng, lat), 4326)::geography;
create index place_geom_gist_idx on place using gist (geom);
```

---

## API error code catalog (standardized)

All backend endpoints should return the same envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input payload is invalid",
    "requestId": "req_abc123"
  }
}
```

| Code | HTTP | Meaning | Retry? |
|---|---:|---|---|
| `VALIDATION_ERROR` | 400 | Request shape/value invalid | No |
| `UNAUTHENTICATED` | 401 | Missing/invalid auth | No |
| `FORBIDDEN` | 403 | Authenticated but disallowed | No |
| `NOT_FOUND` | 404 | Requested resource missing | No |
| `CONFLICT` | 409 | Duplicate/idempotency conflict | Sometimes |
| `RATE_LIMITED` | 429 | Request quota exceeded | Yes (with backoff) |
| `PROVIDER_ERROR` | 502 | Upstream dependency failed | Yes |
| `INTERNAL_ERROR` | 500 | Unexpected server error | Yes |

---

## Cross-epic technical standards

- **Validation**: Zod (or JSON Schema) for all incoming API payloads.
- **Error envelope**:
  ```json
  {
    "error": {
      "code": "RATE_LIMITED",
      "message": "Too many requests",
      "requestId": "req_abc123"
    }
  }
  ```
- **Auth (future-ready)**: accept anonymous sessions now; add user auth later without API breakage.
- **Versioning**: prefix APIs with `/api/v1` once first external client exists.

---

## Non-goals (for this backlog phase)

- Native iOS/Android applications.
- Multi-language localization beyond English.
- Real-time driver dispatch marketplace mechanics.
- Public third-party API exposure for external developers.

---

## First 10 implementation tickets (strict order)

1. **TG-001** Implement `/api/v1/tour-guide/chat` with validation and error envelope.
2. **TG-002** Add provider adapter, timeout, retry, and request-id logging.
3. **TG-004** Migrate frontend chat path to backend endpoint only.
4. **PAY-001** Remove duplicate payment route; keep one canonical `/donate` flow.
5. **PAY-002** Implement `/api/v1/payments/create-intent` + client secret handling.
6. **PAY-003** Implement webhook ingestion with idempotent event persistence.
7. **PAY-004** Add reconciliation job + operational alerts for webhook failures.
8. **PLC-001** Define and seed canonical `place` model.
9. **PLC-002** Refactor map/list/ride features to consume shared place model.
10. **PERF-001** Route-level lazy loading for non-home routes.

> Note: PERF-002/003 and A11Y-001/002/003 should start immediately after ticket 10.

---

## Suggested delivery sequencing

1. **Sprint 1 (P0.1)**: backend AI proxy + frontend migration.
2. **Sprint 2 (P0.2)**: unified payment flow + PaymentIntent + webhooks.
3. **Sprint 3 (P1.1 + P1.2)**: shared place model + route code splitting.
4. **Sprint 4 (P1.3)**: accessibility hardening + UX refinements.
5. **Sprint 5+ (P2)**: analytics, CMS, advanced geospatial features.

---

## Rollout and migration plan

### Phase A — Dual-write safe migration (where applicable)
- Keep legacy read paths temporarily while new APIs become stable.
- Write canonical records to new schema (`payment_intent`, `ai_chat_message`, `place`) first.
- Add short-lived compatibility adapters at UI/service boundaries.

### Phase B — Cutover
- Flip reads to canonical APIs for chat, payments, and places.
- Lock legacy paths (feature flag off / route removed).
- Run smoke tests for `/explore`, `/donate`, `/sites`, and `/map`.

### Phase C — Cleanup
- Remove dead code/constants and obsolete environment variables.
- Remove compatibility adapters and document final contracts.
- Archive migration runbook and outcomes.

---

## Risks and mitigations

| Risk | Affected Epic(s) | Mitigation | Owner |
|---|---|---|---|
| AI costs spike from unbounded prompts | P0.1 | enforce token caps, request throttling, and cache repeated Q&A | Backend |
| Stripe webhook delivery failures | P0.2 | idempotent event store + retry reconciliation job | Backend |
| Data drift between old hardcoded constants and new place model | P1.1 | freeze legacy constants and migrate in one PR with snapshot tests | Frontend |
| Performance regressions after feature growth | P1.2 | CI bundle budget + Lighthouse regression checks | Frontend |
| Accessibility regressions in iterative UI changes | P1.3 | axe CI checks + definition-of-done gate | Frontend |

---

## Definition of Done (for each epic)

- API contract documented (request/response/errors).
- Schema migration reviewed and reversible.
- Unit/integration tests added or updated.
- Metrics/logging included for new endpoints.
- README/env docs updated.


---

## Implementation slices (ticket-ready)

### P0.1 — Secure AI Tour Guide Backend Proxy
- **TG-001** Create `POST /api/v1/tour-guide/chat` with strict payload validation and error envelope.
- **TG-002** Add OpenAI provider adapter + timeout/retry policy (max 1 retry, exponential backoff).
- **TG-003** Persist prompts/replies in `ai_chat_message`; include `requestId` and `latencyMs`.
- **TG-004** Frontend migration: `TourGuidePanel` calls backend endpoint; remove direct SDK usage from client path.

### P0.2 — Consolidate Payments
- **PAY-001** Remove duplicate checkout route; retain one canonical flow (`/donate`).
- **PAY-002** Build `POST /api/v1/payments/create-intent` and return `clientSecret`.
- **PAY-003** Add Stripe webhook ingestion and idempotent `payment_event` recording.
- **PAY-004** Add success/failure reconciliation job to ensure DB state matches Stripe state.

### P1.1 — Shared Place Model
- **PLC-001** Define `place` contract and seed initial USVI content set.
- **PLC-002** Refactor `HistoricSiteList`, `HistoricMapApp`, and `RideSharingApp` to consume shared model.
- **PLC-003** Add filtering/query behavior to `GET /api/v1/places` with cursor pagination.

### P1.2 — Performance
- **PERF-001** Lazy-load all non-home routes in app router.
- **PERF-002** Add bundle budget check in CI with failure threshold.
- **PERF-003** Capture Lighthouse baseline and set regression threshold.

### P1.3 — Accessibility
- **A11Y-001** Convert nav links to active-state-aware links + visible focus styles.
- **A11Y-002** Add labels/ARIA for chat/search inputs and loading states.
- **A11Y-003** Add automated `axe` checks for core routes in test pipeline.

