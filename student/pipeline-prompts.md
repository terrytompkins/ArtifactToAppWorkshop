# Pet Care Coach Workshop — The Pipeline Prompts

These are the canonical prompts for the workshop. Each is written to be copied and
pasted verbatim into a Claude chat (claude.ai web or desktop, with the "create and
analyze files" capability enabled). They are environment-agnostic except for Prompt 6,
which has two variants.

The prompts are domain-agnostic on purpose: they refer to "the frontend I've provided,"
so they work with the Pet Care Coach starter *or* any frontend a student brings. This
is the point of the pipeline — it's a reusable workflow, not a Pet Coach recipe.

Prompt 0A is the one exception to "the frontend I've provided": it's the step before
there is a frontend at all. Everything from Prompt 0B on assumes one already exists —
whether that's today's starter or something you bring from home.

**Sequence at a glance**

| # | Prompt | Gate before continuing |
|---|--------|------------------------|
| 0A | (Optional) From idea to prototype | Prototype opens; sample data renders; refresh clears it |
| 0B | (Optional) Normalize plain HTML to React | Converted app looks/behaves the same |
| 1 | Analyze UI, propose data model, ask questions | Claude asked questions; class answers them |
| 2 | Confirm schema, produce SPEC.md | Human approves SPEC.md |
| 3 | Build the interactive artifact app | Students click around their working app |
| 4 | Generate the real project: DB layer + seed | Schema files match SPEC |
| 5 | Generate API routes + wire the frontend | Code review of one route + one component |
| 6 | Verify end to end, package | Green smoke tests; zip downloaded |

---

## Prompt 0A — From idea to prototype (optional origin story)

This is the step *before* Prompt 0B: how do you get a clickable frontend to start
from in the first place? Run it in a brand-new chat, no attachments. It's two passes
on purpose — a rough one, then a refinement — because that back-and-forth *is* the
skill being taught here, not a single perfect prompt.

### Pass 1 — the rough idea

```
I have an idea for a small web app called Pet Care Coach. It's a simple
health-record tracker for pet owners: for each pet you can log a symptom
report when something seems off, and schedule vet appointments. I want to
see it before I invest any more thought into it.

Build me a quick clickable prototype as a single, self-contained HTML file
(inline CSS and JS, no build step, no backend) that I can just open in a
browser. Make up a couple of sample pets and some sample data so it
doesn't look empty. It's fine if everything resets on refresh — I just
want to see the idea, not build the real thing yet.
```

**What to check:** open the file Claude hands back. Notice how much it decided on
your behalf — what fields a pet has, what "urgency" looks like, whether there's a
modal or an inline form. That is what a rough prompt buys you: something to react to,
fast, with every unstated choice now sitting in front of you to keep or override.
Talk as a class about what you'd change before moving on.

### Pass 2 — leveling up the brief

Same chat, same file — don't start over, add detail to what is already there. This is
the natural next move once a rough pass exists.

```
This is a good start. Let's make it feel more real. Keep it a single HTML
file with everything inline — still no backend, no persistence, still fine
if it resets on refresh.

The app is called "Pet Care Coach" — a small paw-print mark, a clean teal
accent color, card-based layout, all on one page.

Screen 1: a list of pets as cards — an avatar (an emoji for the species),
the name, species/breed/age on one line, and a small count of how many
symptom reports and appointments each pet has. A "+ Add pet" button up top.

Screen 2 (click a pet to get here): the pet's name and details up top, then
two columns side by side — "Symptom log" and "Appointments" — each with
its own "+" button to add a new one, and a friendly empty-state message
when there's nothing logged yet.

For each pet, track: name, species (Dog / Cat / Rabbit / Other, shown with
a matching emoji), breed, and age (just show it like "6y").

For each symptom report: a date, a free-text description of what was
noticed, roughly how long it's been going on, and an urgency shown as a
colored tag — Low, Moderate, or High.

For each appointment: a visit type (Wellness check / Sick visit /
Same-day urgent visit / Follow-up visit), a "when" shown as a friendly
date-and-time string, the vet's name, and a status tag — Upcoming or
Completed. When an appointment was scheduled because of a specific
symptom report, show a small note on the appointment saying which report
prompted it.

Give me three sample pets: a dog named Maple (Lab mix, 6y) with a recent
symptom report (low energy, skipped breakfast) and an older one (a mild
limp), plus two appointments — an upcoming sick visit tied to the recent
report, and a past, completed wellness check; a cat named Juniper
(domestic shorthair, 3y) with one recent symptom report and one upcoming
appointment tied to it; and a rabbit named Biscuit (Holland Lop, 2y) with
nothing logged yet, so I can see what the empty states look like.

Add a short footer noting this is a fictional product for demo purposes,
not a substitute for real veterinary care.
```

**What to check:** click through both pets with data, then Biscuit's empty one. Add a
report, add an appointment, then refresh the page and watch it all disappear — the
same motivating gap the rest of today is built to close, except this time you know
exactly how it was built, because you just built it. However this particular file
turned out is genuinely yours; every group's version will differ in the details, the
way two builders working from the same verbal brief put up two different houses.
**For the rest of today, so everyone is looking at the same ambiguities in the
exercises ahead, switch to the shared reference build:** open
`starters/pet-coach-starter-plain.html`. Notice nobody has told you yet what it does —
you already know, because you just described it yourself.

---

## Prompt 0B (optional) — Normalize plain HTML to React

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

Attach or paste the React frontend (the starter, or the output of Prompt 0B).

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
