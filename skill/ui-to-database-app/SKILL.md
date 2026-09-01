---
name: ui-to-database-app
description: Turn a frontend-only UI (React or plain HTML) into a database-backed web application through a gated, spec-driven pipeline. Use this skill whenever the user provides a frontend file or mockup and asks to make it a real app, add a database or backend to it, make its data persist, or "turn this into a database-backed web app." Produces two deliverables — an interactive artifact version with persistent storage, and a complete verified Next.js + Drizzle + SQLite project as a zip.
---

# UI → Database-Backed App

You are running a staged pipeline that converts a frontend-only UI into a working,
database-backed web application. The pipeline has **human approval gates** — never
skip ahead of a gate, even if you are confident. The user decides; you generate.

## Locked technical constraints (apply throughout)

- Next.js (App Router, TypeScript) with route handlers for the API.
- Drizzle ORM with SQLite (better-sqlite3) locally; keep a clean migration path to
  PostgreSQL and document it in the README.
- Integer auto-increment primary keys; `created_at` and `updated_at` on every table.
- No triggers, views, or stored procedures.
- **No authentication in v1**, but design for it: include an empty `middleware.ts`
  containing only a comment marking the future auth insertion point; route all
  database access through a thin data-access layer (`lib/data.ts`) so per-user
  filtering is later a small, local change; prefer schema conventions that make
  adding a `user_id` column a clean migration.
- A re-runnable seed script that resets to a known state.
- Keep the data model as small as the UI allows. Do not invent tables for features
  the UI does not have.

## Architecture rule: the data interface

All UI data access goes through a small named interface (e.g. `listPets`,
`createPet`, ...) defined in the spec. The UI never touches persistence directly.
This interface gets **two adapter implementations** as separate deliverables:
a `window.storage` adapter (artifact) and a `fetch` adapter calling the API routes
(real app). Components must be identical in spirit across both — only the adapter
differs.

## Pipeline

### Step 0 — Normalize (only if the input is plain HTML)
Convert the HTML/CSS/JS to a single-file React component with the same screens,
behavior, design, and sample data. Local state only; no new features. Report anything
that didn't translate one-to-one.

### Step 1 — Analyze and ask (NO CODE)
Analyze the frontend. Identify every kind of data displayed or collected, including
nested data. Propose a relational model. List your assumptions. Then ask **numbered
clarifying questions** about every genuine ambiguity — especially: fixed list vs.
free text; stored vs. derived values; formatted display strings hiding dates, times,
or numbers (e.g. an age display that should be a stored birthdate); optional
relationships; enum-like values needing CHECK constraints.
**GATE: wait for the user's answers. Do not write any application code in this step.**

### Step 2 — Spec
From the answers, write `SPEC.md`: the confirmed schema (tables, columns, types,
constraints, relationships, rationale); the full REST API surface (list, get-one,
create, update, delete per entity, with request/response shapes); the data interface
function list; the seed data (the UI's hardcoded sample data, listed explicitly); and
the locked constraints above.
**GATE: show SPEC.md and wait for explicit approval before generating any code.**

### Step 3 — Artifact deliverable
Build a single-file React artifact: same UI, components calling the data interface,
implemented by a `window.storage` adapter with graceful error handling. Seed storage
on first run if empty; include a small "Reset demo data" control. Everything the
interface defines must work, including update/delete.

### Step 4 — Real project: database layer
Generate the Next.js project skeleton with: `db/schema.ts` (Drizzle, matching SPEC.md
exactly), Drizzle config and npm scripts (`db:push` or `db:migrate`, `db:seed`,
`dev`), a commented human-readable `schema.sql`, the re-runnable `db/seed.ts`,
`lib/data.ts` as the only Drizzle-touching module, the commented-empty
`middleware.ts`, and `SPEC.md` copied into the project root. Show `db/schema.ts`,
`schema.sql`, and `db/seed.ts`, and confirm install + seed run cleanly.
**GATE: pause for user review before continuing.**

### Step 5 — API and wiring
Generate route handlers under `app/api/` as thin wrappers over `lib/data.ts` with
input validation and correct status codes (400 bad input, 404 missing record),
returning exactly the SPEC's JSON shapes. Port the UI into the project using a
`lib/client-db.ts` fetch adapter; add simple loading and error states; change the
components as little as possible. Report what changed in the components.

### Step 6 — Verify and package
In the execution environment: install, migrate/push, seed, start the dev server, then
smoke-test with real HTTP requests — full CRUD per entity plus one realistic
end-to-end flow across related entities — showing actual responses. Confirm data
survives a server restart. Fix failures and re-run until green. Write `README.md`
(what it is, how to run with Node, how the seed works, SQLite → PostgreSQL migration
path) and deliver the project as a downloadable zip.

## Conduct

- Announce which step you are on as you work; never silently merge or skip steps.
- If the user's frontend is very large, propose a scoped v1 slice first and get
  agreement before Step 1's questions.
- If a step's output contradicts SPEC.md, fix the output — or, if the spec is wrong,
  propose a spec change and get approval before proceeding.
