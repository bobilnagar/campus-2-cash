"use client";

import { motion } from "framer-motion";
import { StrategicInsights } from "@/types";
import { ShieldCheck, AlertTriangle, Zap, Star } from "lucide-react";

interface Props {
    insights: StrategicInsights;
}

export function StrategicInsightsCard({ insights }: Props) {
    return (
        <div className="gradient-border card-gradient rounded-2xl overflow-hidden">
            <div className="p-5 pb-3">
                <h3 className="text-sm font-semibold text-white mb-1">Strategic Insights</h3>
                <p className="text-xs text-muted-foreground">AI mentor analysis of your specific project</p>
            </div>

            <div className="px-5 pb-5 space-y-4">
                {/* Strengths */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Strengths</span>
                    </div>
                    <div className="space-y-1.5">
                        {insights.strengths.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-2.5"
                            >
                                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{s}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border" />

                {/* Weaknesses */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Risks to Address</span>
                    </div>
                    <div className="space-y-1.5">
                        {insights.weaknesses.map((w, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 + 0.2 }}
                                className="flex items-start gap-2.5"
                            >
                                <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-orange-400 text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{w}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-border" />

                {/* Secret Weapon */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-3.5 rounded-xl bg-purple-500/8 border border-purple-500/15"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Secret Weapon</span>
                    </div>
                    <p className="text-sm text-purple-200 leading-relaxed">{insights.secretWeapon}</p>
                </motion.div>

                {/* Quick Win */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-3.5 rounded-xl bg-yellow-500/8 border border-yellow-500/15"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Quick Win This Week</span>
                    </div>
                    <p className="text-sm text-yellow-200 leading-relaxed">{insights.quickWin}</p>
                </motion.div>
            </div>
        </div>
    );
}
