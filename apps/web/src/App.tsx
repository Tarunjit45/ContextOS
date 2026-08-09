import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  Boxes, 
  Cpu, 
  CheckSquare, 
  History, 
  GitGraph, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Play, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'scenarios' | 'agents' | 'evaluations' | 'replay' | 'graph' | 'failures' | 'benchmarks'>('overview');
  const [replayDay, setReplayDay] = useState<number>(30);
  const [selectedFailure, setSelectedFailure] = useState<number | null>(null);

  // Dynamic context node counts based on replay timeline slider
  const getReplayMetrics = (day: number) => {
    if (day <= 7) return { entities: 17, relationships: 12, memories: 42 };
    if (day <= 30) return { entities: 91, relationships: 143, memories: 312 };
    return { entities: 248, relationships: 1204, memories: 2481 };
  };

  const currentReplay = getReplayMetrics(replayDay);

  return (
    <div className="flex h-screen w-screen bg-[#08090d] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#0d0f17] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-blue-600/30">
              C
            </div>
            <div>
              <div className="font-mono text-sm font-bold tracking-wider text-white">CONTEXTOS</div>
              <div className="text-[10px] text-slate-500 font-mono">Evaluation Lab v1.0</div>
            </div>
          </div>

          {/* Main Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'workspaces', label: 'Workspaces', icon: Database },
              { id: 'scenarios', label: 'Scenarios', icon: Boxes },
              { id: 'agents', label: 'Agents', icon: Cpu },
              { id: 'evaluations', label: 'Evaluations', icon: CheckSquare },
              { id: 'replay', label: 'Context Replay', icon: History, highlight: true },
              { id: 'graph', label: 'Context Graph', icon: GitGraph },
              { id: 'failures', label: 'Failures', icon: AlertTriangle },
              { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings */}
        <div className="pt-4 border-t border-slate-800/80">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#08090d] p-6 lg:p-8">
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-mono font-bold text-white tracking-tight">CONTEXTOS</h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">Agent Memory & Operational Context Evaluation Laboratory</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-slate-400">Local Engine Active</span>
              </div>
            </div>

            {/* Core Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Evaluations Run', value: '1,248', change: '+12.4%', color: 'text-white' },
                { label: 'Success Rate', value: '89.7%', change: '+4.2%', color: 'text-emerald-400' },
                { label: 'Context Accuracy', value: '91.2%', change: '+3.1%', color: 'text-blue-400' },
                { label: 'Hallucination Rate', value: '3.1%', change: '-1.8%', color: 'text-amber-400' }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800/80 shadow-sm">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
                  <div className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-mono text-emerald-500 mt-1">{stat.change} vs baseline</div>
                </div>
              ))}
            </div>

            {/* Failure Distribution */}
            <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Failure Distribution by Category</h3>
                <span className="text-[10px] font-mono text-slate-500">Root Cause Taxonomy</span>
              </div>
              
              <div className="space-y-3 pt-2">
                {[
                  { name: 'Retrieval Failure', percentage: 12, color: 'bg-red-500' },
                  { name: 'Temporal Reasoning', percentage: 8, color: 'bg-amber-500' },
                  { name: 'Relationship Traversal', percentage: 6, color: 'bg-blue-500' },
                  { name: 'Context Composition', percentage: 5, color: 'bg-purple-500' },
                  { name: 'Hallucination', percentage: 3, color: 'bg-emerald-500' }
                ].map((fail, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>{fail.name}</span>
                      <span>{fail.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${fail.color}`} style={{ width: `${fail.percentage * 5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Evaluation Runs */}
            <div className="p-6 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Recent Agent Runs</h3>
              <div className="divide-y divide-slate-800/60 font-mono text-xs">
                {[
                  { id: '#1248', agent: 'ContextOS Agent', score: '94%', pass: true, time: '2 mins ago' },
                  { id: '#1247', agent: 'Baseline RAG Agent', score: '71%', pass: false, time: '5 mins ago' },
                  { id: '#1246', agent: 'ContextOS Agent', score: '91%', pass: true, time: '12 mins ago' }
                ].map((run, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 font-bold">{run.id}</span>
                      <span className="text-white font-medium">{run.agent}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-400">{run.score}</span>
                      {run.pass ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">✓ PASSED</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1 font-bold">✕ FAILED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKSPACES */}
        {activeTab === 'workspaces' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-lg font-mono font-bold text-white">Simulated Organization — Acme Corporation</h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">Entity directory and multi-source context environment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* People */}
              <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
                <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">People ({4})</div>
                <div className="space-y-2 text-slate-300">
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">John Smith</div>
                    <div className="text-slate-500 text-[10px]">VP Sales • john@acme.com</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">Sarah Chen</div>
                    <div className="text-slate-500 text-[10px]">CTO • sarah@acme.com</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">David Wilson</div>
                    <div className="text-slate-500 text-[10px]">Procurement • david@globex.com</div>
                  </div>
                </div>
              </div>

              {/* Companies */}
              <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
                <div className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">Companies ({3})</div>
                <div className="space-y-2 text-slate-300">
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">Acme Corporation</div>
                    <div className="text-slate-500 text-[10px]">Primary Host Domain • acme.com</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">Globex Industries</div>
                    <div className="text-slate-500 text-[10px]">Enterprise Account • globex.com</div>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="p-5 rounded-xl bg-[#0d0f17] border border-slate-800/80 space-y-3">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Projects & Deals ({3})</div>
                <div className="space-y-2 text-slate-300">
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">Enterprise Deal #104</div>
                    <div className="text-slate-500 text-[10px]">Owner: John Smith • Status: Negotiation</div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                    <div className="font-bold text-white">Cloud Migration</div>
                    <div className="text-slate-500 text-[10px]">Owner: Sarah Chen • Status: Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTEXT REPLAY (KILLER FEATURE) */}
        {activeTab === 'replay' && (
          <div className="max-w-5xl mx-auto space-y-8 font-mono">
            <div className="border-b border-slate-800 pb-4">
              <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-widest inline-block mb-2">
                Signature Feature
              </span>
              <h1 className="text-xl font-bold text-white">Context Replay Timeline</h1>
              <p className="text-xs text-slate-400 mt-1">Replay an organization over time and evaluate agent decisions as available context evolves.</p>
            </div>

            {/* Replay Telemetry Panels */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Active Entities</div>
                <div className="text-3xl font-bold text-blue-400 mt-1">{currentReplay.entities}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Active Relationships</div>
                <div className="text-3xl font-bold text-purple-400 mt-1">{currentReplay.relationships}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0d0f17] border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Retained Memories</div>
                <div className="text-3xl font-bold text-emerald-400 mt-1">{currentReplay.memories}</div>
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="p-8 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Timeline Cursor Position</span>
                <span className="text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">
                  DAY {replayDay} OF 60
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="60"
                value={replayDay}
                onChange={e => setReplayDay(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                <span>DAY 1 (Hold Notice)</span>
                <span>DAY 30 (Legal Clearance Update)</span>
                <span>TODAY (Day 60)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-300 leading-relaxed">
              💡 <strong>Context Replay Insight:</strong> On Day 1, contacting Globex was prohibited. On Day 30, Sarah Chen posted a legal clearance update authorizing contact. ContextOS evaluates whether your agent uses the Day 30 instruction when queried today.
            </div>
          </div>
        )}

        {/* TAB 8: FAILURES */}
        {activeTab === 'failures' && (
          <div className="max-w-6xl mx-auto space-y-6 font-mono">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-lg font-bold text-white">Failure Taxonomy Explorer</h1>
              <p className="text-xs text-slate-400 mt-1">Root-cause classification and diagnostic debugging for failed evaluations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Failure List */}
              <div className="lg:col-span-5 space-y-3">
                {[
                  { id: 982, type: 'Temporal Reasoning Failure', task: 'Should we contact Globex?', count: 41 },
                  { id: 981, type: 'Retrieval Failure', task: 'Who owns deal #104?', count: 27 },
                  { id: 980, type: 'Entity Resolution', task: 'Disambiguate John Smith', count: 19 },
                  { id: 979, type: 'Hallucination', task: 'Secret discount code query', count: 14 }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFailure(item.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedFailure === item.id 
                        ? 'bg-red-950/20 border-red-500/50' 
                        : 'bg-[#0d0f17] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-red-400">FAILURE #{item.id}</span>
                      <span className="text-[10px] text-slate-500">{item.count} occurrences</span>
                    </div>
                    <div className="text-xs font-bold text-white">{item.type}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.task}</div>
                  </div>
                ))}
              </div>

              {/* Diagnostic Detail Panel */}
              <div className="lg:col-span-7 p-6 rounded-xl bg-[#0d0f17] border border-slate-800 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold">FAILURE DIAGNOSTIC #982</div>
                  <div className="text-base font-bold text-white mt-1">Temporal Reasoning Failure</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Task Query</span>
                    <span className="text-white font-medium">"Should we contact Globex Industries today?"</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Expected Action</span>
                      <span className="text-emerald-300 font-bold">YES / PERMIT_CONTACT</span>
                    </div>
                    <div className="p-3 bg-red-950/20 border border-red-800/40 rounded">
                      <span className="text-[10px] text-red-400 uppercase font-bold block">Agent Output</span>
                      <span className="text-red-300 font-bold">NO / PREVENT_CONTACT</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Missing Evidence</span>
                    <span className="text-amber-300 font-mono">Day 30 Slack legal clearance update (#m2)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Root Cause Analysis</span>
                    <span className="text-slate-300">Retrieval ranking picked top-1 vector match (Day 1 hold notice) without applying temporal recency decay filter.</span>
                  </div>

                  <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded text-blue-300">
                    <span className="text-[10px] text-blue-400 uppercase font-bold block">Suggested Fix</span>
                    Enable recency-weighted temporal graph retrieval in ContextComposer.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT / OTHER TABS FALLBACK */}
        {(activeTab !== 'overview' && activeTab !== 'workspaces' && activeTab !== 'replay' && activeTab !== 'failures') && (
          <div className="max-w-4xl mx-auto py-16 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">{activeTab} Laboratory Panel</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Engineered for deterministic evaluation, context graph inspection, and multi-model benchmark comparisons.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
