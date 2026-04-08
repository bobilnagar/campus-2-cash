"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, Shield, ArrowRight, Github, Star } from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/sample-projects";

export default function HomePage() {
    const router = useRouter();

    const features = [
        {
            icon: <Sparkles className="w-6 h-6 text-purple-400" />,
            title: "AI Startup Mentor",
            desc: "5-dimension evaluation backed by 2026 market data — not generic advice.",
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
            title: "3–5 Monetization Paths",
            desc: "Tailored paths with pricing tiers, target users, and first 3 action steps.",
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Instant Refine Loop",
            desc: "Not satisfied? Give feedback and the AI regenerates immediately.",
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            title: "Export-Ready",
            desc: "One-click PDF pitch summary to share with investors or professors.",
        },
    ];

    return (
        <div className="min-h-screen hero-gradient overflow-hidden">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        C2
                    </div>
                    <span className="font-bold text-white text-lg tracking-tight">Campus-2-Cash</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </a>
                    <button
                        onClick={() => router.push("/dashboard/input")}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Try Now Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Built for Vibe Hack 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                        Turn Your Student{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Project Into Income
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Drop in your project description. Our AI evaluates it on 5 dimensions, predicts real-world value, and generates{" "}
                        <span className="text-white font-medium">3–5 monetization paths</span> grounded in 2026 market trends.
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-900/30 transition-all"
                        >
                            Analyze My Project
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <button
                            onClick={() => {
                                const el = document.getElementById("samples");
                                el?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-8 py-4 border border-border hover:border-purple-500/50 text-muted-foreground hover:text-white rounded-xl font-semibold text-lg transition-all"
                        >
                            See Examples
                        </button>
                    </div>
                </motion.div>

                {/* Animated stat badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center justify-center gap-8 mt-16 flex-wrap"
                >
                    {[
                        { value: "5", label: "Evaluation Dimensions" },
                        { value: "2026", label: "Market Trends Injected" },
                        { value: "3–5", label: "Monetization Paths" },
                        { value: "100%", label: "Free to Use" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Features */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="gradient-border card-gradient rounded-xl p-5 glow-purple-sm"
                        >
                            <div className="mb-3">{f.icon}</div>
                            <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Sample Projects */}
            <section id="samples" className="max-w-5xl mx-auto px-6 pb-24">
                <h2 className="text-2xl font-bold text-white text-center mb-3">
                    Pre-Loaded Demo Projects
                </h2>
                <p className="text-muted-foreground text-center mb-10">
                    Click any project to instantly populate the form and see the AI in action.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SAMPLE_PROJECTS.map((project, i) => (
                        <motion.button
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                                localStorage.setItem("selectedSample", project.id);
                                router.push("/dashboard/input");
                            }}
                            className="text-left gradient-border card-gradient rounded-xl p-5 hover:glow-purple-sm transition-all group"
                        >
                            <div className="text-3xl mb-3">{project.emoji}</div>
                            <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                                {project.description.slice(0, 120)}...
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {project.techStack.slice(0, 3).map((t) => (
                                    <span
                                        key={t}
                                        className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/dashboard/input")}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-900/30 transition-all"
                    >
                        Start With Your Own Project
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </section>

            {/* Workflow diagram */}
            <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
                <h2 className="text-2xl font-bold text-white mb-10">How It Works</h2>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    {[
                        { step: "1", label: "Input Project", icon: "📝" },
                        { step: "2", label: "AI Evaluates", icon: "🤖" },
                        { step: "3", label: "Get Paths", icon: "💡" },
                        { step: "4", label: "Refine & Export", icon: "🚀" },
                    ].map((item, idx) => (
                        <div key={item.step} className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-2xl mb-2">
                                    {item.icon}
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                            </div>
                            {idx < 3 && (
                                <ArrowRight className="w-5 h-5 text-muted-foreground/40 mb-4 hidden sm:block" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border text-center py-8 text-sm text-muted-foreground">
                Built with ❤️ for{" "}
                <span className="text-purple-400 font-medium">Vibe Hack 2026</span> ·{" "}
                Powered by OpenRouter · 100% Free
            </footer>
        </div>
    );
}
