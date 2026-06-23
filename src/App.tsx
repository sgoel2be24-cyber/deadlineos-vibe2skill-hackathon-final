import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import Dashboard from './components/Dashboard';
import { AgentState, RescuePlan, ReplanEvent } from './types';
import { demoCases, getFallbackRescuePlan } from './demoData';
import { Flame, Sparkles, LogOut, Code } from 'lucide-react';

function parseDurationMinutes(durationStr: string): number {
  const clean = (durationStr || '').toLowerCase().trim();
  if (clean.includes('deferred') || clean.includes('remaining') || clean.includes('postponed')) {
    return 0;
  }

  let minutes = 0;
  const hourMatch = clean.match(/(\d+)\s*h/);
  const minMatch = clean.match(/(\d+)\s*m/);

  if (hourMatch) {
    minutes += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    minutes += parseInt(minMatch[1], 10);
  } else if (!hourMatch) {
    const numMatch = clean.match(/^(\d+)$/);
    if (numMatch) {
      minutes = parseInt(numMatch[1], 10);
    }
  }

  return minutes > 0 ? minutes : 0;
}

function generateDynamicTimeline(schedule: RescuePlan['schedule']) {
  const now = new Date();
  const minutesNow = now.getMinutes();
  const roundedMinutes = Math.ceil(minutesNow / 5) * 5;
  const startTime = new Date(now);
  startTime.setMinutes(roundedMinutes);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  let currentPointer = new Date(startTime);

  return schedule.map(block => {
    const parsedMins = block.duration ? parseDurationMinutes(block.duration) : parseDurationMinutes(block.time);
    if (parsedMins <= 0) {
      return {
        ...block,
        time: block.time.toLowerCase().includes('deferred') || block.time.toLowerCase().includes('postponed')
          ? block.time
          : 'Focus Deferred'
      };
    }

    const formatTime = (d: Date) => {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    const startStr = formatTime(currentPointer);
    const endPointer = new Date(currentPointer.getTime() + parsedMins * 60 * 1000);
    const endStr = formatTime(endPointer);

    const updatedBlock = {
      ...block,
      time: `${startStr} - ${endStr}`
    };

    currentPointer = endPointer;
    return updatedBlock;
  });
}

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rescuePlan, setRescuePlan] = useState<RescuePlan | null>(null);
  const [lastValidPlan, setLastValidPlan] = useState<RescuePlan | null>(null);
  const [replanNotice, setReplanNotice] = useState<string | null>(null);
  const [replanError, setReplanError] = useState<string | null>(null);

  const [agentState, setAgentState] = useState<AgentState>({
    current_time: new Date().toISOString(),
    latest_user_message: '',
    user_energy: 'medium',
    available_time_today_minutes: 300,
    previous_plan_summary: 'No previous plan yet',
    current_task_state: [],
    replan_events: []
  });

  const handleStartDemo = () => {
    setView('app');
    window.setTimeout(() => {
      const consoleEl = document.getElementById('deadline-rescue-console');
      if (consoleEl) {
        consoleEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleAnalyze = async (text: string, energy: 'low' | 'medium' | 'high', timeMinutes: number) => {
    setIsLoading(true);
    setRescuePlan(null);

    try {
      const planData = getFallbackRescuePlan(text);
      planData.schedule = generateDynamicTimeline(planData.schedule);

      setLastValidPlan(planData);
      setRescuePlan(planData);
      setReplanNotice(null);
      setReplanError(null);
      setAgentState(prev => ({
        ...prev,
        current_time: new Date().toISOString(),
        latest_user_message: text,
        user_energy: energy,
        available_time_today_minutes: timeMinutes,
        current_task_state: planData.tasks,
        previous_plan_summary: `Plan loaded successfully. Priority target: ${planData.doThisNow.title}. Risk: ${planData.risk}`
      }));
    } catch (error) {
      console.error('Fallback analysis failed gracefully:', error);
      setRescuePlan(lastValidPlan);
      setReplanError('Analysis could not refresh, but your last rescue plan is still available.');
    } finally {
      window.setTimeout(() => setIsLoading(false), 650);
    }
  };

  const handleToggleMicroaction = (taskId: string, microActionId: string) => {
    if (!rescuePlan) return;

    try {
      const updatedTasks = rescuePlan.tasks.map(task => {
        if (task.id !== taskId) return task;

        const updatedMAs = task.microActions.map(ma => (
          ma.id === microActionId ? { ...ma, completed: !ma.completed } : ma
        ));

        const allCompleted = updatedMAs.every(m => m.completed);
        return {
          ...task,
          microActions: updatedMAs,
          done: allCompleted ? true : task.done
        };
      });

      const newPlan = {
        ...rescuePlan,
        tasks: updatedTasks
      };

      setRescuePlan(newPlan);
      setLastValidPlan(newPlan);
      setAgentState(prev => ({
        ...prev,
        current_task_state: updatedTasks
      }));
    } catch (error) {
      console.error('Micro-action update failed gracefully:', error);
      setReplanError('Could not update that checklist item, but your current plan is still available.');
    }
  };

  const handleTaskAction = (taskId: string, actionType: 'done' | 'delayed' | 'stuck' | 'skipped') => {
    if (!rescuePlan) return;

    try {
      const HH_MM = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const updatedTasks = rescuePlan.tasks.map(task => {
        if (task.id !== taskId) return task;

        if (actionType === 'done') {
          return {
            ...task,
            done: true,
            stuck: false,
            delayed: false,
            skipped: false,
            microActions: task.microActions.map(m => ({ ...m, completed: true }))
          };
        }

        if (actionType === 'delayed') {
          return {
            ...task,
            delayed: true,
            stuck: false,
            skipped: false
          };
        }

        if (actionType === 'stuck') {
          const alreadyHasUnblock = task.microActions.some(m => m.id.startsWith('ma-unblock-'));
          const updatedMAs = [...task.microActions];
          if (!alreadyHasUnblock) {
            updatedMAs.unshift({
              id: `ma-unblock-${Date.now()}`,
              text: 'AI Breakout: Isolate the absolute smallest sub-step, do it right now in 5 minutes.',
              completed: false
            });
          }
          return {
            ...task,
            stuck: true,
            delayed: false,
            skipped: false,
            microActions: updatedMAs
          };
        }

        return {
          ...task,
          skipped: true,
          done: false,
          stuck: false,
          delayed: false
        };
      });

      const targetTask = rescuePlan.tasks.find(t => t.id === taskId);
      const taskTitle = targetTask ? targetTask.title : 'Task';
      const eventObj: ReplanEvent = {
        event: `User marked ${taskTitle} as ${actionType}`,
        time: HH_MM
      };

      let updatedDoThisNow = { ...rescuePlan.doThisNow };
      const nextUndone = updatedTasks.find(t => !t.done && !t.skipped);
      if (nextUndone) {
        updatedDoThisNow = {
          title: nextUndone.title,
          explanation: 'Calculated next dynamic target. Clean this sequence block now to neutralize downstream delays.',
          durationMinutes: nextUndone.priority === 'high' ? 45 : 20
        };
      } else {
        updatedDoThisNow = {
          title: 'All Deadlines Cleared!',
          explanation: 'Excellent mitigation work. Your active rescue sequence is fully closed out in real time.',
          durationMinutes: 0
        };
      }

      const updatedSchedule = rescuePlan.schedule.map(block => {
        if (!targetTask || !block.taskTitle.toLowerCase().includes(targetTask.title.toLowerCase().slice(0, 10))) {
          return block;
        }

        if (actionType === 'done') {
          return { ...block, taskTitle: `Done: ${block.taskTitle}`, description: 'COMPLETED. Re-allocated focus.' };
        }
        if (actionType === 'skipped') {
          return { ...block, taskTitle: `[Skipped] ${block.taskTitle}`, description: 'Snoozed or skipped to secure higher priority milestones.' };
        }
        if (actionType === 'delayed') {
          return { ...block, taskTitle: `[Delayed] ${block.taskTitle}`, description: 'Buffer shifted to maintain active momentum.' };
        }
        return block;
      });

      const newPlan = {
        ...rescuePlan,
        tasks: updatedTasks,
        schedule: updatedSchedule,
        doThisNow: updatedDoThisNow
      };

      setRescuePlan(newPlan);
      setLastValidPlan(newPlan);
      setReplanError(null);
      setAgentState(prev => ({
        ...prev,
        current_task_state: updatedTasks,
        replan_events: [eventObj, ...prev.replan_events]
      }));
    } catch (error) {
      console.error('Task action failed gracefully:', error);
      setRescuePlan(lastValidPlan || rescuePlan);
      setReplanError('Could not update that task action, but your current rescue plan is still available.');
    }
  };

  const handleExhaustedReplan = () => {
    if (!rescuePlan) return;

    try {
      const HH_MM = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const eventObj: ReplanEvent = {
        event: 'User marked plan as exhausted - energy updated to low',
        time: HH_MM
      };

      const updatedTasks = rescuePlan.tasks.map(task => {
        if (task.done) return task;
        return {
          ...task,
          delayed: true
        };
      });

      const updatedSchedule = rescuePlan.schedule.map(block => {
        if (block.taskTitle.startsWith('Done:')) return block;

        let newDuration = '15 min';
        if (block.duration && typeof block.duration === 'string') {
          newDuration = block.duration.includes('h') ? '30 min' : '15 min';
        }
        return {
          ...block,
          duration: newDuration,
          description: '[Low Energy Mode] Simplified step. Micro-focus blocks only.'
        };
      });

      const hasRest = updatedSchedule.some(b =>
        b.taskTitle.toLowerCase().includes('brain reset') ||
        b.taskTitle.toLowerCase().includes('cognitive break') ||
        b.taskTitle.toLowerCase().includes('quiet cognitive break')
      );

      if (!hasRest) {
        updatedSchedule.unshift({
          id: `exhaust-rest-${Date.now()}`,
          time: 'Immediate',
          taskTitle: '10-Minute Quiet Cognitive Break',
          duration: '10 min',
          description: 'Close your eyes. Shut out desktop devices. Give your prefrontal cortex standard recovery space.',
          category: 'Recovery Session'
        });
      }

      const finalSchedule = generateDynamicTimeline(updatedSchedule);
      const firstUndone = updatedTasks.find(t => !t.done && !t.skipped);
      const updatedDoThisNow = {
        title: 'Take a general 10-minute quiet break, then focus on ' + (firstUndone ? firstUndone.title.toLowerCase() : 'recharging'),
        explanation: 'Your physical energy reserves have collapsed. Rest completely for 10 minutes, then approach remaining blocks one micro-step at a time.',
        durationMinutes: 10
      };

      const newPlan: RescuePlan = {
        ...rescuePlan,
        risk: 'critical',
        doThisNow: updatedDoThisNow,
        schedule: finalSchedule,
        tasks: updatedTasks,
        recommendations: [
          'Double your fluids intake immediately. Dehydration triggers heavy cognitive fatigue.',
          'Work in absolute low-stress 15-minute intervals. Ignore long-term backlogs.',
          'Put phone notifications on compulsory silent mode.',
          ...rescuePlan.recommendations
        ]
      };

      setRescuePlan(newPlan);
      setLastValidPlan(newPlan);
      setAgentState(prev => ({
        ...prev,
        user_energy: 'low',
        current_task_state: updatedTasks,
        replan_events: [eventObj, ...prev.replan_events]
      }));
      setReplanNotice('Plan updated for low energy');
      setReplanError(null);
    } catch (error) {
      console.error('Replan failed gracefully:', error);
      setRescuePlan(lastValidPlan || rescuePlan);
      setReplanError('Could not fully replan, but your current rescue plan is still available.');
    }
  };

  return (
    <div className="min-h-screen bg-theme-dark flex flex-col text-gray-100 font-sans selection:bg-brand-purple/45">
      {view === 'app' && (
        <header className="sticky top-0 z-40 bg-theme-dark/90 backdrop-blur-md border-b border-theme-border py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('landing')}>
              <div className="p-1.5 bg-gradient-to-tr from-brand-purple to-brand-cyan rounded-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-heading tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Deadline<span className="text-brand-purple font-black">OS</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded bg-[#0f1118] border border-theme-border text-[10px] font-mono text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                SYSTEM LIVE
              </span>

              <button
                onClick={() => setView('landing')}
                className="px-3.5 py-1.5 bg-theme-card border border-theme-border rounded-lg text-xs font-semibold hover:text-white hover:bg-white/5 flex items-center space-x-1.5 transition-all text-gray-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {view === 'landing' ? (
        <LandingPage onStartDemo={handleStartDemo} />
      ) : (
        <main id="deadline-rescue-console" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#6c5ce7] font-mono">Sandbox Console</span>
                <h1 className="text-2xl sm:text-3xl font-black font-heading mt-0.5 text-white">
                  Deadline Rescue Console
                </h1>
              </div>

              <div className="hidden sm:flex items-center space-x-1 justify-end font-mono text-[10px] text-gray-500 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                <Code className="w-3 h-3 text-brand-purple" />
                <span>React SPA Architecture + Node Server Router</span>
              </div>
            </div>

            <Workspace onAnalyze={handleAnalyze} isLoading={isLoading} />
          </section>

          <section className="relative">
            {isLoading ? (
              <div className="p-16 text-center bg-theme-card border border-theme-border rounded-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
                <div>
                  <h4 className="text-base font-bold text-gray-200">Re-indexing timeline events...</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto space-y-1">
                    Analyzing constraints against stated energy parameters and late-night banking system cutoffs.
                  </p>
                </div>
              </div>
            ) : (rescuePlan || lastValidPlan) ? (
              <Dashboard
                plan={rescuePlan || lastValidPlan || demoCases.find(c => c.key === 'student')!.rescuePlan}
                onToggleMicroaction={handleToggleMicroaction}
                onTaskAction={handleTaskAction}
                onExhaustedReplan={handleExhaustedReplan}
                replanEvents={agentState.replan_events}
                replanNotice={replanNotice}
                replanError={replanError}
                onClearReplanNotice={() => {
                  setReplanNotice(null);
                  setReplanError(null);
                }}
              />
            ) : (
              <div className="p-12 text-center bg-theme-card/30 border border-theme-border/60 border-dashed rounded-xl">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-gray-400">Empty State: Sandbox Standby</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Select one of our <strong>Student Crisis</strong>, <strong>Working Professional</strong>, or <strong>Entrepreneur</strong> presets above, then click Analyze to kick off your adaptive rescue timeline instantly.
                </p>
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="mt-auto py-8 border-t border-theme-border/60 bg-[#06070a]/90 text-center relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="text-left">
            <span className="font-bold text-gray-400 font-heading">DeadlineOS</span> - Built with Google AI Studio Build Mode + Tailwind CSS.
          </div>
          <div>
            Problem Selected: <span className="text-brand-purple font-bold">"The Last-Minute Life Saver"</span>
          </div>
          <div>
            2026 Vibe2Ship / Vibe2Skill Hackathon submission.
          </div>
        </div>
      </footer>
    </div>
  );
}
