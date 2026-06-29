import React, { useState, useEffect } from 'react';
import { 
  RescuePlan, 
  ReplanEvent,
  AnalysisMode
} from '../types';
import { 
  createGoogleCalendarUrl, 
  copyToClipboard 
} from '../utils';
import { 
  ShieldAlert, 
  Flame,
  CheckCircle2, 
  Calendar, 
  Clipboard, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  RefreshCcw, 
  Copy, 
  Info,
  Layers,
  FileCode,
  CornerDownRight,
} from 'lucide-react';

interface DashboardProps {
  plan: RescuePlan;
  onToggleMicroaction: (taskId: string, microActionId: string) => void;
  onTaskAction: (taskId: string, actionType: 'done' | 'delayed' | 'stuck' | 'skipped') => void;
  onExhaustedReplan: () => void;
  replanEvents: ReplanEvent[];
  replanNotice?: string | null;
  replanError?: string | null;
  analysisMode?: AnalysisMode;
  onClearReplanNotice?: () => void;
}

export default function Dashboard({ 
  plan, 
  onToggleMicroaction,
  onTaskAction,
  onExhaustedReplan,
  replanEvents,
  replanNotice,
  replanError,
  analysisMode = 'fallback',
  onClearReplanNotice
}: DashboardProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);
  const [showPlanUpdated, setShowPlanUpdated] = useState(false);

  useEffect(() => {
    if (replanEvents.length > 0) {
      setShowPlanUpdated(true);
      const timer = setTimeout(() => setShowPlanUpdated(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [replanEvents.length]);

  const riskColor = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    critical: 'text-red-400 bg-red-400/10 border-red-400/30 animate-pulse'
  }[plan.risk];

  const modeBadge = {
    demo: 'Fast Demo Mode',
    gemini: 'Gemini Analysis',
    fallback: 'Safe Fallback Mode'
  }[analysisMode];

  const handleCopyDraft = (content: string, id: string) => {
    copyToClipboard(content).then(success => {
      if (success) {
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    });
  };

  const handleCopyEntirePlan = () => {
    let rawText = `=== DEADLINEOS AI RESCUE PLAN ===\n`;
    rawText += `RISK LEVEL: ${plan.risk.toUpperCase()}\n\n`;
    rawText += `--- HERO TASK ---\n`;
    rawText += `DO THIS NOW: ${plan.doThisNow.title}\n`;
    rawText += `EXPLANATION: ${plan.doThisNow.explanation}\n`;
    rawText += `ESTIMATED EFFORT: ${plan.doThisNow.durationMinutes} min\n\n`;
    
    rawText += `--- OBSERVER INTELLIGENCE ---\n`;
    rawText += `${plan.observation}\n\n`;
    
    rawText += `--- SCHEDULE TIMESCALES ---\n`;
    plan.schedule.forEach((block) => {
      rawText += `[${block.time}] ${block.taskTitle} (${block.duration}) - ${block.description}\n`;
    });
    
    rawText += `\n--- MICROACTION ITEMS ---\n`;
    plan.tasks.forEach((task) => {
      rawText += ` - [${task.done ? 'X' : ' '}] ${task.title} (${task.priority} priority - ${task.deadline})\n`;
      task.microActions.forEach((item) => {
        rawText += `    * [${item.completed ? 'X' : ' '}] ${item.text}\n`;
      });
    });

    copyToClipboard(rawText).then(success => {
      if (success) {
        setCopiedPlan(true);
        setTimeout(() => setCopiedPlan(false), 2500);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Risk Alert Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#0c0e14] border border-theme-border rounded-xl gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-xl shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-gray-500 uppercase">Analysis Complete</span>
              <span className={`px-2.5 py-0.5 text-xs uppercase font-extrabold tracking-wider border rounded-full ${riskColor}`}>
                {plan.risk} Risk Detected
              </span>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded-full text-brand-cyan bg-brand-cyan/10 border-brand-cyan/25">
                {modeBadge}
              </span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white mt-1">AI Deadline Rescue Plan</h2>
          </div>
        </div>

        <button
          onClick={handleCopyEntirePlan}
          className="px-4 py-2 bg-theme-card border border-theme-border rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-[#151722] active:scale-95 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
        >
          {copiedPlan ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copy Success!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4 text-brand-purple" />
              <span>Copy Full Rescue Plan</span>
            </>
          )}
        </button>
      </div>

      {replanNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-500/5 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-xs sm:text-sm">{replanNotice}</span>
          </div>
          {onClearReplanNotice && (
            <button 
              type="button"
              onClick={onClearReplanNotice} 
              className="text-gray-400 hover:text-white px-2 py-1 text-xs font-mono font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {replanError && (
        <div className="bg-red-500/10 border border-red-500/35 text-red-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-red-500/5 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-semibold text-xs sm:text-sm">{replanError}</span>
          </div>
          {onClearReplanNotice && (
            <button 
              type="button"
              onClick={onClearReplanNotice} 
              className="text-gray-400 hover:text-white px-2 py-1 text-xs font-mono font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!replanNotice && !replanError && showPlanUpdated && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-500/5 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-xs sm:text-sm">Replanned with latest status successfully!</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowPlanUpdated(false)} 
            className="text-gray-400 hover:text-white px-2 py-1 text-xs font-mono font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Card: Do This Now */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-[#160f15]/80 via-[#221013]/70 to-[#10141c]/90 border border-red-500/30 relative overflow-hidden shadow-xl hover:border-red-500/50 transition-all glow-red">
        {/* Blurry circular highlight */}
        <div className="absolute top-1/2 right-[-5%] w-60 h-60 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>Recommended Priority: DO THIS NOW</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mb-3">
            {plan.doThisNow.title}
          </h3>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            {plan.doThisNow.explanation}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
              <Clock className="w-4.5 h-4.5 text-red-400" />
              <span className="font-mono text-gray-200">Target Duration: {plan.doThisNow.durationMinutes} Minutes</span>
            </div>

            <a
              href={createGoogleCalendarUrl(plan.doThisNow.title, plan.doThisNow.durationMinutes, plan.doThisNow.explanation)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold font-heading text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Link direct to Google Calendar</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Observation and Conflict Alerts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-xl bg-theme-card border border-theme-border/80">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-brand-purple" />
            <h4 className="text-sm font-bold font-mono text-gray-400 uppercase">Agent Observation Log</h4>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            {plan.observation}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#1b1510]/50 border border-yellow-500/20">
          <div className="flex items-center space-x-2 text-yellow-500 mb-3">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
            <h4 className="text-sm font-bold font-mono text-yellow-400 uppercase">Conflict Alerts</h4>
          </div>
          {plan.conflictWarnings.length > 0 ? (
            <ul className="space-y-3">
              {plan.conflictWarnings.map((warning, i) => (
                <li key={i} className="text-xs text-yellow-500 leading-relaxed font-sans flex items-start space-x-2">
                  <span className="text-yellow-500 select-none mt-0.5">-</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-gray-500 italic block">No immediate timetable overlapping detected.</span>
          )}
        </div>
      </div>

      {/* Grid: Schedule and Milestones task checkers */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Real-time Rescue Timeline Schedule */}
        <div className="p-6 rounded-2xl bg-theme-card border border-theme-border flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-theme-border mb-6">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-lg font-bold font-heading text-white">Rescue Block Schedule</h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-full">
                {plan.schedule.length} Time blocks
              </span>
            </div>

            <div className="relative border-l border-theme-border/80 pl-4 ml-2.5 space-y-6">
              {plan.schedule.map((block) => {
                const isHero = block.taskTitle.toLowerCase().includes(plan.doThisNow.title.slice(0, 10).toLowerCase());
                return (
                  <div key={block.id} className="relative group">
                    {/* Circle Node on Timeline */}
                    <span className={`absolute top-1.5 left-[-22.5px] w-3 h-3 rounded-full border transition-all ${
                      isHero 
                        ? 'bg-red-500 border-red-500 ring-4 ring-red-500/15' 
                        : 'bg-theme-dark border-theme-border group-hover:border-brand-purple'
                    }`} />
                    
                    <div className={`p-4 rounded-xl border transition-all ${
                      isHero 
                        ? 'bg-[#1e1315]/40 border-red-500/20' 
                        : 'bg-theme-dark/40 border-theme-border/60 group-hover:border-theme-border/90'
                    }`}>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div>
                          <span className="text-[11px] font-mono opacity-65 font-bold tracking-tight bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">
                            {block.time}
                          </span>
                          <span className="ml-2 text-[10px] font-mono text-gray-500 italic">({block.duration})</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-brand-cyan">
                          {block.category}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                        {block.taskTitle}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                        {block.description}
                      </p>
                      
                      {/* Deep-link direct export button */}
                      <div className="mt-2.5 pt-2.5 border-t border-theme-border/30 flex justify-end">
                        <a
                          href={createGoogleCalendarUrl(block.taskTitle, 30, block.description)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-[10px] text-brand-cyan hover:text-white transition-colors"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Export Block</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-theme-border mt-6">
            <p className="text-xs text-gray-500 flex items-center space-x-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Timings calculated relative to your stated target bandwidth and available energy limits.</span>
            </p>
          </div>
        </div>

        {/* Milestones and Interactive Checklists */}
        <div className="p-6 rounded-2xl bg-theme-card border border-theme-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-theme-border mb-6">
              <div className="flex items-center space-x-2.5">
                <Layers className="w-5 h-5 text-brand-purple" />
                <h3 className="text-lg font-bold font-heading text-white">Active Task Breakdown</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-500 italic">Click checkbox to complete</span>
            </div>

            <div className="space-y-4">
              {plan.tasks.map((task) => {
                // Determine style based on priority
                const borderByPriority = task.done 
                  ? 'border-emerald-500/20 bg-emerald-500/[0.01]' 
                  : {
                    high: 'border-red-500/20',
                    medium: 'border-yellow-500/20',
                    low: 'border-theme-border'
                  }[task.priority];

                return (
                  <div key={task.id} className={`p-4 rounded-xl border transition-all ${borderByPriority} ${task.skipped ? 'opacity-40 italic' : ''}`}>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded font-mono ${
                            task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            Deadline: {task.deadline}
                          </span>
                        </div>
                        <h4 className={`text-sm font-semibold mt-1.5 ${task.done ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {task.title}
                        </h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {task.stuck && (
                          <span className="px-1.5 py-0.5 text-[8px] uppercase font-mono font-bold bg-[#381611]/80 text-orange-400 border border-orange-500/20 rounded">
                            Stuck
                          </span>
                        )}
                        {task.delayed && (
                          <span className="px-1.5 py-0.5 text-[8px] uppercase font-mono font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                            Delayed
                          </span>
                        )}
                        {task.skipped && (
                          <span className="px-1.5 py-0.5 text-[8px] uppercase font-mono font-bold bg-white/5 text-gray-500 border border-white/5 rounded">
                            Skipped
                          </span>
                        )}
                        {task.done && (
                          <span className="px-1.5 py-0.5 text-[8px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center space-x-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Done</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Checkbox columns of micro action listings */}
                    <div className="space-y-2 mt-3 pl-2.5 border-l border-theme-border/50">
                      {task.microActions && task.microActions.map((item) => (
                        <label 
                          key={item.id} 
                          className={`flex items-start space-x-2.5 text-xs select-none cursor-pointer group/item py-0.5 ${
                            item.completed ? 'text-gray-500' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => onToggleMicroaction(task.id, item.id)}
                            className="w-3.5 h-3.5 rounded border-theme-border bg-theme-dark text-brand-purple focus:ring-brand-purple/50 focus:ring-offset-[#12131a] mt-0.5 filter brightness-90 cursor-pointer"
                          />
                          <span className={`${item.completed ? 'line-through' : ''}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Task Actions: Done, Delayed, Stuck, Skipped */}
                    {!task.done && !task.skipped && (
                      <div className="mt-4 pt-3 border-t border-theme-border/45 flex flex-wrap gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => onTaskAction(task.id, 'done')}
                          className="px-2.5 py-1 text-[11px] rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 hover:border-emerald-500/35 font-semibold transition-all cursor-pointer active:scale-95"
                        >
                          ✓ Done
                        </button>
                        <button
                          type="button"
                          onClick={() => onTaskAction(task.id, 'delayed')}
                          className="px-2.5 py-1 text-[11px] rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/15 hover:border-yellow-500/35 font-semibold transition-all cursor-pointer active:scale-95"
                        >
                          ⏱ Delay
                        </button>
                        <button
                          type="button"
                          onClick={() => onTaskAction(task.id, 'stuck')}
                          className="px-2.5 py-1 text-[11px] rounded bg-orange-500/10 hover:bg-orange-500/25 text-orange-400 border border-orange-500/15 hover:border-orange-500/35 font-semibold transition-all cursor-pointer active:scale-95 animate-pulse"
                        >
                          🛑 Stuck
                        </button>
                        <button
                          type="button"
                          onClick={() => onTaskAction(task.id, 'skipped')}
                          className="px-2.5 py-1 text-[11px] rounded bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/15 hover:border-gray-500/35 font-semibold transition-all cursor-pointer active:scale-95"
                        >
                          ↪ Skip
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-theme-border mt-6 flex justify-between items-center text-xs text-gray-500">
            <span>Tasks total: {plan.tasks.length}</span>
            <span>Completed: {plan.tasks.filter(t => t.done).length}</span>
          </div>
        </div>
      </div>

      {/* Communications Draft Drawer */}
      <div className="p-6 rounded-2xl bg-theme-card border border-theme-border">
        <div className="flex items-center space-x-2.5 pb-4 border-b border-theme-border mb-6">
          <FileCode className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold font-heading text-white">Smart Action Copilots (Draft templates)</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plan.drafts.map((draft) => (
            <div key={draft.id} className="p-5 rounded-xl bg-theme-dark/50 border border-theme-border relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">To: {draft.recipient}</span>
                  <h4 className="text-sm font-bold text-gray-200 mt-0.5">{draft.title}</h4>
                </div>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono bg-white/5 text-gray-400 rounded border border-white/5">
                  {draft.type}
                </span>
              </div>

              <div className="bg-theme-card/90 border border-theme-border/60 rounded-lg p-3.5 max-h-36 overflow-y-auto mb-4 font-mono text-xs text-gray-300 leading-normal whitespace-pre-wrap select-all">
                {draft.content}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCopyDraft(draft.content, draft.id)}
                  className="px-3 py-1.5 bg-theme-dark border border-theme-border hover:border-gray-500 hover:text-white rounded-lg text-xs font-medium text-gray-400 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedIndex === draft.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 rounded-2xl bg-theme-card border border-theme-border">
        <h3 className="text-sm font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-4">
          Tactical Recommendations for Active Focus
        </h3>
        <ul className="space-y-3">
          {plan.recommendations.map((rec, i) => (
            <li key={i} className="text-xs sm:text-sm text-gray-300 flex items-start space-x-3 leading-relaxed">
              <span className="text-[#818cf8] font-extrabold select-none">✦</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Adaptive Replanner controls box */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#14121d] via-[#101017] to-[#121625] border border-brand-purple/30 glow-purple">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-theme-border mb-6 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-brand-purple">
              <RefreshCcw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">Adaptive Replanning Deck</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Live stamina and focus calibrator. Did your human availability parameters contract mid-flow?
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {replanEvents.length > 0 ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Plan Updated</span>
              </span>
            ) : (
              <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
                <span className="w-2 h-2 rounded-full bg-brand-purple/30 shrink-0" />
                <span>Plan dynamically synchronized</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic event listings if there are any replan actions */}
        {replanEvents.length > 0 && (
          <div className="mb-6 bg-[#090a0f]/80 border border-theme-border rounded-xl p-4">
            <h4 className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded font-bold tracking-wider inline-block text-gray-400 mb-2">
              Action Timeline Events
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {replanEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 font-mono text-[11px] text-[#818cf8]">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#818cf8] shrink-0 mt-0.5" />
                  <span>[{evt.time}] {evt.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-xs text-gray-400 max-w-md text-left">
            Use task cards above for individual milestones to mark them complete, delayed, skipped, or stuck. Click this key command if energy limits drop.
          </div>
          <button
            type="button"
            onClick={onExhaustedReplan}
            className="w-full sm:w-auto px-5 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 active:scale-95 transition-all text-center cursor-pointer shrink-0"
          >
            <Clock className="w-4 h-4 shrink-0 animate-pulse" />
            <span>I'm Exhausted - Replan with Low Energy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
