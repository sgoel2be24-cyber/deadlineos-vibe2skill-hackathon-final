# DeadlineOS

Turn deadline chaos into an executable rescue plan.

DeadlineOS is an AI Deadline Rescue Agent built for the **Vibe2Ship / Vibe2Skill Hackathon** problem statement **The Last-Minute Life Saver**.

Live app: [https://remix-deadlineos-351292995406.asia-southeast1.run.app](https://remix-deadlineos-351292995406.asia-southeast1.run.app/)

GitHub: [https://github.com/sgoel2be24-cyber/DeadlineOS-vibe2skill-hackathon-](https://github.com/sgoel2be24-cyber/DeadlineOS-vibe2skill-hackathon-)

## Solution Overview

Students, working professionals, and founders often miss deadlines because normal reminder tools only alert them after the work is already urgent. DeadlineOS acts like an active rescue agent: the user dumps a messy list of tasks, fatigue level, meetings, bills, and deadlines, and the app instantly turns that chaos into a practical plan.

The current hackathon build is intentionally optimized for a fast, stable demo. It runs in local fallback mode with curated crisis presets and does not require a Gemini API key.

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

## Google Technologies Used

- Google AI Studio Build Mode
- Google AI Studio / Cloud Run deployment
- Gemini-ready agent architecture
- Google Calendar deep links

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Node.js and Express
- esbuild production server bundle

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

No environment variables are required for the current fallback demo mode.

`.env` files are ignored by Git. `.env.example` is included only as a future integration reference.

## Fallback / Demo Mode

The current version always uses local fallback rescue plans. This keeps the app fast, stable, and reliable for judging:

- No Gemini API call is required.
- Analyze does not wait on slow network responses.
- The app remains usable without secrets.
- Demo presets map to curated local rescue plans in `src/demoData.ts`.
- Custom user input falls back to a generic rescue plan.

## Future Gemini API Integration Plan

After the hackathon demo phase, Gemini can be enabled behind the existing agent architecture:

1. Add a server-only Gemini client guarded by `GEMINI_API_KEY`.
2. Keep the current local fallback as the timeout and error path.
3. Validate Gemini JSON responses against the `RescuePlan` shape before rendering.
4. Use a short timeout so Analyze never blocks the demo experience.
5. Never expose API keys in the browser.

## Security Notes

- No secrets are committed.
- `.env` and `.env.*` are ignored.
- `.env.example` contains placeholders only.
- The app does not use authentication or a database in this phase.
