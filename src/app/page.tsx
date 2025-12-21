"use client";

import React, { useState, useMemo } from "react";
import { 
  COMMAND_CATALOG, 
  RULE_CATALOG, 
  STACK_PRESET_CATALOG, 
  RULESET_CATALOG 
} from "@/features/core/domain/catalogs";
import { resolve } from "@/features/core/domain/resolver/resolve";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/ui/card";
import { Badge } from "@/features/shared/ui/badge";
import { Button } from "@/features/shared/ui/button";
import { cn } from "@/lib/utils";
import { 
  Terminal, 
  Settings2, 
  Code2, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck,
  Cpu,
  RefreshCcw,
  Sparkles,
  Layers
} from "lucide-react";

export default function ControlPlanePage() {
  // 1. Local State
  const [selectedStackId, setSelectedStackId] = useState(STACK_PRESET_CATALOG[0]?.id || "");
  const [selectedCommandId, setSelectedCommandId] = useState(COMMAND_CATALOG[0]?.id || "");
  const [selectedProjectId, setSelectedProjectId] = useState("p-mobile");
  const [userInput, setUserInput] = useState("");
  const [ruleToggles, setRuleToggles] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState(false);

  const projects = [
    { id: "p-mobile", name: "Core Mobile App" },
    { id: "p-web", name: "Internal Admin Dashboard" }
  ];

  // 2. Computed Data
  const stack = useMemo(() => 
    STACK_PRESET_CATALOG.find(s => s.id === selectedStackId) || STACK_PRESET_CATALOG[0]
  , [selectedStackId]);

  const command = useMemo(() => 
    COMMAND_CATALOG.find(c => c.id === selectedCommandId) || COMMAND_CATALOG[0]
  , [selectedCommandId]);

  const ruleset = useMemo(() => 
    RULESET_CATALOG.find(rs => rs.id === stack?.defaultRulesetId) || RULESET_CATALOG[0]
  , [stack]);

  const project = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || projects[0]
  , [selectedProjectId]);

  // 3. Resolve Contract
  const resolveResult = useMemo(() => {
    if (!stack || !command || !ruleset || !project) return null;

    // Mock project object for local preview
    const domainProject = {
      id: project.id,
      name: project.name,
      stackPresetId: stack.id,
      activeRulesetId: ruleset.id,
      ruleToggles: ruleToggles,
    };

    return resolve(
      { 
        projectId: domainProject.id, 
        commandId: command.id, 
        userInput: userInput || "Drafting component..." 
      },
      {
        project: domainProject,
        command,
        ruleset,
        stackPreset: stack,
        ruleCatalog: RULE_CATALOG
      }
    );
  }, [stack, command, ruleset, ruleToggles, userInput, project]);

  // 4. Handlers
  const toggleRule = (id: string) => {
    setRuleToggles(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }));
  };

  const copyToClipboard = () => {
    if (resolveResult?.status === "ok") {
      navigator.clipboard.writeText(resolveResult.contract.contractText);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  // 5. Render
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-zinc-800 bg-zinc-900/50 text-zinc-400">
                Context Control Plane v1.0
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              AI Command Center
            </h1>
            <p className="text-zinc-500 mt-2 text-sm md:text-base">
              Govern your AI behavior with deterministic contracts. No prompts, just rules.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-500/80 uppercase tracking-wider">Live Preview</span>
             </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Config */}
          <div className="lg:col-span-4 space-y-8">
            {/* Project Selection */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                <Layers className="w-3.5 h-3.5" />
                Active Project
              </div>
              <div className="grid grid-cols-1 gap-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                      selectedProjectId === p.id
                        ? "bg-primary/5 border-primary/40 ring-1 ring-primary/40"
                        : "bg-[#090909] border-zinc-800 hover:border-zinc-700 text-zinc-400 opacity-60"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn("text-xs font-bold", selectedProjectId === p.id ? "text-primary" : "text-zinc-300")}>
                        {p.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">Account: Personal</span>
                    </div>
                    {selectedProjectId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Context/Input */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                <Zap className="w-3.5 h-3.5" />
                Context Hints
              </div>
              <div className="relative group">
                <textarea
                  placeholder="What are we building? (e.g. Navigation bar with dark mode support)"
                  className="w-full h-24 bg-[#090909] border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 resize-none group-hover:border-zinc-700"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>
            </section>

            {/* Stack Preset */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                <Settings2 className="w-3.5 h-3.5" />
                Stack Preset
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STACK_PRESET_CATALOG.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStackId(s.id)}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                      selectedStackId === s.id
                        ? "bg-primary/5 border-primary/40 ring-1 ring-primary/40"
                        : "bg-[#090909] border-zinc-800 hover:border-zinc-700 text-zinc-400"
                    )}
                  >
                    <span className={cn("text-xs font-bold", selectedStackId === s.id ? "text-primary" : "text-zinc-300")}>
                      {s.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 line-clamp-1 mt-1">{s.id === 'nextjs' ? 'App Router' : 'Client SPA'}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Rules */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Behavior Control
                </div>
                <Badge variant="secondary" className="bg-zinc-900 border-zinc-800 text-[9px]">
                  {ruleset?.name || 'Default'} Ruleset
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Fixed Rules */}
                {ruleset?.ruleIds.map(id => {
                  const rule = RULE_CATALOG.find(r => r.id === id);
                  if (!rule) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 opacity-60 grayscale-[0.5]">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{rule.title}</span>
                        <span className="text-[10px] text-zinc-500">{rule.severity.toUpperCase()}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-500">Fixed</Badge>
                    </div>
                  );
                })}

                {/* Optional Rules */}
                {ruleset?.optionalRuleIds.map(id => {
                  const rule = RULE_CATALOG.find(r => r.id === id);
                  if (!rule) return null;
                  const isEnabled = ruleToggles[id] !== false;
                  return (
                    <button
                      key={id}
                      onClick={() => toggleRule(id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:translate-x-1",
                        isEnabled 
                          ? "bg-primary/5 border-primary/20" 
                          : "bg-[#090909] border-zinc-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                      )}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className={cn("text-xs font-medium", isEnabled ? "text-primary" : "text-zinc-300")}>{rule.title}</span>
                        <span className="text-[10px] text-zinc-500 line-clamp-1">{rule.description}</span>
                      </div>
                      <div className={cn(
                        "w-7 h-4 rounded-full relative transition-colors shrink-0 ml-4",
                        isEnabled ? "bg-primary" : "bg-zinc-800"
                      )}>
                        <div className={cn(
                          "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                          isEnabled ? "left-3.5" : "left-0.5"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Commands & Preview */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
                <Terminal className="w-3.5 h-3.5" />
                Active Command
              </div>
              <div className="flex flex-wrap gap-2">
                {COMMAND_CATALOG.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommandId(c.id)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-xs font-medium transition-all flex items-center gap-2",
                      selectedCommandId === c.id
                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        : "bg-[#090909] border-zinc-800 text-zinc-400 hover:border-zinc-600"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", selectedCommandId === c.id ? "bg-black" : "bg-zinc-700")} />
                    /{c.id}
                  </button>
                ))}
              </div>
            </section>

            <Card className="flex-1 flex flex-col overflow-hidden bg-[#070707] border-zinc-800/40 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/40 bg-zinc-900/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold tracking-tight">Resolved Context Contract</CardTitle>
                    <CardDescription className="text-[10px] uppercase tracking-widest font-medium opacity-50">Deterministic Output</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
                    onClick={() => setUserInput("")}
                    title="Clear Context"
                   >
                     <RefreshCcw className="w-3.5 h-3.5" />
                   </Button>
                   <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 gap-2 rounded-lg py-0 px-4"
                    onClick={copyToClipboard}
                    disabled={resolveResult?.status !== "ok"}
                   >
                    {copyStatus ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline-block">{copyStatus ? 'Copied' : 'Copy Contract'}</span>
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative min-h-[400px]">
                {resolveResult?.status === "ok" ? (
                  <div className="absolute inset-0 overflow-auto p-6 font-mono text-[13px] leading-relaxed text-zinc-400 custom-scrollbar whitespace-pre-wrap">
                    {resolveResult.contract.contractText}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <div className="space-y-4 max-w-sm">
                       <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/10 text-destructive mb-2">
                          <Zap className="w-6 h-6" />
                       </div>
                       <h3 className="text-sm font-bold text-white">Resolution Blocked</h3>
                       <p className="text-xs text-zinc-500">
                         {resolveResult?.status === "blocked" ? resolveResult.blocked.message : "System state is invalid."}
                       </p>
                       {resolveResult?.status === "blocked" && (
                         <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-left">
                            <span className="text-[10px] text-zinc-600 block mb-1 font-bold uppercase tracking-wider">Details</span>
                            <pre className="text-[10px] text-destructive/80 overflow-auto">
                              {JSON.stringify(resolveResult.blocked.details, null, 2)}
                            </pre>
                         </div>
                       )}
                    </div>
                  </div>
                )}
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none opacity-50" />
              </CardContent>
              
              <div className="bg-zinc-900/40 border-t border-zinc-800/40 px-6 py-3 flex items-center justify-between">
                 <div className="flex gap-4 text-left">
                    <div className="flex flex-col">
                       <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-0.5">Rules</span>
                       <span className="text-xs font-mono text-zinc-400">
                        {resolveResult?.status === "ok" ? resolveResult.contract.meta.rulesApplied.length : 0} applied
                       </span>
                    </div>
                    <div className="flex flex-col border-l border-zinc-800 pl-4">
                       <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-0.5">Constraints</span>
                       <span className="text-xs font-mono text-zinc-400">
                        {resolveResult?.status === "ok" ? Object.keys(resolveResult.contract.meta.constraintsApplied).length : 0} active
                       </span>
                    </div>
                 </div>
                 <div className="text-[10px] font-mono text-zinc-700 hidden sm:block">
                    DETERMINISTIC_HASH: {resolveResult?.status === "ok" ? Math.abs(resolveResult.contract.contractText.length * 31).toString(16) : '---'}
                 </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
