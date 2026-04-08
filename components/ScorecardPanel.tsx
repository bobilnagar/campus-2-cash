"use client";

import { motion } from "framer-motion";
import { Scorecard } from "@/types";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { Info } from "lucide-react";
import { useState } from "react";

interface Props {
    scorecard: Scorecard;
    totalScore: number;
}

const DIMENSION_ICONS: Record<string, string> = {
    marketSize: "📊",
    problemSeverity: "🔥",
    uniqueness: "💎",
    feasibility: "⚙️",
    monetizationPotential: "💰",
    scalability: "📈",
    timeToRevenue: "⚡",
    competitiveMoat: "🏰",
    founderFit: "🎯",
    trendAlignment: "🚀",
};

export function ScorecardPanel({ scorecard, totalScore }: Props) {
    const [hovered, setHovered] = useState<string | null>(null);

    const dimensions = Object.entries(scorecard) as [keyof Scorecard, Scorecard[keyof Scorecard]][];

    // Group: 5 left + 5 right  
    const left = dimensions.slice(0, 5);
    const right = dimensions.slice(5, 10);

    return (
        <div className="gradient-border card-gradient rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">Project Scorecard</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">10 dimensions</span>
                    <div className={`text-lg font-extrabold ${getScoreColor(totalScore)}`}>
                        {totalScore.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/10</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...left, ...right].map(([key, dim], i) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="relative"
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{DIMENSION_ICONS[key] || "•"}</span>
                            <span className="text-xs text-white font-medium flex-1 truncate">{dim.label}</span>
                            <span className={`text-xs font-bold tabular-nums ${getScoreColor(dim.score)}`}>
                                {dim.score}/10
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${getScoreBgColor(dim.score)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(dim.score / 10) * 100}%` }}
                                transition={{ duration: 1.0, delay: i * 0.06, ease: "easeOut" }}
                            />
                        </div>

                        {/* Tooltip on hover */}
                        {hovered === key && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-full left-0 right-0 mb-2 z-20 p-2.5 rounded-lg bg-card border border-border shadow-xl text-xs text-muted-foreground leading-relaxed"
                            >
                                {dim.summary}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1 mt-4 flex-wrap">
                {[
                    { range: "8–10", label: "Excellent", color: "bg-emerald-400" },
                    { range: "6–7", label: "Good", color: "bg-yellow-400" },
                    { range: "4–5", label: "Average", color: "bg-orange-400" },
                    { range: "1–3", label: "Weak", color: "bg-red-400" },
                ].map((l) => (
                    <div key={l.range} className="flex items-center gap-1 mr-3">
                        <div className={`w-2 h-2 rounded-full ${l.color}`} />
                        <span className="text-xs text-muted-foreground">{l.label} ({l.range})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
