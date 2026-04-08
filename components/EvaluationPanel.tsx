"use client";

import { motion } from "framer-motion";
import { EvaluationResult } from "@/types";
import { getScoreColor, getScoreBgColor, getVerdictColor } from "@/lib/utils";

interface Props {
    evaluation: EvaluationResult;
}

export function EvaluationPanel({ evaluation }: Props) {
    const dims = [
        { key: "marketSize", data: evaluation.dimensions.marketSize },
        { key: "uniqueness", data: evaluation.dimensions.uniqueness },
        { key: "feasibility", data: evaluation.dimensions.feasibility },
        { key: "monetizationPotential", data: evaluation.dimensions.monetizationPotential },
        { key: "executionRisk", data: evaluation.dimensions.executionRisk },
    ];

    // SVG circle score meter
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const score = Math.min(Math.max(evaluation.realWorldValueScore, 0), 10);
    const dashOffset = circumference - (score / 10) * circumference;

    return (
        <div className="space-y-4">
            {/* Score Meter */}
            <div className="gradient-border card-gradient rounded-2xl p-6 glow-purple-sm text-center">
                <div className="relative inline-flex items-center justify-center mb-4">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-extrabold ${getScoreColor(score)}`}>
                            {score.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{evaluation.verdictEmoji}</span>
                    <h3 className={`text-lg font-bold ${getVerdictColor(score)}`}>
                        {evaluation.verdict}
                    </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {evaluation.overallInsights}
                </p>
            </div>

            {/* 5 Dimension Bars */}
            <div className="gradient-border card-gradient rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">5-Dimension Analysis</h3>
                <div className="space-y-4">
                    {dims.map(({ key, data }, i) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-white">{data.label}</span>
                                <span className={`text-xs font-bold ${getScoreColor(data.score)}`}>
                                    {data.score}/10
                                </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${getScoreBgColor(data.score)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(data.score / 10) * 100}%` }}
                                    transition={{ duration: 1.2, delay: 0.1 * i, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{data.summary}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Revenue Estimate */}
            <div className="gradient-border card-gradient rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                    Revenue Estimate · {evaluation.revenueEstimate.timeframe}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Conservative", value: evaluation.revenueEstimate.conservative, color: "text-orange-400" },
                        { label: "Realistic", value: evaluation.revenueEstimate.realistic, color: "text-yellow-400" },
                        { label: "Optimistic", value: evaluation.revenueEstimate.optimistic, color: "text-emerald-400" },
                    ].map((tier) => (
                        <div key={tier.label} className="text-center p-3 rounded-xl bg-background/50 border border-border">
                            <div className={`text-lg font-bold ${tier.color}`}>{tier.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{tier.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
