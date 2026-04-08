"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonetizationPath } from "@/types";
import { getConfidenceColor } from "@/lib/utils";
import { ChevronDown, ChevronUp, TrendingUp, Users, DollarSign, Zap } from "lucide-react";

interface Props {
    path: MonetizationPath;
    index: number;
}

export function MonetizationCard({ path, index }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="monetization-card gradient-border card-gradient rounded-2xl overflow-hidden"
        >
            {/* Card Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{path.emoji}</span>
                        <div>
                            <h3 className="font-bold text-white text-base">{path.model}</h3>
                            {path.estimatedMRR && (
                                <span className="text-xs text-emerald-400 font-medium">{path.estimatedMRR}/mo estimated</span>
                            )}
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(path.confidence)}`}>
                        {path.confidence}
                    </span>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{path.targetUsers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{path.pricing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground col-span-2">
                        <TrendingUp className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{path.marketTrendAlignment}</span>
                    </div>
                </div>

                {/* First 3 Steps */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        First Steps
                    </p>
                    {path.steps.slice(0, 3).map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold mt-0.5">
                                {i + 1}
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expand Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-3 border-t border-border text-xs font-medium text-muted-foreground hover:text-white hover:bg-purple-500/5 transition-colors"
            >
                <span>Why this fits your project</span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expanded: Why it fits + Pricing tiers */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-4">
                            {/* Why it fits */}
                            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                <p className="text-sm text-purple-200 leading-relaxed">{path.whyItFits}</p>
                            </div>

                            {/* Pricing tiers */}
                            {path.pricingTiers && path.pricingTiers.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-white mb-2">Pricing Tiers</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {path.pricingTiers.map((tier, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border">
                                                <div className="min-w-[80px]">
                                                    <div className="text-xs font-semibold text-white">{tier.name}</div>
                                                    <div className="text-xs text-emerald-400 font-medium">{tier.price}</div>
                                                </div>
                                                <ul className="flex-1 space-y-0.5">
                                                    {tier.features.map((f, j) => (
                                                        <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                            <span className="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {path.secondaryUsers && (
                                <div className="text-xs text-muted-foreground">
                                    <span className="text-white font-medium">Secondary market: </span>
                                    {path.secondaryUsers}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
