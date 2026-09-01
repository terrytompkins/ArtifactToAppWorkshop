# From Frontend to Full App — Facilitator Script

Companion documents: **Pipeline Prompts** (canonical prompt text), **Student Handout**
(participant-facing), **Starter Facilitator Notes** (the seven planted ambiguities and
house answers — keep private), **SKILL.md** (capstone skill file).

## Before the session (your prep checklist)

1. **Dry-run the entire pipeline yourself, twice**, in a fresh claude.ai chat each
   time. Save the outputs of every stage — these are your **golden checkpoints**:
   golden SPEC.md, golden artifact, golden project zip. If any student's thread goes
   sideways, you hand them the checkpoint for their current stage and they continue.
2. Verify the starter files render correctly: `pet-coach-starter-react.jsx` (primary)
   and `pet-coach-starter-plain.html` (conversion demo).
3. Re-check three fast-moving facts the week before: whether Claude Code desktop
   cloud sessions now support app preview (affects your Track B pitch); the exact
   Settings path for enabling file creation in claude.ai (affects the pre-class
   email); and the current Next.js / TypeScript version pairing (see Prompt 4's
   "what to check" — as of 2026-09-01, TypeScript 7 breaks a Next.js 15 build).
   Update the handout if any has changed.
4. Send the pre-class email: self-triage questions, account requirement, the
   "make me a text file that says hello" verification test.
5. Have the portable Node zip downloaded and staged for the after-class session.

## Timing plan (120 minutes)

Buffer is built in at two places. If you're running long, the designated cut is the
Prompt 0 demo (say it exists, skip the live run) and shortening artifact play time.

### 0:00–0:10 — The problem statement
Open the starter app. Click around as a pet owner: "Maple's been low-energy — log
it." Then refresh. Data gone. **Talking point:** "Everything you just saw was a lie —
beautiful, hardcoded lies. Today we make it true." Frame the arc: UI → inferred
schema → spec → working app twice over (in-chat, then real). Mention the journey deck
if the audience has seen your prior Pet Coach sessions: "this is v1 of that vision —
the boring tables the AI magic would someday sit on."

### 0:10–0:18 — Concepts, minimal
Only three concepts, drawn on one slide or whiteboard: **table/schema** ("a
spreadsheet with rules"), **API** ("the counter between the kitchen and the dining
room"), **the adapter diagram** from the handout (draw it now, point back at it all
session). Then show the pipeline table from Pipeline Prompts. **Talking point:** "The
prompts matter less than the gates. You are the approval step. AI does the typing;
you do the deciding."

Optional 3-minute demo: Prompt 0 on the plain-HTML starter, mostly to say "if what
you have is old-school HTML, the pipeline has an on-ramp."

### 0:18–0:35 — Prompt 1: analysis and the question game
Run Prompt 1 on the React starter. While Claude analyzes, tell the room what to
watch for: "It should come back with questions, not code. If your Claude wrote code,
you get to scold it — see your handout."

When the questions arrive, **play the question game**: read each aloud, let the room
propose answers, then land on the house answer (from Starter Facilitator Notes).
Spend real time on the two best ones:
- **Age "6y":** stored age goes stale — someone in the room will realize Maple has a
  birthday. Store birthdate, compute age. Applause moment.
- **Status Upcoming/Completed:** "can't we just compare to today's date?" — then ask
  "what about Cancelled?" The room discovers why status must be stored.

If Claude missed a planted question, prompt it socratically: "What about how age is
displayed?" **Do not** just supply the answer unasked — the class should see Claude
notice.

### 0:35–0:45 — Prompt 2: the spec is the contract
Send answers + Prompt 2. Read SPEC.md together — tables first, then the API list,
then seed data. Check it against your golden SPEC (they should match on structure;
wording will differ). Approve it *out loud and in the chat*: "SPEC approved,
continue." **Talking point:** "This document is the single source of truth. Every
later stage cites it. This is spec-driven development — tools like OpenSpec
industrialize exactly this ritual; today you're doing it by hand so you feel it."

### 0:45–1:02 — Prompt 3: the artifact (the gratification spike)
Run Prompt 3. While it generates, explain what window.storage is: "Claude artifacts
have a little persistent pocket. We're using it as a stand-in database." When it
renders: **free play, 5 full minutes.** Everyone adds their own actual pet. Then the
kicker: close the conversation, reopen, data's still there. Phones out — "open
claude.ai on your phone, same chat, there's your app."

**Talking point at the adapter:** scroll to the storage adapter code. "Look at what
the buttons call: `db.createPet`. Not storage. The UI has no idea where data lives.
Hold that thought for 20 minutes."

### 1:02–1:08 — Breather + the two-apps framing
Stretch break. On return, one framing minute: "You now have a working app. But its
'database' is a key-value pocket inside Claude. Real apps need real databases —
searchable, relational, portable, eventually multi-user. Same UI, new engine room."

### 1:08–1:20 — Prompt 4: the database layer
Run Prompt 4. Review moment: put **SPEC.md, db/schema.ts, and schema.sql side by
side**. One model, three renderings — the spec, the ORM, the raw SQL. For the
technical folks this is the Drizzle pitch; for knowledge workers it's "the spec
became real, verbatim." Point at middleware.ts and its lone comment: "that empty file
is where sign-in goes in the sequel workshop. We planned the extension before writing
v1 — that's the whole trick to not painting yourself into corners."

### 1:20–1:32 — Prompt 5: API + the payoff of the adapter
Run Prompt 5. The review moment is the **diff story**: ask Claude "summarize what
changed in the components" — the answer should be "almost nothing." Then show
lib/client-db.ts next to the artifact's storage adapter. Same function names, same
shapes, different backend. Point back at the whiteboard diagram. **This is the
lecture's thesis proven in code.**

### 1:32–1:45 — Prompt 6A: trust, but verify
Run Prompt 6 Variant A. Narrate the smoke tests as they scroll: "That's a real HTTP
request against a real running server against a real database file — inside Claude's
sandbox." Highlight the end-to-end flow (new pet → report → linked appointment → read
back) and the restart-persistence check. Download the zip **on screen**. "This zip is
a complete application. Tonight, anyone with Node runs it in three commands. Track B
folks: Claude Code will do even that for you."

If a failure occurs mid-verification: **let it play out.** Claude reading its own
stack trace and fixing it is the single most persuasive minute of the workshop. Only
intervene (golden zip) if it thrashes past ~3 fix attempts.

### 1:45–2:00 — Capstone: from pipeline to skill
Frame: "You ran seven prompts and made maybe ten decisions. The prompts are now
overhead — the decisions were the work. So let's make the prompts disappear." Show
SKILL.md (from the workshop materials): walk the frontmatter and the workflow section
— "it's the pipeline, written as instructions Claude follows on its own, gates
included." Install it (claude.ai skills capability, or `~/.claude/skills/` for Claude
Code users), then the mic-drop demo in a **fresh chat**: attach the plain-HTML
starter and say only, "Turn this into a database-backed web app." Claude should walk
the whole pipeline — asking the clarifying questions, pausing at the spec gate.

Close with the roadmap: Track B tonight (run it locally), portable Node office hours,
and the sequel — "that empty middleware.ts is an appointment we made with our future
selves: SSO sign-in, and the schema migration that makes the data per-user. Same
method: spec first, gates always, verify at the end."

## Recovery playbook (quick reference)

| Symptom | Move |
|---|---|
| Claude generated code at the analysis step | Student replies: "Stop — ask your clarifying questions first." Works nearly always. |
| Schema diverged badly from house model | Paste golden SPEC.md: "Use this as the approved spec, continue from Prompt 3." |
| Artifact errors twice in a row | "Regenerate the artifact from SPEC.md from scratch." Storage code is the usual culprit; regeneration beats patching. |
| Student far behind at a stage boundary | Hand them the golden checkpoint for that stage; they rejoin live. |
| npm install slow in Prompt 6 | Expected (~1–3 min). Pre-planned talking gap: preview the capstone. |
| Build fails on a TypeScript/Next.js version mismatch | Known: bare `npm install typescript` gets TS 7, which Next.js 15 rejects. "Pin typescript to ^6 and rebuild." Prompt 4 now asks for pins to prevent it. |
| Verification thrashing (>3 fix loops) | Golden zip on screen; student retries their own after class. |
| Whole-room platform issue | Fall back to your dry-run chat via screen share; students spectate, then re-run solo after class. |

## The three sentences to land, verbatim

1. "The prompts do the typing; the gates do the deciding — and you are the gates."
2. "Same components, same interface, two adapters — that's why one app ran in two
   worlds today."
3. "The spec is the contract: nothing gets built that isn't written down and
   approved."
