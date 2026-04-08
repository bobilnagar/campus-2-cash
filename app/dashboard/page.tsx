"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import { AnalysisResponse, ProjectInput } from "@/types";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { MonetizationCard } from "@/components/MonetizationCard";
import { RefineModal } from "@/components/RefineModal";
import { ExportButton } from "@/components/ExportButton";

export default function DashboardPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [projectInput, setProjectInput] = useState<ProjectInput | null>(null);
    const [refineOpen, setRefineOpen] = useState(false);
    const [refineCount, setRefineCount] = useState(0);

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
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen hero-gradient">
            {/* Navbar */}
            <nav className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            New Project
                        </button>
                        <span className="text-border">·</span>
                        <h1 className="font-bold text-white text-sm sm:text-base truncate max-w-[200px]">
                            {projectInput.title}
                        </h1>
                        {refineCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/20">
                                Refined ×{refineCount}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <ExportButton result={result} projectInput={projectInput} />
                        <button
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-muted-foreground hover:text-white hover:border-purple-500/50 text-sm transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regenerate
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Overall insights banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-border card-gradient rounded-2xl p-5 mb-6 flex items-start gap-3"
                >
                    <span className="text-2xl">💡</span>
                    <div>
                        <p className="text-sm font-medium text-white mb-1">AI Insights</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {result.overallInsights || result.evaluation.overallInsights}
                        </p>
                    </div>
                </motion.div>

                {/* Two-panel layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                    {/* Left: Evaluation Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Evaluation
                        </h2>
                        <EvaluationPanel evaluation={result.evaluation} />
                    </motion.div>

                    {/* Right: Monetization Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Monetization Paths ({result.paths.length})
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {result.paths.map((path, i) => (
                                <MonetizationCard key={path.id || i} path={path} index={i} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Refine CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-center"
                >
                    <div className="inline-flex flex-col items-center gap-3 p-6 gradient-border card-gradient rounded-2xl glow-purple-sm max-w-md w-full">
                        <p className="text-white font-semibold">Not quite right?</p>
                        <p className="text-sm text-muted-foreground">
                            Tell the AI what to change — it&apos;ll regenerate all paths based on your feedback instantly.
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

                {/* Generated at */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    Generated {new Date(result.generatedAt).toLocaleString()} · Powered by OpenRouter · Campus-2-Cash
                </p>
            </div>

            {/* Refine Modal */}
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
