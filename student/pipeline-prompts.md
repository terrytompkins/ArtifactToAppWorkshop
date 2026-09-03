# Pet Care Coach Workshop — The Pipeline Prompts

These are the canonical prompts for the workshop. Each is written to be copied and
pasted verbatim into a Claude chat (claude.ai web or desktop, with the "create and
analyze files" capability enabled). They are environment-agnostic except for Prompt 6,
which has two variants.

The prompts are domain-agnostic on purpose: they refer to "the frontend I've provided,"
so they work with the Pet Care Coach starter *or* any frontend a student brings. This
is the point of the pipeline — it's a reusable workflow, not a Pet Coach recipe.

**Sequence at a glance**

| # | Prompt | Gate before continuing |
|---|--------|------------------------|
| 0 | (Optional) Normalize plain HTML to React | Converted app looks/behaves the same |
| 1 | Analyze UI, propose data model, ask questions | Claude asked questions; class answers them |
| 2 | Confirm schema, produce SPEC.md | Human approves SPEC.md |
| 3 | Build the interactive artifact app | Students click around their working app |
| 4 | Generate the real project: DB layer + seed | Schema files match SPEC |
| 5 | Generate API routes + wire the frontend | Code review of one route + one component |
| 6 | Verify end to end, package | Green smoke tests; zip downloaded |

---

## Prompt 0 (optional) — Normalize plain HTML to React

Use only if the starting frontend is plain HTML/CSS/JS. Attach or paste the HTML file.

```
Here is a plain HTML/CSS/JS frontend for an application. Convert it to a
single-file React component that I could use as the starting point for a React
project.

Requirements:
- Functional components with hooks; one file with a default export.
- Reproduce the same screens, behavior, and visual design.
- Preserve all hardcoded sample data exactly as it is.
- Local component state only — do not add persistence, a data layer, routing
  libraries, or any new features. This is a straight translation.

After converting, briefly list anything that did not translate one-to-one and
what you did about it.
```

**What to check:** open/render the converted component next to the original. Same
pets, same forms, same tags. If styling drifted, say so and ask Claude to fix the
specific differences — this is a good first taste of iterative correction.

---

## Prompt 1 — Analyze the UI and propose a data model (no code!)

Attach or paste the React frontend (the starter, or the output of Prompt 0).

```
I want to turn this frontend into a database-backed web application. You are
going to help me do that in a series of steps. This first step is analysis
only — do not write any application code yet.

Analyze the frontend I've provided and:

1. Identify every kind of data the UI displays or collects, including data
   that is nested inside other data.
2. Propose a relational data model that would support this UI: tables,
   columns, column types, and the relationships between tables.
3. List every assumption you had to make about the data.
4. Ask me numbered clarifying questions wherever the UI is genuinely
   ambiguous about the data. Pay particular attention to: values that might
   be fixed lists vs. free text; displayed values that might be stored vs.
   derived; text that might really be a date, time, or number; relationships
   that appear optional; and anything displayed as a formatted string that
   should probably be stored differently.

Constraints for the eventual database: SQLite accessed via Drizzle ORM,
integer auto-increment primary keys, created_at and updated_at columns on
every table, no authentication in v1 (assume a single implicit user), and no
triggers or views. Keep the model as small as this UI allows — do not invent
tables for features the UI doesn't have.

Wait for my answers to your questions before proposing the final schema.
```

**What to check:** Claude should come back with clarifying questions, not code. Discuss
each one as a class and agree on an answer together before moving on. If Claude missed
one, ask it: "What about the way age is displayed — is that the right thing to store?"

---

## Prompt 2 — Confirm the schema and write SPEC.md

Send your answers to Claude's questions in the same message as this prompt, answers
first.

```
[Your numbered answers to Claude's questions go here.]

Based on my answers, write a SPEC.md file that will be the single source of
truth for everything we generate next. It must document:

1. The confirmed data model: every table, column, type, constraint, default,
   and relationship, plus a short rationale for the decisions we just made.
2. The REST API surface: every endpoint with its method, path, request body,
   and response shape. Cover list, get-one, create, update, and delete for
   each entity, even where the current UI only uses some of these.
3. The data interface: a small set of named functions (for example listPets,
   createPet, createSymptomReport...) that the UI will call for all data
   access. The UI must never talk to persistence directly — only through
   this interface. Every function maps to one API endpoint.
4. The seed data plan: the sample data currently hardcoded in the frontend
   becomes the database seed data, listed explicitly.
5. The locked v1 constraints: SQLite via Drizzle ORM locally with a clean
   migration path to PostgreSQL; integer primary keys; created_at/updated_at
   everywhere; no authentication in v1, but schema and code conventions that
   make adding per-user data ownership a clean future migration; no triggers
   or views.

Create SPEC.md as a file and show it to me. Do not generate any application
code until I approve the spec.
```

**What to check:** read SPEC.md aloud with the class — this is the contract. Confirm
it covers pets, symptom reports, and appointments, with tables, an API list, and seed
data. Approve explicitly ("SPEC approved, continue") so the approval gate is visible
as a practice.

---

## Prompt 3 — Build the interactive artifact app

```
SPEC.md is approved. Before we build the real application, build a version I
can use right now: a fully interactive artifact running in this chat.

Requirements:
- Same UI and visual design as the frontend I provided.
- Refactor the components so all data access goes through the data interface
  defined in SPEC.md.
- Implement that interface with a storage adapter backed by the artifact
  persistence API (window.storage), so my records survive closing and
  reopening this conversation. Handle storage errors gracefully.
- On first run, if storage is empty, load the seed data from SPEC.md.
- Add one small "Reset demo data" control that restores the seed data.
- Everything the SPEC's data interface supports should actually work in the
  artifact, including update and delete where the interface defines them.

Build it as a single-file React artifact.
```

**What to check:** the payoff moment. Add a pet, log a report, schedule an
appointment. Close the chat, reopen it — the data is still there. Point at the
adapter: "the components don't know where the data lives. Remember that."

---

## Prompt 4 — Generate the real project: database layer first

```
Now we build the real application from the same SPEC.md. Generate it in
stages so I can review each layer. This stage is the project skeleton and
database layer only — no API routes and no UI wiring yet.

Create a Next.js project (App Router, TypeScript) containing:

- The Drizzle schema (db/schema.ts) matching SPEC.md exactly, using SQLite
  via better-sqlite3, with integer auto-increment primary keys and
  created_at/updated_at on every table.
- Drizzle config and an npm script setup so that db:push (or db:migrate),
  db:seed, and dev all work.
- A readable schema.sql file showing the plain SQL DDL for the same schema,
  for human reference — generated from the spec, clearly commented.
- A seed script (db/seed.ts) that loads exactly the seed data listed in
  SPEC.md, and is safe to re-run (it should reset to a known state, not
  duplicate rows).
- A thin data-access layer (lib/data.ts) implementing the SPEC's data
  interface against the database. This file is the only place that touches
  Drizzle. Structure it so that adding per-user filtering later is a small,
  local change.
- An empty middleware.ts whose only content is a comment marking it as the
  future authentication insertion point.
- SPEC.md copied into the project root.

Pin dependency versions in package.json rather than installing "latest",
and make sure the TypeScript version you pin is one the Next.js version you
pin actually supports.

Show me db/schema.ts, schema.sql, and db/seed.ts when done, and confirm the
project installs and the seed runs cleanly in your environment.
```

**What to check:** put db/schema.ts and schema.sql side by side with SPEC.md's table
definitions. Three artifacts, one model — the spec discipline made visible.

Also check the versions it pinned. As of 2026-09-01 a bare `npm install typescript`
resolves to TypeScript 7, and **Next.js 15 refuses to build against it**:

```
TypeScript 7.0.2 is not supported by this version of Next.js. … Install
TypeScript 6 (e.g. npm install --save-dev typescript@^6) or upgrade to a
Next.js v16.2.11 or later
```

Verified on Next.js 15.5.25. It is a clean, self-explanatory error and Claude will
usually fix it unprompted — but it lands in Prompt 6, which is the tightest block in
the session. Cheaper to catch here. Re-check this pairing before each delivery; it is
a fast-moving one.

---

## Prompt 5 — Generate the API and wire the frontend

```
Database layer approved. Next stage:

1. Generate the REST API routes from SPEC.md as Next.js route handlers under
   app/api/. Each handler must be a thin wrapper over lib/data.ts — no
   database code in routes. Validate inputs, return correct status codes
   (including 404 for missing records and 400 for bad input), and return
   JSON shapes exactly as SPEC.md defines them.
2. Port the frontend I provided into the project as the application UI. Keep
   the components and design the same, but replace all hardcoded data and
   local-state persistence with calls to the data interface — implemented
   this time as a fetch-based client adapter (lib/client-db.ts) that calls
   the API routes. Add simple loading and error states where the UI now
   waits on the network. Do not add features beyond what the UI already has.

When done, show me one route handler and the client adapter, and summarize
what changed in the components (it should be very little).
```

**What to check:** the teaching moment is the diff. The components barely changed;
only the adapter is new. Compare lib/client-db.ts to the artifact's storage adapter —
same function names, different backend. That's the whole architecture lesson.

---

## Prompt 6 — Verify end to end and package

### Variant A — claude.ai chat (universal track)

```
Final stage: prove the application works, then package it.

In your environment: install dependencies, run the schema push/migration,
run the seed script, and start the dev server. Then smoke-test the running
API with real HTTP requests:

- For each entity, exercise list, get-one, create, update, and delete, and
  show me the actual responses.
- Then run one realistic end-to-end flow: create a new pet, log a symptom
  report for it, schedule an appointment linked to that report, and read
  everything back.
- Confirm the data survives a dev-server restart.

If anything fails, fix it and re-run until everything passes. Then:

- Write a README.md with: what the app is, how to install and run it
  locally (Node required), how the seed works, and a short section on
  migrating from SQLite to PostgreSQL with Drizzle.
- Package the entire project as a zip file I can download.
```

### Variant B — Claude Code (local track, run after class or by equipped students)

```
This folder contains a Next.js + Drizzle + SQLite application. Install
dependencies, run the schema push/migration and the seed script, then start
the dev server and open the app preview.

Then walk me through verifying it interactively: I will create a new pet,
log a symptom report, and schedule an appointment linked to that report in
the browser. After that, restart the dev server and confirm my data is still
there. Fix any issues we find.
```

**What to check (Variant A):** the smoke-test output is the "trust but verify"
artifact — real requests, real responses, real persistence across restart. Download
the zip. This zip is the input to Variant B and to the post-class native-Node session.
