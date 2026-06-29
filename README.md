# DeadlineOS

Turn deadline chaos into an executable rescue plan.

DeadlineOS is an AI Deadline Rescue Agent built for the **Vibe2Ship / Vibe2Skill Hackathon** problem statement **The Last-Minute Life Saver**.

Live app: [https://remix-deadlineos-351292995406.asia-southeast1.run.app](https://remix-deadlineos-351292995406.asia-southeast1.run.app/)

GitHub: [https://github.com/sgoel2be24-cyber/deadlineos-vibe2skill-hackathon-final](https://github.com/sgoel2be24-cyber/deadlineos-vibe2skill-hackathon-final)

## Solution Overview

Students, working professionals, and founders often miss deadlines because normal reminder tools only alert them after the work is already urgent. DeadlineOS acts like an active rescue agent: the user dumps a messy list of tasks, fatigue level, meetings, bills, and deadlines, and the app instantly turns that chaos into a practical plan.

The current hackathon build is intentionally optimized for a fast, stable demo. Curated demo presets always run locally. Custom manual input can use server-side Gemini analysis when `GEMINI_API_KEY` is configured, and safely falls back when it is not.

## Key Features

- Landing page with a clear launch flow
- Student Crisis, Working Professional, and Entrepreneur demo presets
- Fast local analysis that renders in about 1 second
- AI Deadline Rescue Plan dashboard
- Overall risk badge and Do This Now priority card
- Agent observation and conflict alerts
- Rescue schedule with Google Calendar deep links
- Task cards with micro-action checklists
- Done, Delayed, Stuck, and Skipped task controls
- Low-energy replanning with event log
- Smart communication drafts
- Voice input button with graceful unsupported-browser handling
- Works without authentication, a database, paid services, or API keys
- Optional server-side Gemini analysis for custom/manual input

## Google Technologies Used

- Google AI Studio Build Mode
- Google AI Studio / Cloud Run deployment
- Gemini-ready agent architecture
- Google Calendar deep links
- Google Gemini API through the official `@google/genai` SDK

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Node.js and Express
- esbuild production server bundle
- `@google/genai` for optional custom-input analysis

## Demo Flow

1. Open the live app or run it locally.
2. Click **Launch Deadline Rescue Agent**.
3. Select **Student Crisis**, **Working Professional**, or **Entrepreneur**.
4. Click **Analyze My Tasks & Build Rescue Plan**.
5. Review the risk badge, Do This Now card, schedule, tasks, drafts, and recommendations.
6. Mark tasks as Done, Delayed, Stuck, or Skipped.
7. Click **I'm Exhausted - Replan with Low Energy** to simulate adaptive replanning.
8. Use Google Calendar export links for schedule blocks.

## Local Setup

```bash
npm install
npm run dev
```

The local dev server starts from `server.ts` and serves the Vite app through Express.

## Build

```bash
npm run build
npm start
```

The production build creates static Vite assets and bundles the Express server to `dist/server.cjs`.

## Environment Variables

No environment variables are required for demo preset or fallback mode.

To enable Gemini for custom/manual input, create a local `.env` file:

```env
GEMINI_API_KEY=
```

Get a key from [Google AI Studio](https://aistudio.google.com/) by opening the API key section and creating a Gemini API key for your Google account/project.

`.env` files are ignored by Git. Do not commit real API keys.

## Fallback / Demo Mode

Demo presets always use local fallback rescue plans. This keeps the judging flow fast, stable, and reliable:

- Student Crisis, Working Professional, and Entrepreneur do not call Gemini.
- Preset Analyze keeps the 750ms fast loader behavior.
- The app remains usable without secrets.
- Demo presets map to curated local rescue plans in `src/demoData.ts`.
- Custom user input falls back to a generic rescue plan when Gemini is unavailable.

## Gemini Custom Input

Custom/manual task dumps are sent to the Express endpoint `POST /api/analyze`. The browser never receives the API key. The server asks Gemini to return strict JSON, validates the response, maps it to the dashboard `RescuePlan` shape, and returns one of three modes:

- **Fast Demo Mode:** local curated preset.
- **Gemini Analysis:** valid custom Gemini response.
- **Safe Fallback Mode:** no key, timeout, API error, quota issue, invalid JSON, missing fields, malformed schema, or frontend fetch failure.

The default model is `gemini-3.5-flash`, configurable with `GEMINI_MODEL` if the deployed SDK/project requires a different Flash model. Gemini requests are capped with a short server timeout so the UI can always recover.

## Security Notes

- No secrets are committed.
- `.env` and `.env.*` are ignored.
- `.env.example` contains blank placeholders only.
- The app does not use authentication or a database in this phase.
