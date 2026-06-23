import React, { useState, useEffect } from 'react';
import { 
  demoCases, 
  DemoCase 
} from '../demoData';
import { 
  Zap, 
  Hourglass, 
  Play, 
  Wand2, 
  Mic, 
  MicOff, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface WorkspaceProps {
  onAnalyze: (text: string, energy: 'low' | 'medium' | 'high', timeMinutes: number) => void;
  isLoading: boolean;
}

export default function Workspace({ onAnalyze, isLoading }: WorkspaceProps) {
  const [taskInput, setTaskInput] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedTime, setSelectedTime] = useState<number>(300); // Minutes (Default 5 hours)
  
  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize Web Speech API safely
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTaskInput(prev => prev ? prev + ' ' + transcript : transcript);
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setSpeechError(`Voice input error: ${event.error}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const handleToggleListening = () => {
    if (!recognition) {
      setSpeechError("Speech recognition is not natively supported in this browser version. Copy/Paste or type perfectly!");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition", err);
        setIsListening(false);
      }
    }
  };

  const loadDemoCase = (demoKey: 'student' | 'professional' | 'entrepreneur') => {
    const matched = demoCases.find(c => c.key === demoKey);
    if (matched) {
      setTaskInput(matched.input);
      setSelectedEnergy(matched.energy);
      setSelectedTime(matched.availableTimeMinutes);
    }
  };

  const handleTriggerAnalysis = () => {
    if (!taskInput.trim()) return;
    onAnalyze(taskInput, selectedEnergy, selectedTime);
  };

  return (
    <div id="sandbox-workbench" className="bg-theme-card border border-theme-border/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-theme-border/50">
        <div>
          <div className="flex items-center space-x-2 text-brand-purple mb-1">
            <Sparkles className="w-5 h-5 text-brand-purple animate-pulse" />
            <h3 className="text-xl font-bold font-heading text-white">Rescue Workspace</h3>
          </div>
          <p className="text-sm text-gray-400">
            Paste your exact tasks, upcoming meetings, bill due dates, and fatigue factors.
          </p>
        </div>

        {/* Quick Demo select buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-mono pr-1">Try Demo Presets:</span>
          <button
            type="button"
            onClick={() => loadDemoCase('student')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#221c35]/60 hover:bg-[#221c35] text-brand-purple border border-brand-purple/20 hover:border-brand-purple/50 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-1"
          >
            <span className="pointer-events-none">🎓</span>
            <span className="pointer-events-none">Student Crisis</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoCase('professional')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#142330]/60 hover:bg-[#142330] text-sky-400 border border-sky-400/20 hover:border-sky-400/50 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-1"
          >
            <span className="pointer-events-none">💼</span>
            <span className="pointer-events-none">Working Professional</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoCase('entrepreneur')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#271d18]/60 hover:bg-[#271d18] text-amber-500 border border-amber-500/20 hover:border-amber-500/50 active:scale-95 transition-all cursor-pointer inline-flex items-center space-x-1"
          >
            <span className="pointer-events-none">🚀</span>
            <span className="pointer-events-none">Entrepreneur</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Large Message Area */}
        <div className="relative">
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="e.g. I have a presentation due tomorrow morning at 10 AM, need to buy milk, prep for product launch meeting at 3 PM today... I'm overwhelmed and exhausted..."
            className="w-full h-44 bg-[#0d0f14] text-gray-200 border border-theme-border rounded-xl p-4 pr-12 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple text-sm sm:text-base leading-relaxed placeholder-gray-600 transition-all font-sans"
          />
          
          {/* Audio Input Overlay Button */}
          <div className="absolute right-3 bottom-4 flex items-center space-x-2">
            <button
              onClick={handleToggleListening}
              title={isListening ? "Stop listening" : "Start Voice Task Dump"}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse' 
                  : 'bg-theme-card text-gray-400 border-theme-border hover:text-white hover:border-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Speech API Warning Overlay if triggered */}
        {speechError && (
          <div className="flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-400">
            <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-normal">{speechError}</span>
            <button 
              onClick={() => setSpeechError(null)} 
              className="text-yellow-400 font-bold hover:text-white px-1 leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sliders Configuration Area */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Energy Rating Dial */}
          <div className="p-4 bg-[#0d0f14] border border-theme-border/60 rounded-xl">
            <div className="flex items-center space-x-2 text-gray-300 font-medium text-sm mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Current Human Energy Level</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedEnergy(lvl)}
                  type="button"
                  className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                    selectedEnergy === lvl 
                      ? 'bg-brand-purple/20 text-brand-purple border-brand-purple' 
                      : 'bg-theme-card text-gray-400 border-theme-border hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Stated focused time Slider selector */}
          <div className="p-4 bg-[#0d0f14] border border-theme-border/60 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-gray-300 font-medium text-sm mb-2">
              <div className="flex items-center space-x-2">
                <Hourglass className="w-4 h-4 text-brand-cyan" />
                <span>Available Focus Window</span>
              </div>
              <span className="text-brand-cyan font-mono font-bold">{(selectedTime / 60).toFixed(1)}h</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {([60, 120, 180, 300, 480] as const).map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedTime(mins)}
                  type="button"
                  className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedTime === mins 
                      ? 'bg-brand-cyan/25 text-brand-cyan border-brand-cyan/80' 
                      : 'bg-theme-card text-gray-400 border-theme-border hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  {mins / 60}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleTriggerAnalysis}
          disabled={isLoading || !taskInput.trim()}
          className={`w-full py-4 rounded-xl font-bold font-heading transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-purple/10 ${
            isLoading 
              ? 'bg-brand-purple/50 text-purple-200 cursor-not-allowed' 
              : !taskInput.trim()
                ? 'bg-theme-border text-gray-600 border border-theme-border cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-purple to-brand-violet hover:brightness-110 text-white cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Deadline Bandwidths...</span>
            </div>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-white" />
              <span>Analyze My Tasks & Build Rescue Plan</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
