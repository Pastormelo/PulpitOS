# Preach Flow Web

Preach Flow is a focused sermon-prep web app converted from `pulpitos.jsx`.

The marketing homepage lives at `/` (`index.html`); the app itself lives at `/app` (`app.html`). PreachFlow is positioned as a guided sermon-prep workflow - not an AI sermon generator. The in-app AI feature is called **Sermon Guide**: it helps pastors study the passage, clarify the sermon burden, shape the message, and review their work without replacing the preacher.

Key app features: the phase workflow with one writing document that carries across every phase, plus per-phase checklists; structured worksheets (big idea, Christ connection, application audiences) and a movement outline builder; a Notes bank with cross-sermon word search and tags; sermon import (.docx/.pdf/.txt/.md) into the pipeline or as a preached sermon; direct PDF and Word export plus a pre-filled production slides doc; Google Docs sync; and a Stay Ahead page teaching the four-weeks-ahead prep rhythm.

## Hosted Deployment

This project is ready for Vercel. It serves the app as static files and runs the coach/review endpoints as hosted API functions in `/api`.

Required Vercel environment variables:

```txt
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Optional:

```txt
OPENAI_MODEL=gpt-5.2
GOOGLE_CLIENT_ID=
```

Preach Flow uses a bring-your-own-key model for the AI coach. Do not add your personal OpenAI API key to Vercel for a public deployment. Each visitor adds their own OpenAI API key inside the app, and that key is stored in their browser.

## Design

The app runs on the **v2 visual language**: technical editorial. Stark surfaces, hairline
rules instead of cards, square corners everywhere, no shadows, oversized uppercase
Montserrat 900 for display type, Mulish for prose, and IBM Plex Mono for every label and
control. One accent colour, the brand orange `#FF953E`.

The rules that hold it together:

- Nothing is rounded and nothing casts a shadow. Depth comes from rules and inverted blocks.
- Hairline dividers are `1px solid var(--pf-line)`; structural dividers are `2px solid var(--pf-fg)`.
- Active nav items, tabs, and filters are solid inverted blocks, never underlines or pills.
- Anything that is not prose is monospace uppercase, and never below 10.5px.
- Hover is a background swap to `var(--pf-sunk)`. No lift, no scale, no glow.
- Every piece of text clears WCAG AA against whatever it is painted on. The brand
  orange `#FF953E` is a **fill** colour: at label sizes on a light surface it only
  reaches 2.2:1, so accent *text* uses `--pf-acc-text`, large bold accents use
  `--pf-acc-display`, and accents sitting on an inverted block use `--pf-acc-on-inv`.
  All three flip with the theme. The browser drive fails if anything slips below AA.

All of it lives in `src/styles.css`. The tokens (`--pf-bg`, `--pf-fg`, `--pf-line`,
`--pf-sunk`, `--pf-inv-bg`, `--pf-acc`, and friends) are declared once per theme on
`:root` / `[data-theme="dark"]`, with the older semantic names kept as aliases so every
component inherits the palette. The **light/dark toggle** is persisted per browser and
stamped on `<html>`, `<body>`, and `.pf-root` so the page behind the app matches too.

The public pages (`index.html`, `philosophy.html`, `share.html`) carry their own inline
copies of the same tokens and rules, so the whole site reads as one thing. They stay
self-contained on purpose: no extra stylesheet request before first paint, and a share
link renders even if the app's CSS never loads. When a token changes in
`src/styles.css`, change it in those three files too; the browser drive checks all three
for square corners, no shadows, monospace labels, and AA contrast.

## Accounts and Database

Preach Flow uses Supabase Auth and a Supabase Postgres table for account-based saving. Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor, then add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel.

Sign-in supports **email + password**, **Continue with Google**, and a one-time **magic link**. To enable Google sign-in, turn on the Google provider in your Supabase project (Authentication → Providers → Google) and add this site's URL to the allowed redirect URLs. Password sign-up may require email confirmation depending on your Supabase Auth settings.

The app stores one private `app_state` JSON document per user. Row Level Security restricts each user to their own row.

To enable Google Docs sync, create a Google OAuth Web Client ID and add it as `GOOGLE_CLIENT_ID` in Vercel. In Google Cloud, add your Vercel URL as an Authorized JavaScript origin, for example:

```txt
https://your-site.vercel.app
```

The app requests these Google scopes only when you click Connect Google:

```txt
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/documents
```

## Run Locally

```sh
npm install
npm start
```

Then open:

```txt
http://127.0.0.1:4173
```

`npm install` is only needed once (it installs `jszip`, used for `.docx` import). Without it the app still runs; only `.docx` extraction is disabled.

The app still runs and saves sermons locally without a user OpenAI key. Coach and review calls ask each user to add their own key inside the app.

## Project Layout

The site has a single source of truth, with no duplicated copies to keep in sync:

```txt
index.html    Marketing homepage (served at /)
app.html      The app shell (served at /app)
src/          App code: app.js and styles.css
assets/       Brand mark and Montserrat font files
api/          Vercel serverless functions (coach, draft, review, extract-docx, status, config)
supabase/     Database schema (run in the Supabase SQL editor)
server.mjs    Local dev server (static files + the same API endpoints)
```

`npm run build` assembles the deployable static site into `dist/` from these root sources. `dist/` is generated output and is not committed.

## Tests

```sh
npm test
```

Runs the smoke suite in `test/`: syntax-checks every JS file, boots the local server, and verifies the homepage, app shell, API status/config endpoints, 404 handling, and the path-traversal guard.

For the browser drive, start a server and run it against that:

```sh
PORT=4173 node server.mjs &
npm run drive
```

`test/visual.drive.mjs` walks the app in Chromium and checks the visual language holds
(no rounded corners, no shadows, monospace controls, a 58px sticky header), that the
interactions it touches still work (new sermon, phase rail, checklist, pipeline rows,
the one writing document carrying across phases),
that every screen paints in light and dark, that every piece of text on every screen
clears WCAG AA contrast in both themes, and that a 390px phone gets one column with
no sideways scrolling. Set `PF_SHOTS=/some/dir` to save screenshots. It skips itself
with exit 0 when Playwright is not installed.

## Features

- Guided sermon workflow from exegesis through delivery.
- Pipeline search and filtering.
- Editable sermon details.
- One writing document per sermon, carried through every phase and shared with the Sermon Editor.
- Account login and cloud progress sync through Supabase.
- Markdown export.
- Finished-sermon review.
- `.txt`, `.md`, and `.docx` upload support.
- Bring-your-own OpenAI key support so each user pays for and controls their own coach usage.
- Optional Google Docs link per sermon with delayed auto-sync from the app into the linked doc.
