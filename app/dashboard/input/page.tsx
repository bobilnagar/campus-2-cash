"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Sparkles, ChevronDown } from "lucide-react";
import { ProjectInput } from "@/types";
import { saveToLocalStorage } from "@/lib/utils";

export default function InputPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("SaaS & Software");
    const [skillLevel, setSkillLevel] = useState("Beginner");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        setLoading(true);

        const projectInput: ProjectInput = {
            title,
            description,
            techStack: [category, skillLevel], // mapping to techStack for backend compat
            targetAudience: "Not specified",
            preferredRevenue: "any",
        };

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("techStack", JSON.stringify([category, skillLevel]));

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            saveToLocalStorage("c2c_result", data);
            saveToLocalStorage("c2c_input", projectInput);

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to generate plan. Please verify logic or terminal for errors.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex items-center justify-center w-64 h-64 mb-8"
                >
                    {/* Abstract rotating scan ring */}
                    <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="2" />
                        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#spin-grad)" strokeWidth="2" strokeDasharray="30 200" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="spin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Inner glowing pulsing circle */}
                    <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                        <Sparkles className="w-8 h-8 text-primary shadow-primary z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-6">Analyzing your idea with AI...</h2>

                <div className="flex items-center gap-8 mb-16">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">SCANNING</span>
                        <div className="w-8 h-1 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">DRAFTING</span>
                        <div className="w-8 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">REFINING</span>
                        <div className="w-8 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">Initializing Cash Craft neural connectors...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-16 max-w-6xl">
            <div className="mb-10 max-w-3xl">
                <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
                    Generate Your <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Monetization Plan
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Transform your creative vision into a sustainable revenue machine. Our AI engine analyzes your project parameters to craft a bespoke growth strategy.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-8">
                {/* Left Form Area */}
                <div className="gradient-border card-gradient rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider">Project Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Neo-Synth Creative Agency"
                                className="w-full bg-[#1a1a23]/50 border border-border rounded-xl px-4 py-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors font-medium"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project goals, target audience, and current stage..."
                                className="w-full h-40 resize-none bg-[#1a1a23]/50 border border-border rounded-xl px-4 py-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-sm leading-relaxed"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2.5 relative">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full appearance-none bg-[#1a1a23]/50 border border-border rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors text-sm cursor-pointer"
                                    >
                                        <option>SaaS & Software</option>
                                        <option>E-Commerce</option>
                                        <option>Content & Media</option>
                                        <option>Agency / Services</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2.5 relative">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Skill Level (Optional)</label>
                                <div className="relative">
                                    <select
                                        value={skillLevel}
                                        onChange={(e) => setSkillLevel(e.target.value)}
                                        className="w-full appearance-none bg-[#1a1a23]/50 border border-border rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary transition-colors text-sm cursor-pointer"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Expert</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-bold transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                            >
                                Generate Plan
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Info Cards */}
                <div className="space-y-6">
                    <div className="gradient-border card-gradient rounded-3xl p-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-4">
                            <Lightbulb className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Projects with detailed descriptions generate 40% more accurate monetization paths. Focus on your USP.
                        </p>
                    </div>

                    <div className="relative h-[250px] rounded-3xl overflow-hidden border border-border group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0c0c14] z-0" />
                        {/* Abstract background waves/lines */}
                        <svg className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-50 transition-opacity z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" fill="url(#wave-grad)" />
                            <path d="M0,60 Q25,35 50,60 T100,60 L100,100 L0,100 Z" fill="url(#wave-grad)" opacity="0.5" />
                            <path d="M0,40 Q25,45 50,40 T100,40" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5" />
                            <defs>
                                <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="absolute bottom-6 left-6 right-6 z-10">
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">LIVE INSIGHTS</span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight">
                                Real-time Market Calibration
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "SAVED PLANS", value: "12" },
                    { label: "AVG. CONFIDENCE", value: "94%" },
                    { label: "CREDITS REMAINING", value: "450" },
                ].map((metric) => (
                    <div key={metric.label} className="gradient-border card-gradient rounded-3xl p-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{metric.label}</p>
                        <p className="text-4xl font-extrabold text-white">{metric.value}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
