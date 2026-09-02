# Pet Coach Workshop — Project Context & Handoff Document

**Purpose of this document:** Complete context for resuming this project in a new
Claude conversation (different account). Paste or attach this file at the start of
the new chat, along with any workshop files being discussed, and say: "This document
is the context for an ongoing project. Read it, then help me continue from the
'Current status and next steps' section."

---

## 1. Project overview

Terry is designing and facilitating a **two-hour workshop** teaching participants to
use Claude to transform a frontend-only UI into a fully database-backed web
application via a structured, gated prompt pipeline. Audience is **mixed**: technical
users and general knowledge workers, so the design supports multiple tracks.

**Core pedagogical arc:** start with a frontend whose data vanishes on refresh →
Claude analyzes the UI and *infers* a database schema → Claude asks clarifying
questions about ambiguities → human confirms a spec → Claude generates the app twice
(an in-chat interactive artifact, then a real verified Next.js project) → finale
packages the whole pipeline as a reusable Claude skill.

**Demo domain:** "Pet Care Coach" — Terry's established fictional brand from prior
presentations (public repo: `terrytompkins/revealjs-pet-coach-demo`, including a
Reveal.js user-journey deck). Workshop v1 is framed as "Pet Coach before the AI" —
the record-keeping core beneath the deck's grander AI-triage vision. Teal accent,
card-based UI, sample characters: Maple (Lab mix, 6y), Juniper (cat, 3y), Biscuit
(rabbit, 2y, deliberately empty records for empty-state demo). Footer disclaimer:
fictional product, not a substitute for veterinary care.

## 2. Locked technical decisions

- **Stack:** Next.js App Router (TypeScript) with route handlers; Drizzle ORM;
  SQLite via better-sqlite3 locally with a documented migration path to PostgreSQL.
  Drizzle chosen over Prisma (no codegen/engine binary) and over raw SQL (avoids
  teaching two dialects); a human-readable `schema.sql` is still generated as a
  teaching artifact alongside the Drizzle schema.
- **v1 scope:** three entities — **Pets**, **Symptom Reports**, **Appointments**.
  One implicit owner, one implicit clinic. No AI features.
- **No authentication in v1**, designed as a clean future bolt-on: empty
  `middleware.ts` with a comment marking the auth insertion point; thin data-access
  layer (`lib/data.ts`) as the only Drizzle-touching module; schema conventions
  making a future `user_id` migration small. Sequel workshop target: Auth.js
  (NextAuth v5) with Microsoft Entra ID provider; real SSO needs corporate tenant
  app registration (IT dependency), so the sequel plans a dev-mode credentials
  login plus commented Entra config.
- Integer auto-increment PKs; `created_at`/`updated_at` everywhere; no triggers or
  views; re-runnable seed script required.
- **OpenSpec:** adopted conceptually, not as tooling (its npm CLI requires Node ≥
  20.19, breaking the no-install track). The pipeline writes a `SPEC.md` approved
  before code generation — spec-driven development by hand. OpenSpec is name-checked
  in class as the industrialized version; its docs' auth-delta example is a bridge
  to a potential workshop 3.

## 3. The two-deliverables architecture (key design)

**Deliverable 1 — Artifact app (universal, no-install):** the same UI as an
interactive React artifact in the chat, persisting via Claude's artifact key-value
store (`window.storage`). Runs in any claude.ai web/desktop chat (and mobile).
Generated FIRST (immediate gratification, ~minute 45 of the session). Note:
key-value, not relational — records stored as JSON, filtered in JS. Cannot do SSO
(no server, no secrets) — used as a teaching point.

**Deliverable 2 — Real app (zip):** complete Next.js + Drizzle + SQLite project,
verified inside Claude's chat code-execution sandbox (install → migrate → seed →
start dev server → real HTTP smoke tests, full CRUD + one end-to-end flow + restart
persistence), then delivered as a downloadable zip with README (incl. Postgres path).

**Shared design between them:** UI components never touch persistence; they call a
small named data interface (`db.listPets()`, `db.createPet()`, …) defined in
SPEC.md. Two ~50-line adapters implement it: a `window.storage` adapter (artifact)
and a `fetch` adapter against the API routes (real app). Delivered as two separate
files, NOT one dual-mode file (environment detection was rejected as fragile).
This is the workshop's architectural thesis: same components, two backends —
foreshadows SQLite→Postgres and the auth bolt-on.

## 4. Environment facts established (verify before workshop — fast-moving area)

- **claude.ai chat + "create and analyze files"** gives Claude a Linux sandbox with
  Node/npm: the full pipeline genuinely runs and verifies there. BUT the sandbox
  cannot expose a port — students cannot browse the running Next.js app from chat.
  The artifact deliverable closes that gap.
- **Claude Code desktop app** has a preview/Browser pane that can display a running
  dev server (Track B payoff). Claude Code's native installer bundles a runtime for
  *Claude Code itself only* — it does NOT provide `node`/`npm` for user projects, so
  running the Next.js app locally still requires Node on the machine.
- **Portable Node** (official zip binaries, no admin rights) is the workaround for
  users who can run executables but can't install software. Genuinely locked-down
  workstations (AppLocker etc.) have no local path — artifact track is their primary.
- **To re-verify the week before class:** (a) whether Claude Code desktop *cloud*
  sessions now support app preview; (b) current claude.ai Settings path for
  enabling file creation.
- **Pre-class triage (3 questions):** can you install software? can you run
  downloaded executables? do you have Claude Code? → sorts students into Track A
  (universal, in-chat) / A + portable Node / A + B (local run).

## 5. The pipeline (7 prompts, gated)

0. *(Optional)* Normalize plain HTML → single-file React (straight translation).
1. Analyze UI → propose relational model → list assumptions → **ask numbered
   clarifying questions**. NO CODE. Gate: human answers.
2. Answers → write **SPEC.md** (schema + full CRUD API surface + data interface +
   seed data + locked constraints). Gate: explicit approval.
3. Build the **artifact app** (storage adapter, seed-on-first-run, Reset control).
4. Real project **database layer** (schema.ts, schema.sql, seed, lib/data.ts,
   middleware.ts stub). Gate: review vs SPEC.
5. **API routes** (thin wrappers, validation, status codes) + port UI with fetch
   adapter; report that components barely changed.
6. **Verify & package** — Variant A (chat sandbox smoke tests + zip) / Variant B
   (Claude Code: run locally with preview).

Seven **deliberate ambiguities** are planted in the starter UI so step 1's questions
happen authentically (age "6y" vs birthdate; urgency enum vs free text; vet as
column vs entity; optional appointment→report FK; stored vs derived status; species
fixed list vs free text; date shown as display string). House answers + target
schema live in `starter-facilitator-notes.md` (facilitator-only — never show to
students or include in workshop prompts; starter code contains no schema hints).

Target v1 schema: `pets` (id, name, species, breed, birthdate, timestamps);
`symptom_reports` (id, pet_id FK, reported_on, symptoms, duration, urgency CHECK,
timestamps); `appointments` (id, pet_id FK, nullable symptom_report_id FK,
visit_type, scheduled_at, vet_name, status CHECK, timestamps).

## 6. Files produced (going into a GitHub repo)

| File | Role |
|---|---|
| `starters/pet-coach-starter-react.jsx` | Primary starter: single-file React, hardcoded nested data (reports/appointments nested inside pets — deliberate, so schema inference must normalize), local state only. |
| `starters/pet-coach-starter-plain.html` | Same app, vanilla HTML/CSS/JS — input for Prompt 0 and the capstone demo. |
| `facilitator/starter-facilitator-notes.md` | PRIVATE. The 7 ambiguities, house answers, target schema. |
| `student/pipeline-prompts.md` | Canonical copy-paste prompts 0–6 (+6A/6B) with per-step "what to check" gates. Domain-agnostic wording. |
| `student/student-handout.md` | Pre-class triage, account check ("make me a text file that says hello"), track table, session narrative, adapter diagram, troubleshooting, after-class paths. |
| `facilitator/facilitator-script.md` | Minute-by-minute 120-min plan, talking points, question-game mechanics, recovery playbook keyed to "golden checkpoints" (facilitator dry-runs pipeline twice, saves every stage output), 3 verbatim closing lines. Designated cut if long: the Prompt 0 demo. |
| `skill/ui-to-database-app/SKILL.md` | Capstone skill: the whole pipeline as an autonomous Claude skill with approval gates preserved. Finale demo: fresh chat + HTML starter + one sentence. |

## 7. Current status and next steps

**Done:** starter frontends (both variants), facilitator notes, all 7 pipeline
prompts, student handout, facilitator script, capstone SKILL.md.

**Next steps (agreed or implied):**
1. ~~Terry assembles everything into a GitHub repo (structure TBD).~~ **Done** —
   `starters/`, `student/`, `facilitator/`, `skill/ui-to-database-app/SKILL.md`. The
   student/facilitator split is load-bearing, not cosmetic: the planted-ambiguity
   answers must not sit in a directory the handout sends students to. Share deep
   links to `student/` and `starters/`, never the repo root.
2. **Dry-run the full pipeline** with the exact prompts against the React starter
   (twice) to (a) harden any prompt that generates inconsistently — bring failures
   back to Claude to tighten wording — and (b) produce the golden checkpoints
   (golden SPEC.md, golden artifact, golden zip).
3. Week-before verification of the two fast-moving environment facts (§4).
4. Pre-class email with triage + account verification test.
5. Stage the portable Node zip for after-class office hours.
6. Future: sequel workshop (auth via Auth.js/Entra ID; dev-mode login + commented
   Entra config; schema migration lesson), possible workshop 3 (OpenSpec adoption,
   auth as a delta spec).

## 8. Working-style notes for the resumed conversation

- Decisions above are settled; don't relitigate unless something breaks in dry-runs.
- Reliability beats richness everywhere: the two-hour clock and mixed audience are
  the binding constraints.
- Prompts and skill must stay domain-agnostic; Pet Coach specifics live only in the
  starters, sample data, and facilitator materials.
- The facilitator notes file must stay out of student hands and out of any prompt
  fed to Claude during the workshop, or the analysis step's questions are spoiled.
