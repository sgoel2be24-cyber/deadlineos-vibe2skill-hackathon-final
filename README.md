# DeadlineOS 🚀

*Turn deadline chaos into an executable rescue plan.*

**DeadlineOS** is an intelligent AI Deadline Rescue Agent built for the **Vibe2Ship / Vibe2Skill Hackathon**. It is specifically designed to solve the problem statement: **"The Last-Minute Life Saver."**

---

## 📌 Problem Statement Selected
**"The Last-Minute Life Saver"**
* **The Conflict:** Students, professionals, and entrepreneurs frequently miss deadlines. Traditional productivity tools (like standard calendars and checklist apps) function as *passive reminders*—they alarm you only when a deadline has arrived or spam notifications about overdue assignments, but do not help you plan, prioritize, bypass cognitive panic, or construct practical micro-action paths.
* **The Consequence:** Unstructured backlogs generate completion paralysis, causing users to get stuck, delayed, and ultimately miss crucial milestones.

---

## 💡 Solution: DeadlineOS
**DeadlineOS** acts as an *Active AI Rescue Agent*. Rather than nagging you with more alarms, it takes a messy, unformatted, natural language text dump of tasks, upcoming meetings, bill due dates, and fatigue factors. It then:
1. **Detects Deadline Risks:** Predicts timing clashes and flags overall risk profiles (Low, Medium, High, or Critical).
2. **Promotes a "Do This Now" Hero Target:** Pinpoints the single absolute highest-consequence active deliverable and highlights it on an impossible-to-miss visual canvas, curing decision fatigue.
3. **Creates Micro-Action Checklists:** Splits intimidating 4-hour jobs into fast, realistic 15-minute milestones.
4. **Delivers Smart Communications Drafts:** Generates context-appropriate Slack/Teams/Email templates for setting boundaries, explaining delays, or requesting feedback.
5. **Enables One-Click Adaptive Replanning:** Adapts on-demand when the user clicks **Done**, **Delayed**, **Stuck**, **Skipped**, or **I'm Exhausted**—dynamically shifting timeline intervals and introducing unblocking actions.

---

## 🛠️ Technologies Used
* **Frontend Sandbox:** React 19, TypeScript, Tailwind CSS, Lucide icons, Motion layout transitions.
* **Backend Server:** Node.js, Express, `tsx` runner, `esbuild` deployment bundler.
* **Speech Integration:** Browser Web Speech API for voice-activated messy task dumps.
* **AI Engine:** `@google/genai` (Official modern TypeScript SDK) with graceful Server-Side Fallbacks.

---

## 🛡️ Google Technologies Leveraged
* **@google/genai SDK Integration:** Built with server-side proxy routes to bypass direct browser-key exposures, querying the native `gemini-3.5-flash` model utilizing robust system instructions and structural JSON output parsers.
* **Google Calendar deep-links:** Exposes one-click template calendars mapping out specific recovery schedules directly on Google Calendar without requiring user OAuth setups.

---

## 🏎️ 60-Second Demo Walkthrough for Judges
1. **Launch the Demo console:** Click **"Launch Demo Console"** on the splash screen.
2. **Choose a Preset Crisis:** Click one of the three pre-designed hackathon crisis select keys:
   * 🎓 **Student Crisis:** (DSA homework tonight, electricity bill due, group meeting sync collisions, low energy).
   * 💼 **Corporate Lead:** (Client deck at 6 PM, weekly sync at 4 PM, inbox backlog, fatigue).
   * 🚀 **Founder Mode:** (Investor pitch deck, live customer demo, tax gateway due tonight).
3. **Analyze Bandwidths:** Click **"Analyze My Tasks & Build Rescue Plan"**.
4. **See the Rescue Profile:** Review the newly generated visual timeline:
   * Check off items in the **Active Task Breakdown** and watch priorities cross out.
   * View the prominent red-alert **Do This Now** Hero Card.
5. **Simulate a Replan Event:** Click **"I'm Stuck"** or **"I'm Exhausted"** in the replanning panel. Notice how the agent state immediately registers the incident into the chronic cron ledger, introduces unblocking guidelines, and scales focus ranges dynamically.

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory to activate the dynamic server-side Gemini API routing:

```env
# Required for real AI text diagnostics
GEMINI_API_KEY="your_google_ai_studio_api_key_here"

# Automatic service endpoint callback
APP_URL="http://localhost:3000"
```
