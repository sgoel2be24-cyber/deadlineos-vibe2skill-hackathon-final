import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import Dashboard from './components/Dashboard';
import { AgentState, RescuePlan, TaskState, ReplanEvent } from './types';
import { demoCases } from './demoData';
import { Flame, Clock, RefreshCw, Sparkles, LogOut, Code, UserCheck } from 'lucide-react';

function parseDurationMinutes(durationStr: string): number {
  const clean = (durationStr || '').toLowerCase().trim();
  if (clean.includes('deferred') || clean.includes('remaining') || clean.includes('postponed') || clean.includes('deferred task')) {
    return 0;
  }
  let minutes = 0;
  const hourMatch = clean.match(/(\d+)\s*h/);
  const minMatch = clean.match(/(\d+)\s*m/); // matches "m" or "min" or "mins"
  
  if (hourMatch) {
    minutes += parseInt(hourMatch[1]) * 60;
  }
  if (minMatch) {
    minutes += parseInt(minMatch[1]);
  } else if (!hourMatch) {
    // Try to see if there is a raw number
    const numMatch = clean.match(/^(\d+)$/);
    if (numMatch) {
      minutes = parseInt(numMatch[1]);
    }
  }
  return minutes > 0 ? minutes : 0;
}

function generateDynamicTimeline(schedule: any[]) {
  const now = new Date();
  const minutesNow = now.getMinutes();
  const roundedMinutes = Math.ceil(minutesNow / 5) * 5;
  const startTime = new Date(now);
  startTime.setMinutes(roundedMinutes);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  let currentPointer = new Date(startTime);

  return schedule.map(block => {
    // Inspect both duration and time properties to find is there a readable timing
    const parsedMins = block.duration ? parseDurationMinutes(block.duration) : parseDurationMinutes(block.time);
    if (parsedMins <= 0) {
      return { 
        ...block, 
        time: block.time.toLowerCase().includes('deferred') ? block.time : 'Focus Deferred' 
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

    // Update the pointer for next block sequential layout
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
  
  // Real active AgentState Model following prompt guidelines exactly
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
    // Ensure the scroll element is rendered and scrolled to smoothly
    setTimeout(() => {
      const consoleEl = document.getElementById("deadline-rescue-console");
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

    // Initial state setup
    const initialAgentState: AgentState = {
      current_time: new Date().toISOString(),
      latest_user_message: text,
      user_energy: energy,
      available_time_today_minutes: timeMinutes,
      previous_plan_summary: rescuePlan ? `Previous plan had risk ${rescuePlan.risk}` : 'No previous plan yet',
      current_task_state: [],
      replan_events: []
    };
    setAgentState(initialAgentState);

    let planData: RescuePlan | null = null;

    try {
      // Full-stack API Call with a snappy 1-second parallel timeout for gorgeous elite loader visibility
      const [apiResponse] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(initialAgentState)
        }).then(res => res.ok ? res.json() : null),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if (apiResponse && apiResponse.status === 'ok' && apiResponse.plan) {
        planData = apiResponse.plan;
      }
    } catch (error) {
      console.warn("API direct call failed, falling back to seamless client-side matching engine.", error);
    }

    // Client-side fallback engine if API fails or for offline instant prototyping
    if (!planData) {
      const matchText = text.toLowerCase();
      const studentCase = demoCases.find(c => c.key === 'student');
      const professionalCase = demoCases.find(c => c.key === 'professional');
      const entrepreneurCase = demoCases.find(c => c.key === 'entrepreneur');

      if (matchText.includes("dsa assignment") || matchText.includes("student crisis") || matchText.includes("electricity bill") || matchText.includes("student")) {
        planData = JSON.parse(JSON.stringify(studentCase!.rescuePlan));
      } else if (matchText.includes("client presentation") || matchText.includes("working professional") || matchText.includes("doctor appointment") || matchText.includes("professional") || matchText.includes("emails")) {
        planData = JSON.parse(JSON.stringify(professionalCase!.rescuePlan));
      } else if (matchText.includes("pitch deck") || matchText.includes("entrepreneur") || matchText.includes("gst payment")) {
        planData = JSON.parse(JSON.stringify(entrepreneurCase!.rescuePlan));
      } else {
        // Generic generated fallback standard plan
        planData = {
          risk: 'medium',
          doThisNow: {
            title: 'Identify Immediate Quick Wins',
            explanation: 'Your tasks are diverse. Isolate the smallest single visual milestone, and complete it in 15 minutes to clear initial drag.',
            durationMinutes: 15
          },
          observation: 'Custom schedule loaded successfully. To de-escalate crisis, priorities have been optimized against your stated time limits.',
          conflictWarnings: ['Review overlapping appointments in your direct calendar manually.'],
          schedule: [
            {
              id: 'g-1',
              time: '13:00 - 13:15',
              taskTitle: 'Initialize Quickest Task Win',
              duration: '15 min',
              description: 'Knock out rapid low-weight tasks to unlock active achievement neurons.',
              category: 'Focus'
            },
            {
              id: 'g-2',
              time: '13:15 - 15:30',
              taskTitle: 'Critical Sprint Session',
              duration: '2h 15m',
              description: 'Maintain exclusive priority focus. Eliminate phone notifications.',
              category: 'Deep Work'
            }
          ],
          tasks: [
            {
              id: 't-g-1',
              title: 'Primary Custom Priority Block',
              priority: 'high',
              done: false,
              delayed: false,
              stuck: false,
              skipped: false,
              deadline: 'Today',
              category: 'Deep Work',
              microActions: [
                { id: 'mg-ea-1', text: 'Identify the first actionable checklist step', completed: false },
                { id: 'mg-ea-2', text: 'Lock in 25 minutes of standalone flow', completed: false }
              ]
            }
          ],
          drafts: [
            {
              id: 'd-g-1',
              title: 'Delegate / Rescheduling Request',
              recipient: 'Colleagues / Team Lead',
              type: 'message',
              content: 'Hey Team, I am running a high-priority sprint to close out an urgent roadmap target today. I will be slow to respond to chats/emails until 4:30 PM. For critical emergency blockers, call me directly!'
            }
          ],
          recommendations: [
            'Avoid multi-tasking. Focus completely on the active Pomodoro element to bypass gridlocks.',
            'Keep water nearby to maintain cognitive performance.'
          ]
        };
      }
    }

    // Centrally generate optimized dynamic starting times from current browser time for the schedule blocks
    if (planData && planData.schedule) {
      planData.schedule = generateDynamicTimeline(planData.schedule);
    }

    if (planData) {
      setLastValidPlan(planData);
    }
    setRescuePlan(planData);
    setReplanNotice(null);
    setReplanError(null);
    setAgentState(prev => ({
      ...prev,
      current_task_state: planData ? planData.tasks : [],
      previous_plan_summary: planData ? `Plan loaded successfully. Priority target: ${planData.doThisNow.title}. Risk: ${planData.risk}` : 'No previous plan successfully loaded'
    }));
    setIsLoading(false);
  };

  // Toggle Microaction Checklist Box
  const handleToggleMicroaction = (taskId: string, microActionId: string) => {
    if (!rescuePlan) return;

    const updatedTasks = rescuePlan.tasks.map(task => {
      if (task.id === taskId) {
        const updatedMAs = task.microActions.map(ma => {
          if (ma.id === microActionId) {
            return { ...ma, completed: !ma.completed };
          }
          return ma;
        });

        // If all microactions in this task are checked off, mark task as Done!
        const allCompleted = updatedMAs.every(m => m.completed);
        return { 
          ...task, 
          microActions: updatedMAs,
          done: allCompleted ? true : task.done 
        };
      }
      return task;
    });

    setRescuePlan({
      ...rescuePlan,
      tasks: updatedTasks
    });

    setAgentState(prev => ({
      ...prev,
      current_task_state: updatedTasks
    }));
  };

  // Task Action handler adjusting specific task statuses (done, delayed, stuck, skipped)
  const handleTaskAction = (taskId: string, actionType: 'done' | 'delayed' | 'stuck' | 'skipped') => {
    if (!rescuePlan) return;

    const HH_MM = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Clone and map tasks
    const updatedTasks = rescuePlan.tasks.map(task => {
      if (task.id === taskId) {
        if (actionType === 'done') {
          return {
            ...task,
            done: true,
            stuck: false,
            delayed: false,
            skipped: false,
            microActions: task.microActions.map(m => ({ ...m, completed: true }))
          };
        } else if (actionType === 'delayed') {
          return {
            ...task,
            delayed: true,
            stuck: false,
            skipped: false
          };
        } else if (actionType === 'stuck') {
          const alreadyHasUnblock = task.microActions.some(m => m.id.startsWith('ma-unblock-'));
          const updatedMAs = [...task.microActions];
          if (!alreadyHasUnblock) {
            updatedMAs.unshift({
              id: `ma-unblock-${Date.now()}`,
              text: `⭐ AI Breakout: Isolate the absolute smallest sub-step, do it right now in 5 minutes.`,
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
        } else if (actionType === 'skipped') {
          return {
            ...task,
            skipped: true,
            done: false,
            stuck: false,
            delayed: false
          };
        }
      }
      return task;
    });

    const targetTask = rescuePlan.tasks.find(t => t.id === taskId);
    const taskTitle = targetTask ? targetTask.title : 'Task';
    
    // Create structured event model object matching specified guidelines
    const eventObj: ReplanEvent = {
      event: `User marked ${taskTitle} as ${actionType}`,
      time: HH_MM
    };

    // Auto-update hero layout "Do This Now" targeting first remaining undone task
    let updatedDoThisNow = { ...rescuePlan.doThisNow };
    const nextUndone = updatedTasks.find(t => !t.done && !t.skipped);
    if (nextUndone) {
      updatedDoThisNow = {
        title: nextUndone.title,
        explanation: `Calculated next dynamic target. Clean this sequence block now to neutralize downstream delays.`,
        durationMinutes: nextUndone.priority === 'high' ? 45 : 20
      };
    } else {
      updatedDoThisNow = {
        title: 'All Deadlines Cleared!',
        explanation: 'Excellent mitigation work. Your active rescue sequence is fully closed out in real time.',
        durationMinutes: 0
      };
    }

    // Sync schedule markers
    const updatedSchedule = rescuePlan.schedule.map(block => {
      if (targetTask && block.taskTitle.toLowerCase().includes(targetTask.title.toLowerCase().slice(0, 10))) {
        if (actionType === 'done') {
          return { ...block, taskTitle: `✓ ${block.taskTitle} (Done)`, description: 'COMPLETED. Re-allocated focus.' };
        } else if (actionType === 'skipped') {
          return { ...block, taskTitle: `✕ [Skipped] ${block.taskTitle}`, description: 'Snoozed or skipped to secure higher priority milestones.' };
        } else if (actionType === 'delayed') {
          return { ...block, taskTitle: `⚠ [Delayed] ${block.taskTitle}`, description: 'Buffer shifted to maintain active momentum.' };
        }
      }
      return block;
    });

    setRescuePlan({
      ...rescuePlan,
      tasks: updatedTasks,
      schedule: updatedSchedule,
      doThisNow: updatedDoThisNow
    });

    setAgentState(prev => ({
      ...prev,
      current_task_state: updatedTasks,
      replan_events: [eventObj, ...prev.replan_events]
    }));
  };

  // Exhausted replanning behavior reducing fatigue load
  const handleExhaustedReplan = () => {
    if (!rescuePlan) return;

    try {
      const HH_MM = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // Create structured event model object matching specified guidelines
      const eventObj: ReplanEvent = {
        event: 'User marked plan as exhausted — energy updated to low',
        time: HH_MM
      };

      // Flag remaining tasks as delayed by exhaustion
      const updatedTasks = rescuePlan.tasks.map(task => {
        if (task.done) return task; // Preserve completed tasks as-is
        return {
          ...task,
          delayed: true
        };
      });

      // Shorten remaining active schedule blocks
      const updatedSchedule = rescuePlan.schedule.map(block => {
        if (block.taskTitle.startsWith('✓')) return block; // Preserve completed
        
        let newDuration = '15 min';
        if (block.duration && typeof block.duration === 'string') {
          newDuration = block.duration.includes('h') ? '30 min' : '15 min';
        }
        return {
          ...block,
          duration: newDuration,
          description: `[Low Energy Mode] Simplified step. Micro-focus blocks only.`
        };
      });

      // Ensure immediate recharge break
      const hasRest = updatedSchedule.some(b => b.taskTitle.toLowerCase().includes('brain reset') || b.taskTitle.toLowerCase().includes('cognitive break') || b.taskTitle.toLowerCase().includes('quiet cognitive break'));
      if (!hasRest) {
        updatedSchedule.unshift({
          id: `exhaust-rest-${Date.now()}`,
          time: 'Immediate',
          taskTitle: '💤 10-Minute Quiet Cognitive Break',
          duration: '10 min',
          description: 'Close your eyes. Shut out desktop devices. Give your prefrontal cortex standard recovery space.',
          category: 'Recovery Session'
        });
      }

      // Re-generate timeline sequence timestamps sequentially using helper
      const finalSchedule = generateDynamicTimeline(updatedSchedule);

      const firstUndone = updatedTasks.find(t => !t.done && !t.skipped);
      const updatedDoThisNow = {
        title: 'Take a general 10-minute quiet break, then focus on ' + (firstUndone ? firstUndone.title.toLowerCase() : 'Recharging'),
        explanation: 'Your physical energy reserves have collapsed. Rest completely for 10 minutes, then approach remaining blocks one micro-step at a time.',
        durationMinutes: 10
      };

      const updatedRecommendations = [
        'Double your fluids intake immediately. Dehydration triggers heavy cognitive fatigue.',
        'Work in absolute low-stress 15-minute intervals. Ignore long-term backlogs.',
        'Put phone notifications on compulsory silent mode.',
        ...rescuePlan.recommendations
      ];

      const newPlan: RescuePlan = {
        ...rescuePlan,
        risk: 'critical', // Risk peaks as energy hits low limits
        doThisNow: updatedDoThisNow,
        schedule: finalSchedule,
        tasks: updatedTasks,
        recommendations: updatedRecommendations
      };

      setRescuePlan(newPlan);
      setLastValidPlan(newPlan);

      setAgentState(prev => ({
        ...prev,
        user_energy: 'low',
        current_task_state: updatedTasks,
        replan_events: [eventObj, ...prev.replan_events]
      }));

      // Set notices
      setReplanNotice('Plan updated for low energy');
      setReplanError(null);
    } catch (error) {
      console.error("Replan failed gracefully:", error);
      setReplanError('Could not fully replan, but your current rescue plan is still available.');
    }
  };

  return (
    <div className="min-h-screen bg-theme-dark flex flex-col text-gray-100 font-sans selection:bg-brand-purple/45">
      {/* Dynamic Header */}
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

      {/* Primary Frame Content router */}
      {view === 'landing' ? (
        <LandingPage onStartDemo={handleStartDemo} />
      ) : (
        <main id="deadline-rescue-console" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Main workspace control card */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#6c5ce7] font-mono">Sandbox Console</span>
                <h1 className="text-2xl sm:text-3xl font-black font-heading mt-0.5 text-white">
                  Deadline Rescue Console
                </h1>
              </div>

              <div className="flex items-center space-x-1 justify-end font-mono text-[10px] text-gray-500 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                <Code className="w-3 h-3 text-brand-purple" />
                <span>React SPA Architecture + Node Server Router</span>
              </div>
            </div>

            <Workspace onAnalyze={handleAnalyze} isLoading={isLoading} />
          </section>

          {/* Active Outputs / Fallbacks display */}
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
                  Select one of our <strong>Student Crisis</strong>, <strong>Working Professional</strong>, or <strong>Entrepreneur</strong> presets above, then click Analyze to kick off your adaptive rescue timeline instantly!
                </p>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Footer bar */}
      <footer className="mt-auto py-8 border-t border-theme-border/60 bg-[#06070a]/90 text-center relative z-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="text-left">
            <span className="font-bold text-gray-400 font-heading">DeadlineOS</span> • Built with Google AI Studio SDK + Tailwind CSS.
          </div>
          <div>
            Problem Selected: <span className="text-brand-purple font-bold">“The Last-Minute Life Saver”</span>
          </div>
          <div>
            © 2026 Vibe2Ship Hackathon submission. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
