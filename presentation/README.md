# Artifact to App — the 20-minute overview deck

A Reveal.js presentation that walks through the workshop without anyone having to
type a prompt: the big-picture pipeline, the three gates, and a representative
excerpt of what each of Prompts 0–6 produced. Built for a 20-minute slot (first
delivered at PromptlyAt9) for people who could not attend the two-hour workshop.

Open `index.html` in a browser. Reveal.js loads from a CDN (jsDelivr, pinned to
5.2.1), so presenting needs an internet connection; there is no build step.

## Presenting

| Key | Does |
|---|---|
| `→` / `Space` | next slide (code slides step through highlighted regions first) |
| `S` | speaker view — talking points for every slide, plus a timer |
| `F` | fullscreen |
| `Esc` / `O` | slide overview |

Each slide carries a `≈ N min` chip in the top-right corner; they sum to 20. If you
are behind, cut in this order: the on-ramps slide (Prompt 0A/0B), then compress the
capstone. Never cut the question-game or the adapter-payoff slides — they are the
argument.

## Spoilers

The deck shows **three of the seven** planted ambiguities from the question game
(age → birthdate, status → stored because of Cancelled, display string → timestamp)
and deliberately withholds the other four so the deck can be shown to people who may
attend a later run of the workshop. It is safe to share alongside `student/` and
`starters/`. Keep it that way when editing: the full list lives in
`facilitator/starter-facilitator-notes.md` and should stay there.

## Fidelity note

The code and spec excerpts are **representative**, written to match the house
schema and the pipeline's conventions (Drizzle + SQLite, integer PKs,
`created_at`/`updated_at`, nullable `symptom_report_id`, `status` CHECK). Every
real run of the pipeline produces slightly different code — same spec, different
contractor — so treat the slides as "what it looks like", not as golden output. If
you would rather show the real thing, swap in excerpts from your golden checkpoints.
