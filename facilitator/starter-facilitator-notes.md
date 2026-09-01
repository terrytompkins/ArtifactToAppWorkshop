# Pet Care Coach Starter Frontends — Facilitator Notes

**Do not distribute this file to students, and do not include it in any prompt given to
Claude during the workshop.** The starter frontends are intentionally "innocent" — no
data layer, no comments hinting at a schema — so that Claude's UI analysis and
clarifying questions happen honestly, live, in front of the class.

## The two starter files

| File | Purpose |
|---|---|
| `starters/pet-coach-starter-react.jsx` | Primary starter. Single-file React app, hardcoded sample data, local state only. Input to **Prompt 1** (analyze UI → propose schema). |
| `starters/pet-coach-starter-plain.html` | Same app in plain HTML/CSS/JS. Input to **Prompt 0** (normalize to React) for demonstrating the conversion path, and to the capstone demo. |

Both apps work when opened/rendered: you can browse pets, open a pet, log symptom
reports, and schedule appointments. **Data disappears on refresh** — that is the
motivating demo moment for the whole workshop ("this is why apps need databases").

## Scope framing for the class

This is "Pet Coach before the AI" — the record-keeping v1 underneath the full product
vision shown in the journey deck. Three concepts on screen: **Pets**, **Symptom
Reports**, **Appointments**. No AI triage, no clinic integration, no auth. One implicit
owner, one implicit clinic (Westside Clinic exists only in flavor text).

## Deliberate ambiguities and house answers

These are planted so that Claude's schema-inference step must ask clarifying
questions. When it does, let the room discuss, then steer to the house answer so every
table's app converges (important for the facilitator being able to help debug).

1. **Pet age is displayed as "6y".** Store age or birthdate?
   → *House answer: store `birthdate` (DATE); display age is computed. Teaching point:
   stored age goes stale.*

2. **Urgency shows Low / Moderate / High tags.** Enum/CHECK constraint or free text?
   → *House answer: TEXT with a CHECK constraint on the three values. Teaching point:
   the UI's dropdown already implies the constraint.*

3. **Vet appears as a plain name ("Dr. Patel").** Column on appointments or a
   separate `vets` table?
   → *House answer: plain TEXT column in v1; note aloud that a vets table is the
   "right" answer at clinic scale — a preview of schema evolution.*

4. **Some appointments show "Prompted by report from …", some don't.** Optional
   foreign key from appointments to symptom_reports?
   → *House answer: yes — nullable `symptom_report_id` FK. Teaching point: nullable
   FKs model optional relationships.*

5. **Appointment status shows Upcoming / Completed.** Stored column or derived from
   the appointment time?
   → *House answer: stored TEXT column with CHECK ('Upcoming','Completed','Cancelled').
   Teaching point: "Cancelled" can't be derived from a timestamp, so status must be
   stored.*

6. **Species is a dropdown (Dog/Cat/Rabbit/Other) with emoji avatars.** Fixed list or
   free text?
   → *House answer: free TEXT, no CHECK constraint; emoji mapping stays a UI concern.
   Teaching point: not every UI dropdown is a database constraint.*
   → **Be ready to be argued with here.** The obvious reason — "because of Other" —
   does not survive scrutiny: there is no free-text species field anywhere in the
   starter, so picking "Other" literally stores the string `"Other"`, and a
   four-value CHECK constraint is a perfectly defensible read of this UI. Someone
   technical will say so. The honest answer is about *rate of change*, not about the
   UI: species is an open-ended real-world category, a CHECK constraint means a
   migration every time the clinic sees a ferret, and the four options on screen are
   a v1 shortcut rather than a business rule. Contrast it with urgency (ambiguity 2),
   where the three values *are* the business rule and the constraint is right. That
   contrast is the actual lesson; if the room finds it for you, let them.

7. **Appointment "when" is a display string ("2026-08-20 · 10:30 AM").** Store as
   text or a real timestamp?
   → *House answer: real timestamp column; formatting is the UI's job. Teaching point:
   never store display strings.*

## Expected v1 schema (the target the class should land on)

- `pets` — id, name, species, breed, birthdate, created_at, updated_at
- `symptom_reports` — id, pet_id (FK), reported_on, symptoms, duration, urgency
  (CHECK), created_at, updated_at
- `appointments` — id, pet_id (FK), symptom_report_id (nullable FK), visit_type,
  scheduled_at, vet_name, status (CHECK), created_at, updated_at

Locked v1 constraints (already agreed): integer PKs, timestamps on every table, no
auth, no triggers/views, Drizzle ORM with SQLite locally, seed script included.

## Sample data notes

Maple's "low energy, skipped breakfast" report and the Dr. Patel sick visit are lifted
from the journey deck, so the demo data will feel familiar to anyone who has seen your
Pet Coach presentations. Biscuit the rabbit has no records — the empty states are
intentional so the class sees them before and after wiring the database.
