import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { demoCases } from "./src/demoData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely and lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoint: Analyzer
app.post("/api/analyze", async (req, res) => {
  const { latest_user_message, user_energy, available_time_today_minutes } = req.body;

  if (!latest_user_message) {
    return res.status(400).json({ error: "No tasks provided" });
  }

  const ai = null; // getGeminiClient(); - Disabled/bypassed per requirements to guarantee fast & stable demo fallback with zero network or access key overhead

  if (ai) {
    try {
      // Dynamic prompt for actual Gemini parsing
      const systemInstruction = `
You are DeadlineOS, is an elite real-time AI Deadline Rescue Agent for a Hackathon target called 'The Last-Minute Life Saver'.
Your goal is to take a messy, raw text dump of deadlines and tasks, along with the user's current energy levels and focused time.
Generate a structured "Rescue Plan" in JSON format that minimizes cognitive burden, addresses immediate high-consequence items, and organizes active timelines into realistic chunks.

Core Design Directives:
1. "Do This Now" is a single highly impactful immediate action which is a "quick win" or an urgent block (e.g. paying an electricity bill, fixing a bug, submitting a draft). It must be visual and distinct.
2. Estimate time realistically. Keep total schedule hours within the user's stated available focused minutes.
3. Identify direct timing conflicts and place them in 'conflictWarnings'.
4. Break each major task into 2-4 highly actionable 'microActions'.
5. Provide 2 targeted 'drafts' (Slack/Teams chats or emails) to help them communicate delays, set boundaries, or delegate.
6. Provide general advice in 'recommendations'.

You must respond ONLY with clean JSON matching this JSON Schema:
{
  "risk": "low" | "medium" | "high" | "critical",
  "doThisNow": {
    "title": "Clear action title",
    "explanation": "Why this must be first",
    "durationMinutes": 30
  },
  "observation": "Overall scenario summary under 3 sentences.",
  "conflictWarnings": ["String warnings"],
  "schedule": [
    {
      "id": "unique-id",
      "time": "HH:MM - HH:MM format",
      "taskTitle": "Task Name",
      "duration": "e.g. 1h 30m",
      "description": "Specific action instructions",
      "category": "Admin / Critical / Comms"
    }
  ],
  "tasks": [
    {
      "id": "unique-task-id",
      "title": "Task title",
      "priority": "high" | "medium" | "low",
      "done": false,
      "delayed": false,
      "stuck": false,
      "skipped": false,
      "deadline": "Stated deadline",
      "category": "Standard category",
      "microActions": [
        { "id": "ma-id", "text": "Micro action text", "completed": false }
      ]
    }
  ],
  "drafts": [
    {
      "id": "draft-id",
      "title": "Draft purpose",
      "recipient": "Target recipient",
      "type": "email" | "message" | "document" | "code",
      "content": "Full template content"
    }
  ],
  "recommendations": ["Advice bullet 1", "Advice bullet 2"]
}
`;

      const prompt = `
User Context:
Messy Input: "${latest_user_message}"
Energy Level: ${user_energy}
Available Focused Time Today: ${available_time_today_minutes} minutes

Generate the complete JSON Rescue Plan now. Do not include markdown codeblocks (no \`\`\`json). Just return raw JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const responseText = response.text || "";
      const parsedPlan = JSON.parse(responseText.trim());
      return res.json({ status: "ok", plan: parsedPlan });

    } catch (err: any) {
      console.error("Gemini runtime error, falling back to static parsed analytics:", err);
      // Fallback response handled below
    }
  }

  // Graceful server-side fallback matching our prebaked records
  const matchedDemo = latest_user_message.toLowerCase();
  let selectedPlan;

  const studentCase = demoCases.find(c => c.key === 'student');
  const professionalCase = demoCases.find(c => c.key === 'professional');
  const entrepreneurCase = demoCases.find(c => c.key === 'entrepreneur');

  if (matchedDemo.includes("dsa assignment") || matchedDemo.includes("student crisis") || matchedDemo.includes("electricity bill") || matchedDemo.includes("student")) {
    selectedPlan = studentCase?.rescuePlan;
  } else if (matchedDemo.includes("client presentation") || matchedDemo.includes("working professional") || matchedDemo.includes("doctor appointment") || matchedDemo.includes("professional") || matchedDemo.includes("emails")) {
    selectedPlan = professionalCase?.rescuePlan;
  } else if (matchedDemo.includes("pitch deck") || matchedDemo.includes("entrepreneur") || matchedDemo.includes("gst payment")) {
    selectedPlan = entrepreneurCase?.rescuePlan;
  } else {
    // Generate a generic helpful plan for custom raw inserts that still feel gorgeous
    selectedPlan = {
      risk: "medium",
      doThisNow: {
        title: "Identify Immediate Small Steps",
        explanation: "Quickly break the biggest item on your list into tiny units of 15 minutes each to get past the initial friction.",
        durationMinutes: 15
      },
      observation: "You have parsed your schedule into DeadlineOS. We have indexed your tasks and resolved a balanced time-blocked routine tailored to your current energy level.",
      conflictWarnings: ["Unstructured tasks have potential timeline overlap, but no severe hard blocks found."],
      schedule: [
        {
          id: "g-1",
          time: "10:00 - 10:15",
          taskTitle: "Quick Win Mini-Action",
          duration: "15 min",
          description: "Clear a tiny blocker first to gain powerful cognitive momentum.",
          category: "Quick Win"
        },
        {
          id: "g-2",
          time: "10:15 - 12:00",
          taskTitle: "Primary Focus Window",
          duration: "1h 45m",
          description: "Turn off notifications. Focus on your highest priority task.",
          category: "Deep Work"
        },
        {
          id: "g-3",
          time: "12:00 - 12:30",
          taskTitle: "Administrative Cleanup & Review",
          duration: "30 min",
          description: "Execute emails, calendar bookings, and low-energy items.",
          category: "Admin / Polish"
        }
      ],
      tasks: [
        {
          id: "t-gen-1",
          title: "Highest Urgency Task Focus",
          priority: "high",
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: "End of Today",
          category: "Focus",
          microActions: [
            { id: "mg-1-1", text: "Isolate immediate first physical step", completed: false },
            { id: "mg-1-2", text: "Block out surrounding visual clutter", completed: false },
            { id: "mg-1-3", text: "Commence first 25-minute Pomodoro block", completed: false }
          ]
        },
        {
          id: "t-gen-2",
          title: "Secondary Routine Admin Tasks",
          priority: "medium",
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: "Flexible",
          category: "Admin",
          microActions: [
            { id: "mg-2-1", text: "Aggregate notifications into central document", completed: false },
            { id: "mg-2-2", text: "Draft responses to top two active senders", completed: false }
          ]
        }
      ],
      drafts: [
        {
          id: "d-gen-1",
          title: "Urgent Out-of-Office / Delay Notice",
          recipient: "Team / Lead Chat",
          type: "message",
          content: "Hi team, I am currently heads-down tackling an urgent high-priority deliverable today. I will be slow to respond to Slack/emails until 5 PM to protect this critical milestone. If there is a true red-alert emergency, please call me directly!"
        }
      ],
      recommendations: [
        "Work on one thing at a time. Multi-tasking under deadline pressure spreads quality thin.",
        "Take a brief 3-minute physical breathing break or drink water between task windows."
      ]
    };
  }

  res.json({ status: "ok", plan: selectedPlan, fallback: true });
});

// Serve compiled static assets or launch Vite development server
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DeadlineOS backend running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server", err);
});
