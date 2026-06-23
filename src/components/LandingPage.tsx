import React from 'react';
import { 
  Flame, 
  Activity, 
  CheckSquare, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
}

export default function LandingPage({ onStartDemo }: LandingPageProps) {
  return (
    <div className="relative min-h-screen bg-theme-dark overflow-hidden bg-grid-pattern pb-16">
      {/* Abstract Glowing Aura Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/15 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-brand-cyan/10 rounded-full blur-[100px]" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-theme-border/60">
        <div className="flex items-center space-x-3">
          <div className="relative p-2 bg-gradient-to-tr from-brand-purple to-brand-cyan rounded-xl shadow-lg shadow-brand-purple/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Deadline<span className="text-brand-purple font-extrabold">OS</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-full">
            v1.0 Hackathon Release
          </span>
        </div>
        
        <button
          onClick={onStartDemo}
          className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white border border-theme-border rounded-lg hover:bg-white/[0.03] transition-all flex items-center space-x-2"
        >
          <span>Explore Sandbox</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase">Vibe2Ship / Last-Minute Life Saver Entry</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading leading-tight mb-6">
          Turn Deadline Chaos Into an <br />
          <span className="bg-gradient-to-r from-brand-purple via-violet-400 to-brand-cyan bg-clip-text text-transparent glow-purple">
            Executable Rescue Plan
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          Your Intelligent Deadline Rescue Agent. Dump your messy schedules, pending items, and active energy levels, then let AI structure your day, pinpoint risks, and tell you exactly what to do <span className="text-white font-medium underline decoration-brand-purple decoration-2">right now</span>.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-violet rounded-xl font-medium text-white shadow-xl shadow-brand-purple/40 hover:brightness-110 active:scale-95 transition-all text-base flex items-center justify-center space-x-3 cursor-pointer"
          >
            <span>Launch Deadline Rescue Agent</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a
            href="#problem-statement"
            className="w-full sm:w-auto px-8 py-4 bg-[#12131a]/80 hover:bg-[#12131a] text-gray-300 border border-theme-border rounded-xl text-base transition-all inline-flex items-center justify-center space-x-2"
          >
            <span>Read Case Study</span>
          </a>
        </div>
      </section>

      {/* Problem-Solution Comparison */}
      <section id="problem-statement" className="relative z-10 max-w-7xl mx-auto px-6 py-16 scroll-mt-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            Why Traditional Productivity Systems Fail
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Traditional calendars and to-do lists serve as record-keepers of failure, rather than accelerators of focus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="p-8 rounded-2xl bg-[#1a0f12]/30 border border-red-500/25 relative overflow-hidden group hover:border-red-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500">
              <XCircle className="w-24 h-24" />
            </div>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-red-100">
                Passive Buzzers (The Problem)
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Standard reminders like calendars, alarms, or push notifications notify you right when a deadline is happening. However:
            </p>

            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-red-500 font-extrabold mt-0.5">✕</span>
                <span>They only nag you with alarm buzzes but offer zero execution planning.</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-red-500 font-extrabold mt-0.5">✕</span>
                <span>They ignore physical reality: fatigue, brain fog, and overlapping timings.</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-red-500 font-extrabold mt-0.5">✕</span>
                <span>They generate "completion paralysis" due to overwhelming unstructured volumes.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="p-8 rounded-2xl bg-[#0f1a16]/30 border border-emerald-500/25 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500">
              <CheckCircle className="w-24 h-24" />
            </div>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-heading text-emerald-100">
                Active Rescue Agent (The Solution)
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              <strong>DeadlineOS</strong> is an active assistant that parses, segments, drafts, and reschedules with context awareness:
            </p>

            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-emerald-500 font-extrabold mt-0.5">✓</span>
                <span><strong>Do This Now Hero Card</strong> highlights the one thing you can actually complete immediately.</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-emerald-500 font-extrabold mt-0.5">✓</span>
                <span>De-escalates paralysis by breaking monumental assignments into <strong>Micro-Actions</strong>.</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <span className="text-emerald-500 font-extrabold mt-0.5">✓</span>
                <span>One-click <strong>Adaptive Energy Replanning</strong> shifts schedules in response to fatigue or delays.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Breakdown Bento */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-purple">Built-In Capabilities</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-1">
            Engineered to Secure Last-Minute Deliverables
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Deadline Risk Detection</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Analyzes multiple dates, overlapping meeting blockouts, and ranks risks immediately into High or Critical, predicting failure before it hits.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Do This Now Hero Card</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cuts decision fatigue completely. The main workspace spotlights the single absolute high-impact action to complete, keeping you moving.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-4">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Micro-Action Breakdown</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Splits intimidating jobs into simple, fast 10-minute micro-checklists. Tick boxes physically to create a visual chain of achievement.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Conflict Alerts</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instantly spots friction points, like group meetings colliding with homework submissions or banking portals processing deadlines before closing.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Adaptive Energy Replanning</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fell delayed? Exhausted? Simply press one button, and the agent shifts schedule allocations to accommodate physical energy slumps.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-border hover:bg-theme-card/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold font-heading text-white mb-2">Google Calendar Integration</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Export optimized tactical schedule blocks directly to Google Calendar using prebuilt templates. No sign-ups or credentials required.
            </p>
          </div>
        </div>
      </section>

      {/* Instant Demo Launch Strip */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mt-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-[#12131a] via-[#161a29] to-[#0d161a] border border-theme-border text-center overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-4">
              Experience the 60-Second Hackathon Demo Now
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Select one of our preset crises (Student, Corporate, or Founder) or input your own messy day block to activate the sandbox.
            </p>
            <button
              onClick={onStartDemo}
              className="px-8 py-3.5 bg-white text-theme-dark font-medium rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95 inline-flex items-center space-x-2.5 cursor-pointer text-sm"
            >
              <span>Launch Demo Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
