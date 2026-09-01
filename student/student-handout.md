# From Frontend to Full App — Student Handout

**Workshop:** Turning a Claude-built UI into a database-backed web application
**Length:** 2 hours · **You need:** a browser and a Claude account (details below)

## What you'll walk away with

1. A working, clickable version of the app running inside Claude itself — with data
   that persists between sessions. No installation of any kind.
2. A complete, verified web application (Next.js + SQLite) as a downloadable zip —
   ready to run on any machine with Node.js, and ready to grow.
3. A reusable pipeline of prompts — and a packaged Claude "skill" — that you can point
   at *any* frontend, not just today's demo app.

## Before class: 3-question self-triage

Answer these three questions and note your track. Everyone does the same core
exercise; your track only affects the optional final segment.

1. **Can you install software on your machine?** (Do you have admin rights?)
2. **Can you run downloaded programs** (unsigned executables) on your machine?
3. **Do you have Claude Code enabled** in your Claude Desktop app or terminal?

| Your answers | Your track |
|---|---|
| No to 1 and 2 (locked-down workstation) | **Track A only** — everything runs in Claude's own interface. You lose nothing from the core session. |
| No to 1, yes to 2 | **Track A + portable Node** — after class, we can set up a no-install Node and run your app locally. |
| Yes to 1 (and ideally 3) | **Track A + Track B** — after the core session, run your zip locally, with Claude Code driving if you have it. |

**Everyone must have:** a claude.ai account (web or desktop) with the **"create and
analyze files"** capability turned on (Settings → Capabilities). Please verify this
before class — send Claude the message "make me a text file that says hello" and
confirm you get a downloadable file back.

## The big idea

You'll start with a frontend-only app: it looks real, but every piece of data is
hardcoded, and anything you add vanishes when you refresh. By the end, the same UI
will be backed by a real relational database — and you'll have watched Claude *infer
the database design from the UI itself*, ask you intelligent questions about the gaps,
and only then generate code.

The workflow is a pipeline of numbered prompts (see the companion document,
**Pipeline Prompts**). Between most prompts there is a **gate**: a human (you) reviews
and approves before generation continues. That review-then-generate rhythm — not any
single prompt — is the skill this workshop teaches.

## Session flow

**1. Meet the starter app.** Pet Care Coach v1: pets, symptom reports, appointments.
Click around. Add a record. Refresh. Watch it vanish. That's the problem statement.

**2. Prompt 1 — Analysis.** Claude reads the UI and proposes a data model — then asks
clarifying questions where the UI is ambiguous. We answer them together as a class.
Notice the *kinds* of questions: stored vs. derived? fixed list vs. free text? is
that "date" actually text? These are the questions professional data modelers ask.

**3. Prompt 2 — The spec.** Claude writes SPEC.md: the confirmed schema, the API
design, the seed data. We approve it explicitly. Nothing gets built that isn't in the
spec. (This discipline has a name — spec-driven development — and grown-up tooling
like OpenSpec exists for it at team scale. Today we practice the idea.)

**4. Prompt 3 — Your app, live, right now.** Claude builds an interactive version of
the app as an artifact in your chat, using Claude's built-in persistent storage. Add
your own pets. Close the chat. Reopen. Still there. This is your no-install
deliverable, and it runs on your phone, too.

**5. Prompts 4–5 — The real thing.** Claude generates the actual project: real SQL
schema, real database, seed script, REST API, and your same UI wired to it. We review
each layer against SPEC.md before continuing.

**6. Prompt 6 — Trust, but verify.** Claude installs, migrates, seeds, starts the
server *inside its own sandbox*, and fires real HTTP requests at every endpoint,
showing you the responses — then fixes anything that fails and hands you the zip.

**7. Capstone — Package it as a skill.** We take the whole pipeline and install it as
a reusable Claude skill. From then on, "turn this frontend into a database-backed
app" is one sentence, and Claude follows today's entire playbook — questions, spec,
gates, verification, both deliverables.

## The one diagram to remember

```
        Your UI components
              │
       the data interface        ← e.g. db.listPets(), db.createPet()
        (defined in SPEC.md)
         ┌────┴─────┐
         │          │
  storage adapter   fetch adapter
  (artifact — runs  (real app — calls
  inside Claude)    your API + SQLite)
```

Same components. Same interface. Two adapters. This is why the artifact and the real
app are the *same app* — and it's the same trick that later lets you swap SQLite for
PostgreSQL, and add authentication, without rewriting the UI.

## If something goes wrong (it sometimes does — that's part of the lesson)

- **Claude skipped the questions and jumped to a schema.** Reply: "Stop — you were
  asked to ask clarifying questions first. Ask them now." The pipeline's gates are
  instructions to Claude, and you are allowed to enforce them.
- **The artifact shows an error or a blank screen.** Tell Claude what you see,
  verbatim (screenshot or paste the error). "Fix it" with a specific symptom nearly
  always works. If it doesn't after two tries, say: "Regenerate the artifact from
  SPEC.md from scratch."
- **The generated app differs from your neighbor's.** Expected! Same spec, different
  code — like two contractors building from one blueprint. What must match is the
  behavior, which is what the verification step checks.
- **npm install or the dev server fails in Prompt 6.** Let Claude read its own error
  output and fix it — that's what the verification stage is *for*. You watching
  Claude debug is a feature of the workshop, not a failure of it.
- **You fall behind.** Don't panic-paste prompts. Flag the facilitator; there are
  known-good checkpoint outputs for every stage.

## After class

- **Track B:** unzip your app, and either run it with Claude Code (it can install,
  seed, launch, and preview it for you — note your machine still needs Node.js to run
  the app itself) or run it by hand: `npm install`, `npm run db:push`,
  `npm run db:seed`, `npm run dev`.
- **Portable Node track:** see the facilitator for the no-admin-rights Node setup.
- **The sequel:** adding sign-in (SSO via Auth.js, e.g. Microsoft Entra ID) is a
  clean bolt-on by design — the empty middleware.ts in your project marks the exact
  insertion point, and your schema was designed so "whose data is this?" is a small
  migration, not a rewrite.

*Pet Care Coach is a fictional product used for class purposes. It does not replace
veterinary care.*
