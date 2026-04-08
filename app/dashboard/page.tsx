"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, TrendingUp, Brain } from "lucide-react";
import { AnalysisResponse, ProjectInput, MonetizationPath } from "@/types";
import { loadFromLocalStorage, saveToLocalStorage, getVerdictColor } from "@/lib/utils";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { ScorecardPanel } from "@/components/ScorecardPanel";
import { MonetizationCard } from "@/components/MonetizationCard";
import { RefineModal } from "@/components/RefineModal";
import { ExportButton } from "@/components/ExportButton";
import { StrategicInsightsCard } from "@/components/StrategicInsightsCard";

type TabId = "overview" | "scorecard" | "paths" | "strategy";

export default function DashboardPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [projectInput, setProjectInput] = useState<ProjectInput | null>(null);
    const [refineOpen, setRefineOpen] = useState(false);
    const [refineCount, setRefineCount] = useState(0);
    const [activeTab, setActiveTab] = useState<TabId>("overview");

    useEffect(() => {
        const saved = loadFromLocalStorage<AnalysisResponse>("c2c_result");
        const input = loadFromLocalStorage<ProjectInput>("c2c_input");
        if (!saved) {
            router.push("/dashboard/input");
            return;
        }
        setResult(saved);
        setProjectInput(input);
    }, [router]);

    function handleRefined(newResult: AnalysisResponse) {
        setResult(newResult);
        saveToLocalStorage("c2c_result", newResult);
        setRefineCount((c) => c + 1);
    }

    if (!result || !projectInput) {
        return (
            <div className="min-h-screen hero-gradient flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 animate-pulse mx-auto" />
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

    const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: "overview", label: "Overview", icon: <TrendingUp className="w-3.5 h-3.5" /> },
        { id: "scorecard", label: "Scorecard", icon: <Brain className="w-3.5 h-3.5" /> },
        { id: "paths", label: `Paths (${result.paths.length})`, icon: <Sparkles className="w-3.5 h-3.5" /> },
        ...(result.strategicInsights
            ? [{ id: "strategy" as TabId, label: "Strategy", icon: <Brain className="w-3.5 h-3.5" /> }]
            : []),
    ];

    return (
        <div className="min-h-screen hero-gradient">
            {/* Sticky Navbar */}
            <nav className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            New
                        </button>
                        <span className="text-border">·</span>
                        <h1 className="font-bold text-white text-sm sm:text-base truncate">
                            {projectInput.title}
                        </h1>
                        {refineCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/20 flex-shrink-0">
                                ×{refineCount} refined
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ExportButton result={result} projectInput={projectInput} />
                        <button
                            onClick={() => setRefineOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-sm font-medium transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Refine
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-muted-foreground hover:text-white hover:border-purple-500/50 text-sm transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Score Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-border card-gradient rounded-2xl p-5 mb-6 glow-purple-sm"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Big Score */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="relative">
                                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="6" />
                                    <motion.circle
                                        cx="40" cy="40" r="34"
                                        fill="none"
                                        stroke="url(#heroGrad)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 34}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.evaluation.realWorldValueScore / 10) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#a855f7" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-extrabold text-white">
                                        {result.evaluation.realWorldValueScore.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{result.evaluation.verdictEmoji}</span>
                                    <span className={`text-lg font-bold ${getVerdictColor(result.evaluation.realWorldValueScore)}`}>
                                        {result.evaluation.verdict}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">Real-World Value Score</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-14 bg-border" />

                        {/* Revenue at a glance */}
                        <div className="flex-1 grid grid-cols-3 gap-3">
                            {[
                                { label: "Conservative", val: result.evaluation.revenueEstimate.conservative, color: "text-orange-400" },
                                { label: "Realistic", val: result.evaluation.revenueEstimate.realistic, color: "text-yellow-400" },
                                { label: "Optimistic", val: result.evaluation.revenueEstimate.optimistic, color: "text-emerald-400" },
                            ].map((r) => (
                                <div key={r.label} className="text-center">
                                    <div className={`text-base font-bold ${r.color}`}>{r.val}</div>
                                    <div className="text-xs text-muted-foreground">{r.label}/mo</div>
                                </div>
                            ))}
                        </div>

                        {/* Insights blurb */}
                        <div className="hidden lg:flex items-start gap-2 max-w-xs">
                            <span className="text-lg mt-0.5">💡</span>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                                {result.overallInsights || result.evaluation.overallInsights}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* TABS */}
                <div className="flex gap-1 mb-6 bg-card/50 border border-border rounded-xl p-1 w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-purple-600 text-white shadow"
                                : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                        <div className="space-y-4">
                            <EvaluationPanel evaluation={result.evaluation} />
                        </div>
                        <div className="space-y-4">
                            {result.paths.slice(0, 2).map((path: MonetizationPath, i: number) => (
                                <MonetizationCard key={path.id || i} path={path} index={i} />
                            ))}
                            {result.paths.length > 2 && (
                                <button
                                    onClick={() => setActiveTab("paths")}
                                    className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-white hover:border-purple-500/50 transition-all"
                                >
                                    + {result.paths.length - 2} more monetization paths →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "scorecard" && result.evaluation.scorecard && (
                    <div className="max-w-3xl">
                        <ScorecardPanel
                            scorecard={result.evaluation.scorecard}
                            totalScore={result.evaluation.realWorldValueScore}
                        />
                    </div>
                )}

                {activeTab === "scorecard" && !result.evaluation.scorecard && (
                    <div className="max-w-3xl">
                        <EvaluationPanel evaluation={result.evaluation} />
                    </div>
                )}

                {activeTab === "paths" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {result.paths.map((path: MonetizationPath, i: number) => (
                            <MonetizationCard key={path.id || i} path={path} index={i} />
                        ))}
                    </div>
                )}

                {activeTab === "strategy" && result.strategicInsights && (
                    <div className="max-w-2xl">
                        <StrategicInsightsCard insights={result.strategicInsights} />
                    </div>
                )}

                {/* Refine CTA at bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex justify-center"
                >
                    <div className="inline-flex flex-col items-center gap-3 p-6 gradient-border card-gradient rounded-2xl glow-purple-sm text-center max-w-sm w-full">
                        <p className="text-white font-semibold">Not quite right?</p>
                        <p className="text-sm text-muted-foreground">
                            Give the AI feedback and regenerate all paths instantly.
                        </p>
                        <button
                            onClick={() => setRefineOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-900/30"
                        >
                            <Sparkles className="w-4 h-4" />
                            Refine Suggestions
                        </button>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Generated {new Date(result.generatedAt).toLocaleString()} · Powered by Gemini 2.0 Flash · Campus-2-Cash
                </p>
            </div>

            <RefineModal
                isOpen={refineOpen}
                onClose={() => setRefineOpen(false)}
                currentResult={result}
                projectInput={projectInput}
                onRefined={handleRefined}
            />
        </div>
    );
}
