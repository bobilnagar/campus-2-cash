"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles } from "lucide-react";
import { AnalysisResponse, ProjectInput } from "@/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentResult: AnalysisResponse;
    projectInput: ProjectInput;
    onRefined: (result: AnalysisResponse) => void;
}

export function RefineModal({ isOpen, onClose, currentResult, projectInput, onRefined }: Props) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const SUGGESTIONS = [
        "Focus more on B2B / enterprise paths",
        "I prefer passive income over active work",
        "Make pricing more student-friendly",
        "Suggest paths for the Indian / Southeast Asian market",
        "I have no money to invest — show bootstrapped paths only",
        "Focus on freelance and service-based income",
    ];

    async function handleRefine() {
        if (!feedback.trim()) {
            setError("Please describe what you'd like changed.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/analyze?mode=refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalResponse: currentResult,
                    projectInput,
                    userFeedback: feedback,
                }),
            });

            if (!res.ok) throw new Error("Refinement failed");

            const data: AnalysisResponse = await res.json();
            onRefined(data);
            onClose();
            setFeedback("");
        } catch {
            setError("Refinement failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="w-full max-w-lg gradient-border card-gradient rounded-2xl shadow-2xl glow-purple overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    <h2 className="font-bold text-white">Refine Suggestions</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-secondary transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Tell the AI what to change. Be specific — it will regenerate all suggestions based on your feedback.
                                </p>

                                {/* Quick suggestion chips */}
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setFeedback(s)}
                                            className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback textarea */}
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="e.g. I want to focus strictly on B2B SaaS paths with annual pricing. Also, I'm based in India so suggest India-specific platforms..."
                                    rows={4}
                                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition resize-none text-sm"
                                />

                                {error && (
                                    <p className="text-sm text-red-400">{error}</p>
                                )}

                                <button
                                    onClick={handleRefine}
                                    disabled={loading || !feedback.trim()}
                                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Regenerating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Regenerate Suggestions
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
