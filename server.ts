import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getFallbackRescuePlan } from './src/demoData';
import { AgentState, RescuePlan } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const GEMINI_TIMEOUT_MS = 7500;

app.use(express.json());

function fallbackResponse(input: string) {
  return { status: 'ok', plan: getFallbackRescuePlan(input), fallback: true, mode: 'fallback' };
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function cleanRisk(value: unknown): RescuePlan['risk'] {
  const risk = String(value || '').toLowerCase();
  if (risk === 'low' || risk === 'medium' || risk === 'high' || risk === 'critical') return risk;
  return 'medium';
}

function cleanPriority(value: unknown): 'high' | 'medium' | 'low' {
  const priority = String(value || '').toLowerCase();
  if (priority === 'high' || priority === 'medium' || priority === 'low') return priority;
  return 'medium';
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function normalizeGeminiPlan(raw: any): RescuePlan | null {
  if (!raw || typeof raw !== 'object') return null;

  const doNow = raw.do_now || raw.doThisNow;
  const schedule = raw.rescue_schedule || raw.schedule;
  const tasks = raw.tasks;
  const drafts = raw.smart_drafts || raw.drafts;

  if (!doNow || !Array.isArray(schedule) || !Array.isArray(tasks) || !Array.isArray(drafts)) {
    return null;
  }

  const rescuePlan: RescuePlan = {
    risk: cleanRisk(raw.overall_risk_level || raw.risk),
    doThisNow: {
      title: String(doNow.title || doNow.action || doNow.task || 'Start the highest-impact task now'),
      explanation: String(doNow.explanation || doNow.reason || 'This is the fastest way to reduce deadline risk.'),
      durationMinutes: Number(doNow.durationMinutes || doNow.duration_minutes || doNow.estimated_minutes || 25)
    },
    observation: String(raw.agent_observation || raw.overall_summary || raw.observation || 'DeadlineOS created a custom rescue plan from your task dump.'),
    conflictWarnings: asArray(raw.conflicts || raw.conflictWarnings).map((item) => String(item)).filter(Boolean),
    schedule: asArray<any>(schedule).map((block, index) => ({
      id: String(block.id || `g-schedule-${index + 1}`),
      time: String(block.time || block.window || 'Next available block'),
      taskTitle: String(block.taskTitle || block.task_title || block.title || 'Focused rescue block'),
      duration: String(block.duration || block.duration_minutes ? `${block.duration || block.duration_minutes} min` : '25 min'),
      description: String(block.description || block.instructions || 'Work on the highest priority next step.'),
      category: String(block.category || 'Focus')
    })),
    tasks: asArray<any>(tasks).map((task, index) => ({
      id: String(task.id || `g-task-${index + 1}`),
      title: String(task.title || task.task || `Task ${index + 1}`),
      priority: cleanPriority(task.priority),
      done: false,
      delayed: false,
      stuck: false,
      skipped: false,
      deadline: String(task.deadline || 'Today'),
      category: String(task.category || 'General'),
      microActions: asArray<any>(task.microActions || task.micro_actions).map((action, actionIndex) => ({
        id: String(action.id || `g-task-${index + 1}-micro-${actionIndex + 1}`),
        text: String(action.text || action.action || action),
        completed: false
      })).filter(action => action.text.trim().length > 0)
    })),
    drafts: asArray<any>(drafts).map((draft, index) => ({
      id: String(draft.id || `g-draft-${index + 1}`),
      title: String(draft.title || draft.purpose || `Draft ${index + 1}`),
      recipient: String(draft.recipient || 'Team / stakeholder'),
      type: ['email', 'message', 'document', 'code'].includes(String(draft.type)) ? draft.type : 'message',
      content: String(draft.content || draft.body || draft.message || '')
    })),
    recommendations: asArray(raw.recommendations).map(item => String(item)).filter(Boolean)
  };

  if (
    !rescuePlan.doThisNow.title ||
    rescuePlan.schedule.length === 0 ||
    rescuePlan.tasks.length === 0 ||
    rescuePlan.drafts.length === 0 ||
    rescuePlan.tasks.some(task => task.microActions.length === 0)
  ) {
    return null;
  }

  if (rescuePlan.conflictWarnings.length === 0) {
    rescuePlan.conflictWarnings = ['No hard conflict detected, but protect the schedule from new interruptions.'];
  }
  if (rescuePlan.recommendations.length === 0) {
    rescuePlan.recommendations = ['Keep the next action small enough to start immediately.'];
  }

  return rescuePlan;
}

async function analyzeWithGemini(agentState: AgentState): Promise<RescuePlan | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
You are DeadlineOS, an AI Deadline Rescue Agent for the hackathon problem "The Last-Minute Life Saver".

Analyze this agent state:
${JSON.stringify(agentState, null, 2)}

Return strict JSON only. Do not include markdown, prose, comments, or code fences.

Required JSON shape:
{
  "overall_summary": "brief summary",
  "overall_risk_level": "low | medium | high | critical",
  "agent_observation": "specific observation",
  "do_now": {
    "title": "single immediate action",
    "explanation": "why this comes first",
    "duration_minutes": 25
  },
  "conflicts": ["conflict or risk warning"],
  "tasks": [
    {
      "id": "task-1",
      "title": "task title",
      "priority": "high | medium | low",
      "deadline": "deadline text",
      "category": "category",
      "micro_actions": [
        { "id": "task-1-a", "text": "small action" }
      ]
    }
  ],
  "rescue_schedule": [
    {
      "id": "block-1",
      "time": "HH:MM - HH:MM or relative block",
      "task_title": "task/block title",
      "duration": "25 min",
      "description": "what to do",
      "category": "Focus"
    }
  ],
  "smart_drafts": [
    {
      "id": "draft-1",
      "title": "draft title",
      "recipient": "recipient",
      "type": "email | message | document | code",
      "content": "ready-to-send draft"
    }
  ],
  "recommendations": ["practical recommendation"],
  "replan_trigger_suggestions": ["when to replan"]
}
`;

  const geminiCall = ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  });

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Gemini request timed out')), GEMINI_TIMEOUT_MS);
  });

  const response = await Promise.race([geminiCall, timeout]);
  const text = response.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(stripJsonFences(text));
    return normalizeGeminiPlan(parsed);
  } catch (error) {
    console.warn('Gemini JSON parse failed; using fallback.', error);
    return null;
  }
}

app.post('/api/analyze', async (req, res) => {
  const agentState = req.body as Partial<AgentState>;
  const latestUserMessage = agentState?.latest_user_message;

  if (!latestUserMessage || typeof latestUserMessage !== 'string') {
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
    const geminiPlan = await analyzeWithGemini({
      current_time: String(agentState.current_time || new Date().toISOString()),
      latest_user_message: latestUserMessage,
      user_energy: agentState.user_energy === 'low' || agentState.user_energy === 'high' ? agentState.user_energy : 'medium',
      available_time_today_minutes: Number(agentState.available_time_today_minutes || 300),
      previous_plan_summary: String(agentState.previous_plan_summary || 'No previous plan yet'),
      current_task_state: Array.isArray(agentState.current_task_state) ? agentState.current_task_state : [],
      replan_events: Array.isArray(agentState.replan_events) ? agentState.replan_events : []
    });

    if (geminiPlan) {
      return res.json({ status: 'ok', plan: geminiPlan, fallback: false, mode: 'gemini', model: GEMINI_MODEL });
    }

    return res.json(fallbackResponse(latestUserMessage));
  } catch (error) {
    console.warn('Analyze endpoint fell back safely.', error);
    return res.json(fallbackResponse(latestUserMessage));
  }
});

async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DeadlineOS backend running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error('Failed to start server', err);
});
