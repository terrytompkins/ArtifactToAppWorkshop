# Artifact to App — Workshop

A two-hour workshop that teaches people to turn a frontend-only UI into a
database-backed web application with Claude, through a gated, spec-driven prompt
pipeline. The demo domain is **Pet Care Coach**, a fictional pet health-records app.

The thing being taught is not any single prompt. It is the rhythm: Claude infers a
data model from the UI, asks about what the UI leaves ambiguous, a human confirms a
spec, and only then does code get generated — twice, once as an in-chat interactive
artifact and once as a real, verified Next.js project.

> ⚠️ **`facilitator/` contains spoilers. Do not share the repo root with
> participants.** Share links to `student/` and `starters/` only. The workshop's
> centrepiece is a live guessing game about seven ambiguities deliberately planted in
> the starter UI; `facilitator/starter-facilitator-notes.md` is the answer key.

## Layout

| Path | Audience | What it is |
|---|---|---|
| `starters/` | everyone | The two starter frontends. Both work; both lose their data on refresh — that is the motivating demo. |
| `student/` | participants | `student-handout.md` (pre-class triage, session narrative, troubleshooting) and `pipeline-prompts.md` (the canonical prompts 0–6, copy-paste ready). |
| `facilitator/` | **private** | `facilitator-script.md` (minute-by-minute plan, recovery playbook), `starter-facilitator-notes.md` (the seven planted ambiguities and house answers), `project-context-handoff.md` (design decisions and their rationale). |
| `skill/ui-to-database-app/` | everyone, at the end | The capstone: the whole pipeline packaged as a Claude skill. |

## Reading order

**Running the workshop:** `facilitator/project-context-handoff.md` for why the design
is the way it is → `facilitator/starter-facilitator-notes.md` for the planted
ambiguities → `student/pipeline-prompts.md` for what you will actually paste →
`facilitator/facilitator-script.md` for the clock.

**Attending it:** `student/student-handout.md`, then `student/pipeline-prompts.md`.

**Just want the reusable part?** `skill/ui-to-database-app/SKILL.md`. It stands alone
and is domain-agnostic — point it at any frontend.

## The starters

| File | Role |
|---|---|
| `starters/pet-coach-starter-react.jsx` | Primary starter. Single-file React with Tailwind classes, sample data hardcoded and *nested* (reports and appointments inside pets), local state only. Input to Prompt 1. |
| `starters/pet-coach-starter-plain.html` | The same app in vanilla HTML/CSS/JS, no build step — open it in a browser. Input to Prompt 0 (the "convert it to React first" on-ramp) and to the capstone demo. |

Both are deliberately "innocent": no data layer, no comments hinting at a schema, so
Claude's analysis and questions happen honestly in front of the room. Keep it that way
when editing them.

## Before you run it

1. Dry-run the whole pipeline twice and keep every stage output as a golden
   checkpoint. The recovery playbook depends on having them.
2. Re-check the three fast-moving environment facts listed in the facilitator script's
   prep checklist — including the current Next.js / TypeScript version pairing.
3. Send the pre-class email with the self-triage questions and the account check.

---

*Pet Care Coach is a fictional product used for class purposes. It does not replace
veterinary care.*
